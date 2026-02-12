// Generate app icon as a 1024x1024 PNG
// Run: node generate-icon.js
// Requires no dependencies - uses built-in canvas alternative

const fs = require('fs');
const { createCanvas } = (() => {
  try {
    return require('canvas');
  } catch(e) {
    return { createCanvas: null };
  }
})();

if (!createCanvas) {
  // Fallback: generate an SVG and provide instructions
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f1320"/>
      <stop offset="100%" style="stop-color:#06080f"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#818cf8"/>
      <stop offset="100%" style="stop-color:#f472b6"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" rx="224" fill="url(#bg)"/>
  <rect x="80" y="80" width="864" height="864" rx="180" fill="none" stroke="#263354" stroke-width="4"/>
  <!-- NUM text -->
  <text x="512" y="380" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="200" font-weight="900" fill="#818cf8" letter-spacing="-8">NUM</text>
  <!-- Dot -->
  <circle cx="512" cy="480" r="24" fill="#f59e0b"/>
  <!-- DUEL text -->
  <text x="512" y="700" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="200" font-weight="900" fill="#f472b6" letter-spacing="-8">DUEL</text>
  <!-- Decorative digits -->
  <text x="160" y="900" font-family="monospace" font-size="72" font-weight="700" fill="#263354" opacity="0.5">1 2 3 4</text>
  <text x="580" y="900" font-family="monospace" font-size="72" font-weight="700" fill="#263354" opacity="0.5">5 6 7 8</text>
</svg>`;

  fs.writeFileSync('AppIcon.svg', svg);
  console.log('Generated AppIcon.svg');
  console.log('');
  console.log('To convert to PNG for the App Store, you can:');
  console.log('1. Open AppIcon.svg in a browser and screenshot at 1024x1024');
  console.log('2. Use an online SVG to PNG converter');
  console.log('3. On macOS with sips: convert manually');
  console.log('4. Install canvas: npm install canvas && node generate-icon.js');
  console.log('');
  console.log('Then copy the 1024x1024 PNG to:');
  console.log('  ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png');
} else {
  const canvas = createCanvas(1024, 1024);
  const ctx = canvas.getContext('2d');

  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, 1024, 1024);
  bgGrad.addColorStop(0, '#0f1320');
  bgGrad.addColorStop(1, '#06080f');

  // Rounded rect background
  const r = 224;
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(1024 - r, 0);
  ctx.quadraticCurveTo(1024, 0, 1024, r);
  ctx.lineTo(1024, 1024 - r);
  ctx.quadraticCurveTo(1024, 1024, 1024 - r, 1024);
  ctx.lineTo(r, 1024);
  ctx.quadraticCurveTo(0, 1024, 0, 1024 - r);
  ctx.lineTo(0, r);
  ctx.quadraticCurveTo(0, 0, r, 0);
  ctx.closePath();
  ctx.fillStyle = bgGrad;
  ctx.fill();

  // NUM text
  ctx.font = '900 200px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#818cf8';
  ctx.fillText('NUM', 512, 380);

  // Dot
  ctx.beginPath();
  ctx.arc(512, 480, 24, 0, Math.PI * 2);
  ctx.fillStyle = '#f59e0b';
  ctx.fill();

  // DUEL text
  ctx.fillStyle = '#f472b6';
  ctx.fillText('DUEL', 512, 700);

  const buf = canvas.toBuffer('image/png');
  const outPath = 'ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png';
  fs.writeFileSync(outPath, buf);
  console.log(`Generated ${outPath}`);
}
