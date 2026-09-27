#!/usr/bin/env node

/**
 * 📸 Photo Tagger — Web-based tagging GUI
 *
 * Usage:  node scripts/tag-gallery.mjs
 * Opens:  http://localhost:3456
 *
 * Keyboard-driven tagging for categories (number keys) and colors (letter keys).
 * Zero dependencies — uses only Node built-ins.
 */

import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const ORIGINALS_DIR = path.join(ROOT, "public", "img", "gallery-originals");
const GALLERY_DIR = path.join(ROOT, "public", "img", "gallery");
const COLOR_MAP_PATH = path.join(GALLERY_DIR, "color-map.json");
const PORT = 3456;

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const MIME_TYPES = {
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".png": "image/png", ".webp": "image/webp",
  ".avif": "image/avif", ".html": "text/html",
  ".json": "application/json",
};

// ── Data helpers ────────────────────────────────────────────

function readColorMap() {
  try { return JSON.parse(fs.readFileSync(COLOR_MAP_PATH, "utf-8")); }
  catch { return {}; }
}

function saveColorMap(map) {
  fs.writeFileSync(COLOR_MAP_PATH, JSON.stringify(map, null, 2));
}

function getPhotos() {
  if (!fs.existsSync(ORIGINALS_DIR)) return [];
  const colorMap = readColorMap();
  const photos = [];

  for (const file of fs.readdirSync(ORIGINALS_DIR)) {
    const ext = path.extname(file).toLowerCase();
    if (!IMAGE_EXTS.has(ext)) continue;
    const basename = path.parse(file).name;
    const dashIdx = basename.indexOf("-");
    const category = dashIdx > 0 ? basename.substring(0, dashIdx) : "other";
    const hash = dashIdx > 0 ? basename.substring(dashIdx + 1) : basename;

    // Check which image to serve for preview
    const webp2400 = `${basename}-2400.webp`;
    const hasWebp = fs.existsSync(path.join(GALLERY_DIR, webp2400));

    photos.push({
      id: basename,
      file,
      ext,
      hash,
      category,
      colors: colorMap[basename] || [],
      previewSrc: hasWebp ? `/img/gallery/${webp2400}` : `/img/gallery-originals/${file}`,
    });
  }
  return photos;
}

function getCategories() {
  const cats = new Set();
  if (fs.existsSync(ORIGINALS_DIR)) {
    for (const file of fs.readdirSync(ORIGINALS_DIR)) {
      const ext = path.extname(file).toLowerCase();
      if (!IMAGE_EXTS.has(ext)) continue;
      const basename = path.parse(file).name;
      const dashIdx = basename.indexOf("-");
      if (dashIdx > 0) cats.add(basename.substring(0, dashIdx));
    }
  }
  // Ensure defaults
  for (const c of ["street", "nature", "events", "architecture", "souls", "rotterdam", "other"]) {
    cats.add(c);
  }
  return [...cats].sort();
}

// ── API handlers ────────────────────────────────────────────

function handleApiPhotos(res) {
  const photos = getPhotos();
  const categories = getCategories();
  json(res, { photos, categories });
}

function handleApiColor(body, res) {
  const { id, colors } = body;
  const map = readColorMap();
  map[id] = colors;
  saveColorMap(map);
  json(res, { ok: true });
}

function handleApiCategory(body, res) {
  const { id, category } = body;

  // Find the original file
  const photos = getPhotos();
  const photo = photos.find(p => p.id === id);
  if (!photo) return json(res, { error: "Photo not found" }, 404);
  if (photo.category === category) return json(res, { ok: true, newId: id });

  const newBasename = `${category}-${photo.hash}`;
  const newFile = `${newBasename}${photo.ext}`;

  // Rename original
  const oldOrigPath = path.join(ORIGINALS_DIR, photo.file);
  const newOrigPath = path.join(ORIGINALS_DIR, newFile);
  if (fs.existsSync(oldOrigPath)) fs.renameSync(oldOrigPath, newOrigPath);

  // Rename thumbnails (if they exist)
  for (const suffix of ["-800.webp", "-2400.webp"]) {
    const oldThumb = path.join(GALLERY_DIR, `${id}${suffix}`);
    const newThumb = path.join(GALLERY_DIR, `${newBasename}${suffix}`);
    if (fs.existsSync(oldThumb)) fs.renameSync(oldThumb, newThumb);
  }

  // Update color map key
  const map = readColorMap();
  if (map[id]) {
    map[newBasename] = map[id];
    delete map[id];
    saveColorMap(map);
  }

  json(res, { ok: true, newId: newBasename });
}

