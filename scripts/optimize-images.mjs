#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ORIGINALS_DIR = path.join(__dirname, '../public/img/gallery-originals');
const GALLERY_DIR = path.join(__dirname, '../public/img/gallery');

if (!fs.existsSync(GALLERY_DIR)) {
  fs.mkdirSync(GALLERY_DIR, { recursive: true });
}

async function optimizeImages() {
  const files = fs.readdirSync(ORIGINALS_DIR);
  let totalSaved = 0;

  console.log(`Found ${files.length} original files. Generating thumbnails (800px) and lightbox (2400px) versions...\n`);

  for (const file of files) {
    if (file.match(/\.(jpe?g|png|webp|avif)$/i)) {
      const inputPath = path.join(ORIGINALS_DIR, file);
      const basename = path.parse(file).name;
      
      const thumbPath = path.join(GALLERY_DIR, `${basename}-800.webp`);
      const lightboxPath = path.join(GALLERY_DIR, `${basename}-2400.webp`);

      // Skip if both already exist
      if (fs.existsSync(thumbPath) && fs.existsSync(lightboxPath)) {
        continue;
      }

      console.log(`Processing: ${file}`);
      
      // Generate 800px Thumbnail
      await sharp(inputPath)
        .resize({ width: 800, withoutEnlargement: true })
        .webp({ quality: 75, effort: 4 })
        .toFile(thumbPath);
        
      // Generate 2400px Lightbox
      await sharp(inputPath)
        .resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80, effort: 4 })
        .toFile(lightboxPath);
    }
  }

  console.log(`\nOptimization complete! All WebP versions are ready in public/img/gallery/.`);
}

optimizeImages().catch(console.error);
