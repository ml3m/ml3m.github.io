#!/usr/bin/env node

/**
 * Gallery Photo Sorter
 * 
 * Interactive CLI that shows each photo and lets you assign a category.
 * Auto-renames files to safe hash-based names (e.g. street-a3f9b2.jpg) to avoid collisions.
 * The website now dynamically reads these filenames!
 * 
 * Usage:  node scripts/sort-gallery.mjs
 */

import fs from "fs";
import path from "path";
import readline from "readline";
import { spawn } from "child_process";
import crypto from "crypto";

const ROOT = path.resolve(import.meta.dirname, "..");
const IMG_DIR = path.join(ROOT, "public", "img", "gallery");

const CATEGORIES = ["street", "nature", "events", "architecture", "souls", "other"];

const COLORS = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  yellow: "\x1b[33m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
};

const CAT_COLORS = {
  street:       COLORS.yellow,
  nature:       COLORS.green,
  events:       COLORS.red,
  architecture: COLORS.blue,
  souls:        COLORS.magenta,
  other:        COLORS.cyan,
};

// ── Discover images in directory ──────────────────────────
const files = fs.readdirSync(IMG_DIR);
const imageExts = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

const photosToSort = [];
let totalPhotos = 0;

for (const file of files) {
  const ext = path.extname(file).toLowerCase();
  if (!imageExts.has(ext)) continue;
  totalPhotos++;

  const basename = path.parse(file).name;
  
  // Check if it already matches the [category]-[hash] format
  const validCategory = CATEGORIES.find(c => basename.startsWith(`${c}-`));
  const isAlreadyFormatted = validCategory && new RegExp(`^${validCategory}-[a-f0-9]{6}$`).test(basename);
  
  if (!isAlreadyFormatted) {
    photosToSort.push({
      oldName: file,
      filePath: path.join(IMG_DIR, file),
      category: validCategory || "other"
    });
  }
}

// ── Interactive sorting ──────────────────────────────────────────────

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(prompt) {
  return new Promise((resolve) => rl.question(prompt, resolve));
}

let imvProcess = null;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function openImage(filePath) {
  if (imvProcess) {
    try { imvProcess.kill(); } catch {}
    imvProcess = null;
    await sleep(200); // give wayland time to cleanup window
  }
  try {
    imvProcess = spawn("imv", [filePath], {
      detached: true,
      stdio: "ignore",
    });
    imvProcess.unref();
  } catch {
    // silently fail if can't open
  }
}

function printHeader() {
  console.clear();
  console.log(`${COLORS.bold}${COLORS.magenta}╔══════════════════════════════════════════════╗${COLORS.reset}`);
  console.log(`${COLORS.bold}${COLORS.magenta}║     📸  Gallery Photo Sorter                 ║${COLORS.reset}`);
  console.log(`${COLORS.bold}${COLORS.magenta}╚══════════════════════════════════════════════╝${COLORS.reset}`);
  console.log();
}

function printCategories() {
  console.log(`${COLORS.dim}Categories:${COLORS.reset}`);
  CATEGORIES.forEach((cat, i) => {
    console.log(`  ${COLORS.bold}${CAT_COLORS[cat]}${i + 1}${COLORS.reset} → ${CAT_COLORS[cat]}${cat}${COLORS.reset}`);
  });
  console.log(`  ${COLORS.dim}s → skip (keep current)${COLORS.reset}`);
  console.log(`  ${COLORS.dim}q → quit & save${COLORS.reset}`);
  console.log();
}

async function main() {
  printHeader();

  if (photosToSort.length === 0) {
    console.log(`${COLORS.green}All ${totalPhotos} photos are already categorized and formatted!${COLORS.reset}\n`);
    rl.close();
    return;
  }

  console.log(`${COLORS.dim}Found ${photosToSort.length} new/unformatted photos to sort (out of ${totalPhotos} total).${COLORS.reset}`);
  console.log();

  let changed = 0;

  for (let i = 0; i < photosToSort.length; i++) {
    const photo = photosToSort[i];
    
    printHeader();
    printCategories();
    
    const currentColor = CAT_COLORS[photo.category] || COLORS.white;
    console.log(`${COLORS.bold}[${i + 1}/${photosToSort.length}]${COLORS.reset}  ${COLORS.white}${photo.oldName}${COLORS.reset}`);
    console.log(`  ${COLORS.dim}current: ${currentColor}${photo.category}${COLORS.reset}`);
    console.log();

    await openImage(photo.filePath);

    const input = await ask(`  ${COLORS.bold}Category (1-6, s=skip, q=quit):${COLORS.reset} `);
    const trimmed = input.trim().toLowerCase();

    if (trimmed === "q") {
      console.log(`\n${COLORS.yellow}Quitting early — saving progress...${COLORS.reset}`);
      break;
    }

    if (trimmed === "s" || trimmed === "") {
      console.log(`  ${COLORS.dim}→ skipped${COLORS.reset}`);
      continue;
    }

    const num = parseInt(trimmed);
    if (num >= 1 && num <= CATEGORIES.length) {
      const newCat = CATEGORIES[num - 1];
      photo.category = newCat;
      changed++;
      console.log(`  ${COLORS.green}→ ${CAT_COLORS[newCat]}${newCat}${COLORS.reset}`);
    }
  }

  // ── Auto-rename files ─────────────────────────────────────
  if (changed === 0 && photosToSort.length === 0) {
    console.log(`\n${COLORS.dim}No changes made.${COLORS.reset}`);
    if (imvProcess) { try { imvProcess.kill(); } catch {} }
    rl.close();
    return;
  }

  console.log(`\n${COLORS.yellow}Auto-renaming files...${COLORS.reset}`);

  for (const photo of photosToSort) {
    const ext = path.extname(photo.oldName).toLowerCase();
    const hash = crypto.randomBytes(3).toString("hex");
    const newFileName = `${photo.category}-${hash}${ext}`;
    const newFilePath = path.join(IMG_DIR, newFileName);

    if (fs.existsSync(photo.filePath)) {
      fs.renameSync(photo.filePath, newFilePath);
      console.log(`  ${COLORS.dim}${photo.oldName} → ${COLORS.white}${newFileName}${COLORS.reset}`);
    }
  }

  console.log(`\n${COLORS.green}✓ Done! The website will automatically detect these new filenames!${COLORS.reset}`);

  if (imvProcess) { try { imvProcess.kill(); } catch {} }
  rl.close();
}

main().catch((err) => {
  console.error(err);
  if (imvProcess) { try { imvProcess.kill(); } catch {} }
  rl.close();
  process.exit(1);
});