// ── HTTP utilities ──────────────────────────────────────────

function json(res, data, status = 200) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", c => data += c);
    req.on("end", () => resolve(JSON.parse(data)));
  });
}

function serveFile(filePath, res) {
  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    return res.end("Not found");
  }
  const ext = path.extname(filePath).toLowerCase();
  const mime = MIME_TYPES[ext] || "application/octet-stream";
  res.writeHead(200, { "Content-Type": mime });
  fs.createReadStream(filePath).pipe(res);
}

// ── HTML ────────────────────────────────────────────────────

const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>📸 Photo Tagger</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    background: #100c1a;
    color: #e8d5ff;
    font-family: 'Space Mono', 'SF Mono', 'Fira Code', monospace;
    font-size: 13px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    user-select: none;
  }

  /* Header */
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
    border-bottom: 1px solid #3d2060;
    flex-shrink: 0;
  }
  header .title { font-weight: bold; font-size: 15px; }
  header .title span { color: #ff4da6; }
  .filter-badge {
    padding: 3px 10px;
    border-radius: 3px;
    background: #1a1230;
    border: 1px solid #3d2060;
    cursor: pointer;
    font-size: 11px;
    letter-spacing: 0.5px;
  }
  .filter-badge:hover { border-color: #7b35cc; }
  .progress { color: #7a5f99; font-size: 12px; }

  /* Photo Area */
  main {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
    position: relative;
    min-height: 0;
  }
  #photo {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 4px;
    border: 1px solid #3d2060;
    transition: opacity 0.15s;
  }
  #photo.loading { opacity: 0.3; }
  #filename {
    position: absolute;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    background: #1a1230dd;
    border: 1px solid #3d2060;
    padding: 4px 14px;
    border-radius: 3px;
    font-size: 11px;
    color: #7a5f99;
    backdrop-filter: blur(8px);
  }

  /* Nav arrows */
  .nav-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: #1a1230cc;
    border: 1px solid #3d2060;
    color: #7a5f99;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    cursor: pointer;
    font-size: 20px;
    backdrop-filter: blur(8px);
    transition: all 0.15s;
  }
  .nav-arrow:hover { border-color: #c77dff; color: #c77dff; }
  .nav-arrow.left { left: 16px; }
  .nav-arrow.right { right: 16px; }

  /* Controls */
  footer {
    flex-shrink: 0;
    border-top: 1px solid #3d2060;
    padding: 12px 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .control-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  .control-row .label {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #7a5f99;
    width: 75px;
    flex-shrink: 0;
  }

  /* Key badge */
  .key {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 5px;
    background: #0d0a14;
    border: 1px solid #3d2060;
    border-radius: 3px;
    font-size: 10px;
    font-weight: bold;
    color: #7a5f99;
    margin-right: 4px;
    flex-shrink: 0;
  }

  /* Category pill */
  .cat-pill {
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    border: 1px solid #3d2060;
    border-radius: 3px;
    cursor: pointer;
    transition: all 0.15s;
    font-size: 12px;
    background: transparent;
    color: #b08acc;
  }
  .cat-pill:hover { border-color: #7b35cc; color: #e8d5ff; }
  .cat-pill.active {
    border-color: #c77dff;
    background: #c77dff18;
    color: #c77dff;
    box-shadow: 0 0 10px #c77dff30;
  }
  .cat-pill.new-cat {
    border-style: dashed;
    color: #7a5f99;
  }
  .cat-pill.new-cat:hover { color: #ff4da6; border-color: #ff4da6; }

  /* Color dot */
  .color-dot {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    border: 1px solid #3d2060;
    border-radius: 3px;
    cursor: pointer;
    transition: all 0.2s;
    background: transparent;
  }
  .color-dot:hover { border-color: #7b35cc; }
  .color-dot .dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    transition: all 0.2s;
    border: 1px solid rgba(255,255,255,0.1);
  }
  .color-dot.active {
    border-color: var(--dot-color);
  }
  .color-dot.active .dot {
    box-shadow: 0 0 8px var(--dot-color), 0 0 16px var(--dot-color);
    border-color: rgba(255,255,255,0.4);
    transform: scale(1.2);
  }
  .color-dot.dimmed .dot { opacity: 0.35; }

  /* Toast */
  #toast {
    position: fixed;
    top: 16px;
    left: 50%;
    transform: translateX(-50%) translateY(-60px);
    background: #1a1230ee;
    border: 1px solid #c77dff;
    color: #e8d5ff;
    padding: 8px 20px;
    border-radius: 4px;
    font-size: 12px;
    backdrop-filter: blur(10px);
    transition: transform 0.25s ease;
    z-index: 100;
    pointer-events: none;
  }
  #toast.show { transform: translateX(-50%) translateY(0); }

  /* Nav info */
  .nav-info {
    display: flex;
    justify-content: center;
    gap: 24px;
    color: #7a5f99;
    font-size: 11px;
  }
  .nav-info .key { font-size: 9px; }

  /* New category modal */
  #modal-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: #100c1aee;
    z-index: 200;
    align-items: center;
    justify-content: center;
  }
  #modal-overlay.show { display: flex; }
  #modal {
    background: #1a1230;
    border: 1px solid #3d2060;
    padding: 24px;
    border-radius: 6px;
    width: 340px;
  }
  #modal h3 { margin-bottom: 12px; font-size: 14px; color: #c77dff; }
  #modal input {
    width: 100%;
    background: #0d0a14;
    border: 1px solid #3d2060;
    color: #e8d5ff;
    font-family: inherit;
    font-size: 14px;
    padding: 8px 12px;
    border-radius: 3px;
    outline: none;
  }
  #modal input:focus { border-color: #7b35cc; }
  #modal .hint { font-size: 11px; color: #7a5f99; margin-top: 8px; }
  #modal .actions { display: flex; gap: 8px; margin-top: 16px; }
  #modal button {
    flex: 1;
    padding: 6px;
    border: 1px solid #3d2060;
    background: transparent;
    color: #b08acc;
    font-family: inherit;
    font-size: 12px;
    border-radius: 3px;
    cursor: pointer;
  }
  #modal button:hover { border-color: #7b35cc; color: #e8d5ff; }
  #modal button.primary { background: #c77dff20; border-color: #c77dff; color: #c77dff; }
