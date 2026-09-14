import fs from "fs";
import path from "path";
import sizeOf from "image-size";
import { Photo, PhotoCategory, categories } from "./gallery";

export async function getGalleryPhotos(): Promise<Photo[]> {
  const imgDir = path.join(process.cwd(), "public", "img", "gallery");
  
  if (!fs.existsSync(imgDir)) {
    return [];
  }

  const files = fs.readdirSync(imgDir);
  const imageExts = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
  
  const validCategories = new Set(categories);
  const photos: Photo[] = [];

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!imageExts.has(ext)) continue;

    const basename = path.parse(file).name; // e.g. "street-a3f9b2"
    
    // Extract category from filename if it matches format [category]-[hash]
    let category: PhotoCategory = "other";
    const parts = basename.split("-");
    if (parts.length > 1 && validCategories.has(parts[0] as PhotoCategory)) {
      category = parts[0] as PhotoCategory;
    }

    const filePath = path.join(imgDir, file);
    try {
      // Read buffer to avoid image-size filepath bug
      const buffer = fs.readFileSync(filePath);
      const dims = sizeOf(buffer);
      
      const width = dims.width || 800;
      const height = dims.height || 600;
      const orientation = width > height ? "landscape" : (width < height ? "portrait" : "square");

      photos.push({
        id: basename,
        src: `/img/gallery/${file}`,
        alt: `Gallery Image ${basename}`,
        category,
        orientation,
        width,
        height,
      });
    } catch {
      console.warn(`Failed to read dimensions for ${file}`);
    }
  }

  return photos;
}
