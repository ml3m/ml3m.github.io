#!/usr/bin/env node

/**
 * Color Extraction Script
 *
 * Analyses every image in public/img/gallery-originals/ and maps each one
 * to 1-3 dominant Apple-rainbow colors.
 *
 * Output: public/img/gallery/color-map.json
 *
 * Usage:  node scripts/extract-colors.mjs
 *         node scripts/extract-colors.mjs --force   (re-process all)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ORIGINALS_DIR = path.join(__dirname, "../public/img/gallery-originals");
const OUTPUT_PATH = path.join(__dirname, "../public/img/gallery/color-map.json");

const FORCE = process.argv.includes("--force");

// ── Apple Rainbow Colors ────────────────────────────────────
// Hue ranges (in degrees) for mapping pixels to named colors.
// Saturation < 15% → "white" (covers B&W, greys, neutrals).
const HUE_RANGES = [
  { name: "red",    from: 340, to: 360 },
  { name: "red",    from: 0,   to: 15  },
  { name: "orange", from: 15,  to: 40  },
  { name: "yellow", from: 40,  to: 70  },
  { name: "green",  from: 70,  to: 165 },
  { name: "blue",   from: 165, to: 260 },
  { name: "purple", from: 260, to: 340 },
];

// ── Helpers ─────────────────────────────────────────────────

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return { h: h * 360, s, l };
}

function classifyPixel(r, g, b) {
  const { h, s } = rgbToHsl(r, g, b);
  if (s < 0.15) return { color: "white", s: 0 };
  
  let color = "white";
  for (const range of HUE_RANGES) {
    if (h >= range.from && h < range.to) { color = range.name; break; }
  }
  return { color, s };
}

async function extractDominantColors(filePath) {
  const { data, info } = await sharp(filePath)
    .resize(32, 32, { fit: "cover" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const totalPixels = info.width * info.height;
  let neutralCount = 0;

  // Saturation-weighted votes for chromatic colors only
  const votes = { green: 0, yellow: 0, orange: 0, red: 0, purple: 0, blue: 0 };

  for (let i = 0; i < data.length; i += 3) {
    const { color, s } = classifyPixel(data[i], data[i + 1], data[i + 2]);
    if (color === "white") {
      neutralCount++;
    } else {
      // Weight by s² so vivid colors shout louder than muted ones
      votes[color] += s * s;
    }
  }

  // Step 1: If the vast majority of pixels are desaturated → it's a B&W photo
  if (neutralCount / totalPixels >= 0.85) return ["white"];

  // Step 2: Pick top 2 chromatic colors (2nd must have at least 25% of 1st's votes)
  const sorted = Object.entries(votes).sort((a, b) => b[1] - a[1]);
  const top = [sorted[0][0]];
  if (sorted[1][1] >= sorted[0][1] * 0.25) {
    top.push(sorted[1][0]);
  }
  return top;
}

// ── Main ────────────────────────────────────────────────────

async function main() {
  if (!fs.existsSync(ORIGINALS_DIR)) {
    console.error("No gallery-originals directory found.");
    process.exit(1);
  }

  // Load existing map (for incremental runs)
  let colorMap = {};
  if (!FORCE && fs.existsSync(OUTPUT_PATH)) {
    try {
      colorMap = JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf-8"));
    } catch {
      colorMap = {};
    }
  }

  const files = fs.readdirSync(ORIGINALS_DIR);
  const imageExts = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
  let processed = 0;
  let skipped = 0;

  console.log(`Scanning ${files.length} files in gallery-originals/...\n`);

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!imageExts.has(ext)) continue;

    const basename = path.parse(file).name;

    // Skip if already analysed (incremental)
    if (!FORCE && colorMap[basename]) {
      skipped++;
      continue;
    }

    const filePath = path.join(ORIGINALS_DIR, file);
    try {
      const colors = await extractDominantColors(filePath);
      colorMap[basename] = colors;
      processed++;
      console.log(`  ${basename}: ${colors.join(", ")}`);
    } catch (err) {
      console.warn(`  ⚠ Failed: ${file} — ${err.message}`);
    }
  }

  // Write output
  const galleryDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(galleryDir)) {
    fs.mkdirSync(galleryDir, { recursive: true });
  }
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(colorMap, null, 2));

  console.log(`\nDone! Processed ${processed}, skipped ${skipped} (already in map).`);
  console.log(`Output: ${OUTPUT_PATH}`);
}

main().catch(console.error);