</style>
</head>
<body>

<header>
  <div class="title"><span>📸</span> Photo Tagger</div>
  <div class="filter-badge" id="filterBadge" onclick="cycleFilter()">Filter: All</div>
  <div class="progress" id="progress">–</div>
</header>

<main>
  <div class="nav-arrow left" onclick="navigate(-1)">‹</div>
  <img id="photo" src="" alt="Preview" />
  <div class="nav-arrow right" onclick="navigate(1)">›</div>
  <div id="filename">–</div>
</main>

<footer>
  <div class="control-row" id="categoryRow">
    <div class="label">Category</div>
  </div>
  <div class="control-row" id="colorRow">
    <div class="label">Colors</div>
  </div>
  <div class="nav-info">
    <span><span class="key">←</span><span class="key">K</span> Prev</span>
    <span>Next <span class="key">J</span><span class="key">→</span></span>
    <span><span class="key">F</span> Filter</span>
    <span><span class="key">C</span> Clear colors</span>
  </div>
</footer>

<div id="toast"></div>

<div id="modal-overlay">
  <div id="modal">
    <h3>New Category</h3>
    <input id="newCatInput" placeholder="category-name" maxlength="24" />
    <div class="hint">Lowercase, no spaces or dashes. Press Enter to confirm, Esc to cancel.</div>
    <div class="hint" style="color:#ff4da6;margin-top:4px">Remember to add the new category to lib/gallery.ts and categoryMeta for it to appear on the live site.</div>
    <div class="actions">
      <button onclick="closeModal()">Cancel</button>
      <button class="primary" onclick="confirmNewCategory()">Create</button>
    </div>
  </div>
</div>

<script>
const APPLE_COLORS = [
  { name: "green",  hex: "#75bd21", key: "g" },
  { name: "yellow", hex: "#ffc728", key: "y" },
  { name: "orange", hex: "#ff661c", key: "o" },
  { name: "red",    hex: "#cf0f2b", key: "r" },
  { name: "purple", hex: "#b01cab", key: "p" },
  { name: "blue",   hex: "#00a1de", key: "b" },
  { name: "white",  hex: "#e0e0e0", key: "w" },
];

let allPhotos = [];
let categories = [];
let filtered = [];
let index = 0;
let filterMode = "all"; // all | uncolored | uncategorized

// ── Init ────────────────────────────────────────────

async function init() {
  const resp = await fetch("/api/photos");
  const data = await resp.json();
  allPhotos = data.photos;
  categories = data.categories;
  applyFilter();
  renderCategories();
  renderColors();
  render();
}

