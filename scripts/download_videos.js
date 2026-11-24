import https from 'https';
import fs from 'fs';

const videos = [
  { id: '5601', dest: 'public/scene1_overthinking.mp4', name: 'Scene 1: Overthinking' },
  { id: '48503', dest: 'public/scene2_searching.mp4', name: 'Scene 2: Searching' },
  { id: '308', dest: 'public/scene3_discover.mp4', name: 'Scene 3: Discover' },
  { id: '42664', dest: 'public/scene4_consultant.mp4', name: 'Scene 4: Consultant' },
  { id: '33031', dest: 'public/scene5_succeed.mp4', name: 'Scene 5: Succeed' }
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: status ${res.statusCode}`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

(async () => {
  for (const v of videos) {
    const url = `https://assets.mixkit.co/videos/${v.id}/${v.id}-720.mp4`;
    console.log(`Downloading ${v.name} -> ${v.dest}...`);
    try {
      await download(url, v.dest);
      const stat = fs.statSync(v.dest);
      console.log(`✓ ${v.name} downloaded: ${(stat.size / 1024 / 1024).toFixed(2)} MB`);
    } catch (e) {
      console.error(`✗ Error downloading ${v.name}:`, e.message);
    }
  }
  console.log('All downloads complete!');
})();
