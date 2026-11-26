import {
  INTEREST_SIGNALS,
  QUALIFICATION_PATTERNS,
  SKILL_TAXONOMY,
} from '../data/resumeTaxonomy.js';

const STORAGE_PREFIX = 'think_resume_profile_';
const PARSER_VERSION = 2;

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function hasKeywordMatch(lowerText, keyword) {
  const clean = keyword.toLowerCase().trim();
  if (!clean) return false;
  const pattern = new RegExp(`(^|[^a-z0-9])${escapeRegex(clean)}([^a-z0-9]|$)`, 'i');
  return pattern.test(lowerText);
}

function detectExperienceProfile(text) {
  let maxYears = 0;

  const yearMentions = text.matchAll(/(\d+(?:\.\d+)?)\s*\+?\s*(?:years?|yrs?)(?:\s+of)?(?:\s+experience|\s+in|\s+leading|\s+building)?/gi);
  for (const match of yearMentions) {
    const parsed = parseFloat(match[1]);
    if (!Number.isNaN(parsed) && parsed > 0 && parsed <= 45) {
      maxYears = Math.max(maxYears, parsed);
    }
  }

  const currentYear = new Date().getFullYear();
  const lines = text.split(/\r?\n/);
  let earliestWorkYear = null;
  let latestWorkYear = null;
  let hasInternship = false;

  for (const line of lines) {
    if (/\b(intern|internship|trainee|apprentice)\b/i.test(line)) {
      hasInternship = true;
    }

    const isEducationLine = /\b(bachelor|master|university|college|school|institute|b\.?tech|b\.?e\.|bca|mca|b\.?com|b\.?sc|m\.?sc|diploma|cgpa|gpa|12th|10th|ssc|hsc)\b/i.test(
      line
    );
    if (isEducationLine) continue;

    const rangeMatches = line.matchAll(
      /(19\d{2}|20\d{2})\s*(?:-|–|—|to)\s*(present|current|now|19\d{2}|20\d{2})/gi
    );
    for (const match of rangeMatches) {
      const startYear = parseInt(match[1], 10);
      const endToken = match[2].toLowerCase();
      const endYear =
        endToken === 'present' || endToken === 'current' || endToken === 'now'
          ? currentYear
          : parseInt(endToken, 10);

      if (startYear >= 1980 && endYear >= startYear && endYear <= currentYear + 1) {
        earliestWorkYear =
          earliestWorkYear === null ? startYear : Math.min(earliestWorkYear, startYear);
        latestWorkYear = latestWorkYear === null ? endYear : Math.max(latestWorkYear, endYear);
      }
    }
  }

  if (earliestWorkYear !== null && latestWorkYear !== null) {
    maxYears = Math.max(maxYears, Math.min(40, latestWorkYear - earliestWorkYear));
  }

  const years = Math.round(maxYears * 10) / 10;
  let seniorityLevel = 'Entry Level / Fresher';
  if (years >= 8) seniorityLevel = 'Lead / Principal';
  else if (years >= 5) seniorityLevel = 'Senior Level';
  else if (years >= 2) seniorityLevel = 'Mid-Level';
  else if (hasInternship || /\bprojects?\b/i.test(text)) {
    seniorityLevel = 'Early Career / Internship';
  }

  return { experienceYears: years, seniorityLevel, hasInternship };
}

function extractExplicitInterests(text) {
  const explicit = [];
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    const match = line.match(
      /^(?:interests|career interests|areas of interest|focus areas|objective|summary)\s*:\s*(.+)$/i
    );
    if (match && match[1]) {
      match[1]
        .split(/,|;|\band\b/i)
        .map((item) => item.trim().replace(/\.$/, ''))
        .filter((item) => item.length > 2 && item.length <= 42)
        .forEach((item) => explicit.push(item));
    }
  }
  return explicit;
}

function extractHeadline(text, fileName) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length >= 3 && line.length <= 90 && !/^SSL Corporation/i.test(line));

  if (lines.length > 0) {
    const cleanLine = lines.find((line) => /[a-zA-Z]{2,}/.test(line));
    if (cleanLine) return cleanLine;
  }

  if (fileName) return fileName.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' ').trim();
  return 'Uploaded Candidate Resume';
}