function applyFilter() {
  if (filterMode === "all") filtered = allPhotos;
  else if (filterMode === "uncolored") filtered = allPhotos.filter(p => !p.colors || p.colors.length === 0);
  else if (filterMode === "uncategorized") filtered = allPhotos.filter(p => p.category === "other");
  index = Math.min(index, Math.max(0, filtered.length - 1));
}

function cycleFilter() {
  const modes = ["all", "uncolored", "uncategorized"];
  const labels = { all: "Filter: All", uncolored: "Filter: No Colors", uncategorized: "Filter: Uncategorized" };
  const i = (modes.indexOf(filterMode) + 1) % modes.length;
  filterMode = modes[i];
  document.getElementById("filterBadge").textContent = labels[filterMode];
  applyFilter();
  render();
  toast(labels[filterMode]);
}

// ── Render ──────────────────────────────────────────

function render() {
  const photo = filtered[index];
  const img = document.getElementById("photo");
  const fname = document.getElementById("filename");
  const prog = document.getElementById("progress");

  if (!photo) {
    img.src = "";
    fname.textContent = "No photos match this filter";
    prog.textContent = "0 / 0";
    return;
  }

  img.classList.add("loading");
  img.onload = () => img.classList.remove("loading");
  img.src = photo.previewSrc;
  fname.textContent = photo.file;
  prog.textContent = (index + 1) + " / " + filtered.length + " (" + allPhotos.length + " total)";

  // Preload neighbors
  for (const offset of [-1, 1]) {
    const neighbor = filtered[index + offset];
    if (neighbor) { const i = new Image(); i.src = neighbor.previewSrc; }
  }

  // Highlight active category
  document.querySelectorAll(".cat-pill").forEach(el => {
    el.classList.toggle("active", el.dataset.cat === photo.category);
  });

  // Highlight active colors
  const activeColors = photo.colors || [];
  document.querySelectorAll(".color-dot").forEach(el => {
    const isActive = activeColors.includes(el.dataset.color);
    el.classList.toggle("active", isActive);
    el.classList.toggle("dimmed", activeColors.length > 0 && !isActive);
  });
}

function renderCategories() {
  const row = document.getElementById("categoryRow");
  row.innerHTML = '<div class="label">Category</div>';
  categories.forEach((cat, i) => {
    const pill = document.createElement("div");
    pill.className = "cat-pill";
    pill.dataset.cat = cat;
    pill.innerHTML = '<span class="key">' + (i + 1) + '</span>' + cat;
    pill.onclick = () => setCategory(cat);
    row.appendChild(pill);
  });
  // New category button
  const newPill = document.createElement("div");
  newPill.className = "cat-pill new-cat";
  newPill.innerHTML = '<span class="key">N</span>+ New';
  newPill.onclick = openModal;
  row.appendChild(newPill);
}

function renderColors() {
  const row = document.getElementById("colorRow");
  row.innerHTML = '<div class="label">Colors</div>';
  APPLE_COLORS.forEach(c => {
    const dot = document.createElement("div");
    dot.className = "color-dot";
    dot.dataset.color = c.name;
    dot.style.setProperty("--dot-color", c.hex);
    dot.innerHTML = '<span class="key">' + c.key.toUpperCase() + '</span><div class="dot" style="background:' + c.hex + '"></div>';
    dot.onclick = () => toggleColor(c.name);
    row.appendChild(dot);
  });
}

// ── Actions ─────────────────────────────────────────

function navigate(dir) {
  if (filtered.length === 0) return;
  index = (index + dir + filtered.length) % filtered.length;
  render();
}

async function toggleColor(color) {
  const photo = filtered[index];
  if (!photo) return;
  let colors = [...(photo.colors || [])];
  const idx = colors.indexOf(color);
  if (idx >= 0) {
    colors.splice(idx, 1);
  } else {
    if (colors.length >= 2) {
      toast("Max 2 colors — remove one first", "#ff4da6");
      return;
    }
    colors.push(color);
  }
  photo.colors = colors;
  // Also update in allPhotos
  const ap = allPhotos.find(p => p.id === photo.id);
  if (ap) ap.colors = colors;

  await fetch("/api/color", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: photo.id, colors }),
  });
  render();
  toast("Colors: " + (colors.length ? colors.join(", ") : "cleared"));
}

function clearColors() {
  const photo = filtered[index];
  if (!photo) return;
  photo.colors = [];
  const ap = allPhotos.find(p => p.id === photo.id);
  if (ap) ap.colors = [];
  fetch("/api/color", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: photo.id, colors: [] }),
  });
  render();
  toast("Colors cleared");
}

