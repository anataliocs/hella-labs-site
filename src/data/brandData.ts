// Brand kit (/brand-kit/): downloadable logos and social covers, plus palette and typefaces
import type { ImageMetadata } from "astro";
import longBanner from "@src/assets/images/brand/banner-long-2148x416.jpg";
import wordmarkBanner from "@src/assets/images/brand/banner-wordmark.jpg";
import logoIcon from "@src/assets/images/brand/hella-logo-1.jpg";
import logoDark from "@src/assets/images/brand/hella-logo-3.jpg";
import logoLight from "@src/assets/images/brand/hella-logo-4.jpg";
import linkedinCover from "@src/assets/images/brand/linkedin-cover.jpg";
import socialPostTemplate from "@src/assets/images/brand/social-post-template.jpg";
import twitterCover from "@src/assets/images/brand/twitter-cover.jpg";

export interface BrandAsset {
  title: string;
  usage: string;
  image: ImageMetadata;
  alt: string;
  // Download file name
  fileName: string;
}

export const brandLogos: BrandAsset[] = [
  {
    title: "Primary logo (dark)",
    usage: "Default mark for dark backgrounds, avatars and app icons.",
    image: logoDark,
    alt: "Hella Labs logo: a rock-on hand built from isometric cubes, in a pink-to-cyan neon gradient on navy",
    fileName: "hella-labs-logo-dark.jpg",
  },
  {
    title: "Primary logo (light)",
    usage: "Use on white or light backgrounds and in print.",
    image: logoLight,
    alt: "Hella Labs logo: a rock-on hand built from isometric cubes, in a pink-to-cyan gradient on white",
    fileName: "hella-labs-logo-light.jpg",
  },
  {
    title: "Geometric mark",
    usage: "Alternate decorative mark for stickers, swag and event graphics.",
    image: logoIcon,
    alt: "Alternate Hella Labs mark: a cluster of geometric polyhedra in a neon gradient on navy",
    fileName: "hella-labs-mark.jpg",
  },
];

export const brandCovers: BrandAsset[] = [
  {
    title: "LinkedIn cover",
    usage: "2544 × 416 banner for LinkedIn company and personal pages.",
    image: linkedinCover,
    alt: "Hella Labs LinkedIn banner: Design, Build, Launch, Scale; specialized fintech and blockchain fractional engineering, DevRel and consulting",
    fileName: "hella-labs-linkedin-cover.jpg",
  },
  {
    title: "X (Twitter) cover",
    usage: "1400 × 463 header image for X profiles.",
    image: twitterCover,
    alt: "Hella Labs X header: Design, Build, Launch, Scale; specialized fintech and blockchain fractional engineering, DevRel and consulting",
    fileName: "hella-labs-x-cover.jpg",
  },
  {
    title: "Wordmark banner",
    usage: "1248 × 832 (3:2) lockup for blog headers, event slides and partner pages.",
    image: wordmarkBanner,
    alt: "Hella Labs wordmark in white beside the rock-on hand logo in a neon gradient, on navy",
    fileName: "hella-labs-wordmark-banner.jpg",
  },
  {
    title: "Long banner",
    usage: "2184 × 416 wide banner for event pages, newsletters and website headers.",
    image: longBanner,
    alt: "Hella Labs wide banner with hellalabs.dev: Design, Build, Launch, Scale; specialized fintech and blockchain fractional engineering, DevRel and consulting",
    fileName: "hella-labs-long-banner.jpg",
  },
  {
    title: "Social post template",
    usage:
      "1376 × 768 template for blog and social post graphics; swap in your title and subtitle.",
    image: socialPostTemplate,
    alt: "Hella Labs social post template: placeholder post title and subtitle beside the rock-on hand logo in a neon gradient, on navy",
    fileName: "hella-labs-social-post-template.jpg",
  },
];

export const brandColors = [
  { name: "Hella Purple", hex: "#ae00ee", usage: "Primary accent, light theme" },
  { name: "Hella Pink", hex: "#f70077", usage: "Gradient start" },
  { name: "Neon Magenta", hex: "#d60067", usage: "Primary accent, dark theme" },
  { name: "Deep Violet", hex: "#8311c0", usage: "Gradient end, dark theme" },
  { name: "Midnight Navy", hex: "#0f172a", usage: "Dark background" },
  { name: "Ink", hex: "#10141f", usage: "Headings and body text, light theme" },
];

export const brandFonts = [
  { name: "Poppins", role: "Headings, navigation and buttons", class: "font-heading" },
  { name: "Roboto Mono", role: "Body copy and code", class: "font-mono" },
];
