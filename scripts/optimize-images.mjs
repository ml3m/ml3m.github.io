import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GALLERY_DIR = path.join(__dirname, '../public/img/gallery');

async function optimizeImages() {
  const files = fs.readdirSync(GALLERY_DIR);
  let totalSaved = 0;

  for (const file of files) {
    if (file.match(/\.(jpe?g|png|webp)$/i)) {
      const inputPath = path.join(GALLERY_DIR, file);
      const isAlreadyWebp = file.toLowerCase().endsWith('.webp');
      const outputPath = path.join(GALLERY_DIR, `${path.parse(file).name}.webp`);

      const statsBefore = fs.statSync(inputPath);
      
      console.log(`Optimizing ${file}...`);
      
      const buffer = await sharp(inputPath)
        .resize({ width: 2560, height: 2560, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 75, effort: 6 }) 
        .toBuffer();
        
      fs.writeFileSync(outputPath, buffer);

      const statsAfter = fs.statSync(outputPath);
      const saved = statsBefore.size - statsAfter.size;
      totalSaved += saved;

      console.log(`Saved ${(saved / 1024 / 1024).toFixed(2)} MB`);
      
      // Delete original only if it had a different extension
      if (!isAlreadyWebp) {
        fs.unlinkSync(inputPath); 
      }
    }
  }

  console.log(`\nOptimization complete! Total space saved: ${(totalSaved / 1024 / 1024).toFixed(2)} MB`);

  // Update lib/gallery.ts to use .webp extensions
  const galleryTsPath = path.join(__dirname, '../lib/gallery.ts');
  if (fs.existsSync(galleryTsPath)) {
    let content = fs.readFileSync(galleryTsPath, 'utf8');
    content = content.replace(/\.(jpe?g|JPE?G|png|PNG)"/g, '.webp"');
    fs.writeFileSync(galleryTsPath, content);
    console.log('Updated lib/gallery.ts to use .webp extensions');
  }
}

optimizeImages().catch(console.error);