async function setCategory(cat) {
  const photo = filtered[index];
  if (!photo || photo.category === cat) return;

  const resp = await fetch("/api/category", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: photo.id, category: cat }),
  });
  const result = await resp.json();
  if (result.ok) {
    const oldId = photo.id;
    const newId = result.newId;
    // Update local state
    photo.id = newId;
    photo.category = cat;
    photo.hash = newId.substring(newId.indexOf("-") + 1);
    photo.file = newId + photo.ext;
    // Update preview src
    photo.previewSrc = photo.previewSrc.replace(oldId, newId);
    // Also update in allPhotos
    const ap = allPhotos.find(p => p.id === oldId);
    if (ap) Object.assign(ap, { id: newId, category: cat, hash: photo.hash, file: photo.file, previewSrc: photo.previewSrc });

    render();
    toast("Category → " + cat);
  }
}

// ── Modal ───────────────────────────────────────────

function openModal() {
  document.getElementById("modal-overlay").classList.add("show");
  const input = document.getElementById("newCatInput");
  input.value = "";
  input.focus();
}

function closeModal() {
  document.getElementById("modal-overlay").classList.remove("show");
}

function confirmNewCategory() {
  const input = document.getElementById("newCatInput");
  const name = input.value.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
  if (!name) return;
  if (categories.includes(name)) {
    toast("Category already exists", "#ff4da6");
    closeModal();
    return;
  }
  categories.push(name);
  categories.sort();
  renderCategories();
  render();
  closeModal();
  toast("Created category: " + name);
}

// ── Toast ───────────────────────────────────────────

let toastTimer;
function toast(msg, color) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  if (color) el.style.borderColor = color;
  else el.style.borderColor = "#c77dff";
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 1400);
}

// ── Keyboard ────────────────────────────────────────

document.addEventListener("keydown", (e) => {
  // Ignore if modal is open (except Escape and Enter)
  const modalOpen = document.getElementById("modal-overlay").classList.contains("show");
  if (modalOpen) {
    if (e.key === "Escape") closeModal();
    if (e.key === "Enter") confirmNewCategory();
    return;
  }

  // Ignore if an input is focused
  if (e.target.tagName === "INPUT") return;

  const key = e.key.toLowerCase();

  // Navigation
  if (key === "j" || key === "arrowright") { navigate(1); e.preventDefault(); }
  else if (key === "k" || key === "arrowleft") { navigate(-1); e.preventDefault(); }

  // Filter
  else if (key === "f") cycleFilter();

  // Clear colors
  else if (key === "c") clearColors();

  // New category
  else if (key === "n") openModal();

  // Color keys
  else if ("gyorpbw".includes(key)) {
    const color = APPLE_COLORS.find(c => c.key === key);
    if (color) toggleColor(color.name);
  }

  // Category number keys (1-9)
  else if (key >= "1" && key <= "9") {
    const idx = parseInt(key) - 1;
    if (idx < categories.length) setCategory(categories[idx]);
  }
});

// ── Start ───────────────────────────────────────────

init();
</script>
</body>
</html>`;

// ── Server ──────────────────────────────────────────────────

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  // HTML page
  if (url.pathname === "/" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/html" });
    return res.end(HTML);
  }

  // API
  if (url.pathname === "/api/photos" && req.method === "GET") {
    return handleApiPhotos(res);
  }
  if (url.pathname === "/api/color" && req.method === "POST") {
    const body = await readBody(req);
    return handleApiColor(body, res);
  }
  if (url.pathname === "/api/category" && req.method === "POST") {
    const body = await readBody(req);
    return handleApiCategory(body, res);
  }

  // Static images
  if (url.pathname.startsWith("/img/")) {
    const filePath = path.join(ROOT, "public", url.pathname);
    return serveFile(filePath, res);
  }

  res.writeHead(404);
  res.end("Not found");
});

server.listen(PORT, () => {
  console.log(`\n  📸 Photo Tagger running at \x1b[36mhttp://localhost:${PORT}\x1b[0m\n`);
  console.log(`  Photos:  ${ORIGINALS_DIR}`);
  console.log(`  Colors:  ${COLOR_MAP_PATH}\n`);
  console.log(`  Keyboard shortcuts:`);
  console.log(`    j/→  Next    k/←  Prev    f  Filter`);
  console.log(`    1-9  Category    n  New category`);
  console.log(`    g y o r p b w  Toggle color    c  Clear colors\n`);
});
