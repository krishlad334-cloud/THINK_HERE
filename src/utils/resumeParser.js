function cleanExtractedText(raw) {
  let out = '';
  for (let i = 0; i < raw.length; i += 1) {
    const code = raw.charCodeAt(i);
    if (code === 10 || code === 13 || code === 9 || (code >= 32 && code <= 126) || code >= 160) {
      out += raw[i];
    } else {
      out += ' ';
    }
  }
  return out
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n[ ]+/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

async function inflateBytes(bytes, format) {
  if (typeof DecompressionStream === 'undefined') {
    return null;
  }
  try {
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream(format));
    const buffer = await new Response(stream).arrayBuffer();
    return new Uint8Array(buffer);
  } catch {
    return null;
  }
}

function findSequence(haystack, needle, fromIndex = 0) {
  outer: for (let i = fromIndex; i <= haystack.length - needle.length; i += 1) {
    for (let j = 0; j < needle.length; j += 1) {
      if (haystack[i + j] !== needle[j]) continue outer;
    }
    return i;
  }
  return -1;
}

function reconstructPageLines(items) {
  const rows = [];
  let currentRow = null;

  for (const item of items) {
    const str = (item.str || '').trim();
    if (!str) {
      if (item.hasEOL && currentRow) {
        rows.push(currentRow.parts.join(' '));
        currentRow = null;
      }
      continue;
    }

    const y = Math.round((item.transform?.[5] ?? 0) / 4) * 4;
    if (!currentRow || Math.abs(currentRow.y - y) > 4) {
      if (currentRow) {
        rows.push(currentRow.parts.join(' '));
      }
      currentRow = { y, parts: [str] };
    } else {
      currentRow.parts.push(str);
    }

    if (item.hasEOL) {
      rows.push(currentRow.parts.join(' '));
      currentRow = null;
    }
  }

  if (currentRow) {
    rows.push(currentRow.parts.join(' '));
  }

  return rows.join('\n');
}

async function parsePdfText(arrayBuffer) {
  let loadingTask = null;
  try {
    const pdfjsLib = await import('pdfjs-dist');
    const workerModule = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerModule.default;

    const bytes = new Uint8Array(arrayBuffer);
    loadingTask = pdfjsLib.getDocument({
      data: bytes,
      verbosity: 0,
    });
    const pdf = await loadingTask.promise;

    const pageTexts = [];
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageLines = reconstructPageLines(textContent.items || []);
      if (pageLines.trim()) {
        pageTexts.push(pageLines.trim());
      }
    }

    return cleanExtractedText(pageTexts.join('\n\n'));
  } catch {
    return '';
  } finally {
    if (loadingTask) {
      await loadingTask.destroy().catch(() => {});
    }
  }
}

async function parseDocxText(arrayBuffer) {
  const bytes = new Uint8Array(arrayBuffer);
  const view = new DataView(arrayBuffer);
  const decoder = new TextDecoder('utf-8', { fatal: false });
  let offset = 0;
  let xmlContent = '';

  while (offset + 30 <= bytes.length) {
    if (view.getUint32(offset, true) !== 0x04034b50) {
      break;
    }

    const flags = view.getUint16(offset + 6, true);
    const compression = view.getUint16(offset + 8, true);
    const compressedSize = view.getUint32(offset + 18, true);
    const nameLen = view.getUint16(offset + 26, true);
    const extraLen = view.getUint16(offset + 28, true);

    const nameStart = offset + 30;
    const entryName = decoder.decode(bytes.slice(nameStart, nameStart + nameLen));
    const dataStart = nameStart + nameLen + extraLen;

    let dataEnd = dataStart + compressedSize;
    if ((flags & 0x08) !== 0 || compressedSize === 0) {
      const nextSig = findSequence(bytes, new Uint8Array([0x50, 0x4b, 0x03, 0x04]), dataStart);
      const centralSig = findSequence(bytes, new Uint8Array([0x50, 0x4b, 0x01, 0x02]), dataStart);
      if (nextSig !== -1 && centralSig !== -1) dataEnd = Math.min(nextSig, centralSig);
      else if (nextSig !== -1) dataEnd = nextSig;
      else if (centralSig !== -1) dataEnd = centralSig;
      else dataEnd = bytes.length;
    }

    const payload = bytes.slice(dataStart, Math.min(dataEnd, bytes.length));

    if (entryName === 'word/document.xml') {
      if (compression === 0) {
        xmlContent = decoder.decode(payload);
      } else if (compression === 8) {
        const inflated = await inflateBytes(payload, 'deflate-raw');
        if (inflated) {
          xmlContent = decoder.decode(inflated);
        }
      }
      break;
    }

    offset = dataEnd;
  }

  if (!xmlContent) return '';

  const stripped = xmlContent
    .replace(/<\/w:p>/g, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');
  return cleanExtractedText(stripped);
}

export async function extractTextFromResumeFile(file) {
  if (!file) {
    return { text: '', warning: 'No file selected.' };
  }

  const name = (file.name || '').toLowerCase();

  if (
    name.endsWith('.txt') ||
    name.endsWith('.md') ||
    name.endsWith('.csv') ||
    name.endsWith('.json')
  ) {
    const text = cleanExtractedText(await file.text());
    return { text, warning: '' };
  }

  const buffer = await file.arrayBuffer();

  if (name.endsWith('.pdf')) {
    const text = await parsePdfText(buffer);
    if (text.length < 30) {
      return {
        text,
        warning:
          'No selectable text was found in this PDF (it may be an image-only scan). Please upload a text-based PDF, DOCX/TXT file, or paste your resume text.',
      };
    }
    return { text, warning: '' };
  }

  if (name.endsWith('.docx')) {
    const text = await parseDocxText(buffer);
    if (text.length < 25) {
      return {
        text,
        warning:
          'Limited readable text was extracted from this DOCX file. You can paste your resume text to refine matches.',
      };
    }
    return { text, warning: '' };
  }

  const rawText = await file.text();
  const text = cleanExtractedText(rawText);
  return {
    text,
    warning:
      text.length < 25
        ? 'Could not extract readable text from this format. Please upload PDF, DOCX, or TXT—or paste your resume text.'
        : '',
  };
}
