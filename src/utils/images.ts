import type { ImageMetadata } from "astro";
import { getImage } from "astro:assets";

// Modern formats first; <picture> falls back to the source format (JPEG/PNG) for old browsers
export const PICTURE_FORMATS = ["avif", "webp"] as const;

// 1200×630 JPEG (cropped to fit) for og:image / twitter:image and JSON-LD. Returns an absolute
// URL plus the dimensions for og:image:width/height.
export async function getShareImage(src: ImageMetadata) {
  const result = await getImage({ src, width: 1200, height: 630, fit: "cover", format: "jpg" });
  return {
    url: new URL(result.src, import.meta.env.SITE).href,
    width: Number(result.attributes.width),
    height: Number(result.attributes.height),
  };
}