function tokenizeWords(value) {
  const stopWords = new Set(['and', 'for', 'the', 'of', 'in', 'to', 'with', 'ops']);
  return value
    .toLowerCase()
    .split(/[^a-z0-9+#]+/)
    .filter((token) => token.length >= 2 && !stopWords.has(token));
}

export function analyzeResumeText(rawText, meta = {}) {
  const safeText = (rawText || '').trim();
  const searchable = safeText ? safeText : (meta.fileName || '');
  const lower = searchable.toLowerCase();

  const matchedSkills = [];
  const industryScores = {};

  const bumpIndustry = (industry, weight) => {
    if (!industry) return;
    industryScores[industry] = (industryScores[industry] || 0) + weight;
  };

  for (const entry of SKILL_TAXONOMY) {
    const labelMatch = hasKeywordMatch(lower, entry.label);
    const aliasMatch = entry.aliases.some((alias) => hasKeywordMatch(lower, alias));
    if (labelMatch || aliasMatch) {
      if (!matchedSkills.includes(entry.label)) {
        matchedSkills.push(entry.label);
      }
      bumpIndustry(entry.industry, 3);
    }
  }

  const matchedQualifications = [];
  for (const qual of QUALIFICATION_PATTERNS) {
    if (qual.regex.test(searchable)) {
      matchedQualifications.push(qual.label);
      if (qual.label.includes('Nurse')) bumpIndustry('Healthcare', 4);
      if (qual.label.includes('J.D.')) bumpIndustry('Legal & Compliance', 4);
      if (qual.label.includes('Pharmacy')) bumpIndustry('Pharma & Biotechnology', 4);
      if (qual.label.includes('CPA') || qual.label.includes('MBA')) {
        bumpIndustry('Finance', 4);
      }
      if (qual.label.includes('CFA')) {
        bumpIndustry('Finance', 3);
        bumpIndustry('Banking & Insurance', 3);
      }
      if (qual.label.includes('Education')) bumpIndustry('Education', 4);
      if (qual.label.includes('Public Policy')) bumpIndustry('Government', 4);
      if (qual.label.includes('PE /') || qual.label.includes('B.Tech')) {
        bumpIndustry(qual.label.includes('B.Tech') ? 'IT & Software' : 'Engineering', 3);
      }
      if (qual.label.includes('SHRM')) bumpIndustry('Human Resources', 4);
      if (qual.label.includes('Six Sigma')) bumpIndustry('Manufacturing & Quality', 4);
      if (qual.label.includes('AWS') || qual.label.includes('BCA') || qual.label.includes('MCA')) {
        bumpIndustry('IT & Software', 4);
      }
    }
  }

  const detectedInterests = [];
  for (const signal of INTEREST_SIGNALS) {
    const hitCount = signal.aliases.filter((alias) => hasKeywordMatch(lower, alias)).length;
    if (hitCount > 0) {
      detectedInterests.push(signal.label);
      bumpIndustry(signal.industry, hitCount * 2);
    }
  }

  for (const item of extractExplicitInterests(safeText)) {
    if (!detectedInterests.some((existing) => existing.toLowerCase() === item.toLowerCase())) {
      detectedInterests.unshift(item);
    }
  }

  const rankedIndustries = Object.entries(industryScores)
    .sort((a, b) => b[1] - a[1])
    .map(([industry, weight]) => ({ industry, weight }));

  const { experienceYears, seniorityLevel, hasInternship } = detectExperienceProfile(safeText);

  return {
    id: `res_${Date.now()}`,
    parserVersion: PARSER_VERSION,
    fileName: meta.fileName || 'Pasted_Resume.txt',
    fileSizeLabel: meta.fileSizeLabel || `${Math.max(1, Math.round(safeText.length / 1024))} KB`,
    analyzedAt: new Date().toISOString(),
    headline: extractHeadline(safeText, meta.fileName),
    rawText: safeText,
    wordCount: safeText ? safeText.split(/\s+/).length : 0,
    skills: matchedSkills,
    qualifications: matchedQualifications,
    experienceYears,
    hasInternship,
    seniorityLevel,
    interests: detectedInterests.slice(0, 6),
    topIndustries: rankedIndustries.slice(0, 3).map((item) => item.industry),
    primaryIndustry: rankedIndustries[0]?.industry || 'General / Cross-Industry',
    warning: meta.warning || '',
  };
}

export function rankJobsByResume(jobs, resumeProfile) {
  if (!resumeProfile) {
    return jobs.map((job) => ({
      ...job,
      matchScore: parseInt(job.matchPercentage, 10) || 85,
      matchedSkills: [],
      matchReasons: [],
      isRecommended: false,
    }));
  }

  const rawLower = (resumeProfile.rawText || '').toLowerCase();
  const profileSkillsLower = (resumeProfile.skills || []).map((s) => s.toLowerCase());
  const profileSkillTokenSets = profileSkillsLower.map((s) => new Set(tokenizeWords(s)));
  const profileQualsLower = (resumeProfile.qualifications || []).map((q) => q.toLowerCase());
  const profileInterestsLower = (resumeProfile.interests || []).map((i) => i.toLowerCase());
  const topIndustries = resumeProfile.topIndustries || [];

  const scored = jobs.map((job) => {
    const jobText = `${job.title} ${job.description} ${(job.interests || []).join(' ')}`.toLowerCase();
    const matchedSkills = [];

    for (const skill of job.skills || []) {
      const skillLower = skill.toLowerCase();
      const jobSkillTokens = tokenizeWords(skillLower);
      const directHit =
        hasKeywordMatch(rawLower, skillLower) ||
        profileSkillsLower.some((ps) => ps === skillLower) ||
        jobSkillTokens.some((token) =>
          profileSkillTokenSets.some((tokenSet) => tokenSet.has(token))
        );
      if (directHit) {
        matchedSkills.push(skill);
      }
    }

    const totalSkills = Math.max(1, (job.skills || []).length);
    const skillRatio = matchedSkills.length / totalSkills;

    let score = 26 + Math.round(skillRatio * 44);
    const matchReasons = [];

    if (matchedSkills.length > 0) {
      matchReasons.push(
        `Matches ${matchedSkills.length} key skill${matchedSkills.length > 1 ? 's' : ''}`
      );
    }

    if (job.industry === resumeProfile.primaryIndustry) {
      score += 24;
      matchReasons.push(`Primary field: ${job.industry}`);
    } else if (topIndustries.includes(job.industry)) {
      score += 14;
      matchReasons.push(`Aligned with ${job.industry}`);
    }

    const qualMatch = (job.qualifications || []).some((qual) => {
      const qTokens = qual.toLowerCase().split(/[\s/().-]+/).filter((w) => w.length >= 2);
      return (
        hasKeywordMatch(rawLower, qual) ||
        profileQualsLower.some((pq) => qTokens.some((token) => pq.includes(token)))
      );
    });
    if (qualMatch) {
      score += 10;
      matchReasons.push('Qualifications align');
    }

    if (resumeProfile.experienceYears >= (job.minYears || 0)) {
      score += 6;
      if (resumeProfile.experienceYears > 0) {
        matchReasons.push(`${resumeProfile.experienceYears}+ yrs experience fits`);
      } else if (job.minYears === 0) {
        matchReasons.push('Entry-friendly role');
      }
    } else if (resumeProfile.experienceYears > 0) {
      score -= 4;
    }

    const interestMatch = (job.interests || []).some((interest) =>
      profileInterestsLower.some((pi) =>
        interest
          .toLowerCase()
          .split(/\s+/)
          .some((word) => word.length > 3 && pi.includes(word))
      )
    );
    if (interestMatch || profileSkillsLower.some((ps) => jobText.includes(ps.split(' ')[0]))) {
      score += 5;
    }

    const boundedScore = Math.max(25, Math.min(99, score));
    const isRecommended =
      boundedScore >= 60 ||
      (matchedSkills.length >= 1 && job.industry === resumeProfile.primaryIndustry);

    return {
      ...job,
      matchScore: boundedScore,
      matchPercentage: `${boundedScore}%`,
      matchedSkills,
      matchReasons: matchReasons.slice(0, 3),
      isRecommended,
    };
  });

  return scored.sort((a, b) => b.matchScore - a.matchScore);
}

export function loadSavedResumeProfile(userId) {
  if (typeof window === 'undefined' || !userId) return null;
  try {
    const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${userId}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.parserVersion !== PARSER_VERSION) {
      window.localStorage.removeItem(`${STORAGE_PREFIX}${userId}`);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function saveResumeProfile(userId, profile) {
  if (typeof window === 'undefined' || !userId) return;
  try {
    if (!profile) {
      window.localStorage.removeItem(`${STORAGE_PREFIX}${userId}`);
    } else {
      window.localStorage.setItem(`${STORAGE_PREFIX}${userId}`, JSON.stringify(profile));
    }
  } catch {
    return;
  }
}
