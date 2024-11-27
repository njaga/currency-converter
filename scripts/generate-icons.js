const sharp = require('sharp');
const fs = require('fs').promises;

async function generateIcons() {
  // Lire le SVG source
  const svgBuffer = await fs.readFile('./public/favicon.svg');
  
  // Liste des tailles d'icônes à générer
  const sizes = {
    'favicon.ico': 32,
    'favicon-16x16.png': 16,
    'favicon-32x32.png': 32,
    'apple-touch-icon.png': 180,
    'android-chrome-192x192.png': 192,
    'android-chrome-512x512.png': 512
  };

  // Générer chaque taille
  for (const [filename, size] of Object.entries(sizes)) {
    await sharp(svgBuffer)
      .resize(size, size)
      .toFile(`./public/${filename}`);
  }
}

generateIcons().catch(console.error);