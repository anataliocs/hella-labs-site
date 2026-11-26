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
  { name: "Neon Magenta", hex: "#ff47a0", usage: "Primary accent and links, dark theme" },
  { name: "Deep Magenta", hex: "#d60067", usage: "Gradient start behind white text, dark theme" },
  { name: "Deep Violet", hex: "#8311c0", usage: "Gradient end, dark theme" },
  { name: "Logo Cyan", hex: "#2ad6e6", usage: "Secondary accent, from the logo's top-right" },
  { name: "Deep Cyan", hex: "#10808a", usage: "Secondary accent behind white text (buttons)" },
  { name: "Vibrant Orange", hex: "#f3722c", usage: "Tertiary accent, from the logo's lower left" },
  { name: "Midnight Navy", hex: "#0f172a", usage: "Dark background" },
  { name: "Ink", hex: "#10141f", usage: "Headings and body text, light theme" },
];

// "Why this palette" notes under the swatches. Strings support **bold** via renderInline.
export const brandPaletteNotes = {
  title: "Cyberpunk meets institutional",
  intro:
    "Fintech and blockchain brands tend to default to **corporate white and blue**: safe, trusted and forgettable. We start from a midnight navy canvas lit by neon pink, purple, cyan and orange to signal a **forward-moving, bleeding-edge** team, while the restraint around it keeps the look credible to banks, custodians and enterprise partners.",
  principles: [
    {
      title: "Dark by default, light when it counts",
      text: "The site ships in dark mode, with **Midnight Navy** as the base. A full light theme swaps in **Ink** on white for print, decks and readers who prefer it, so every color has a counterpart that works on both.",
    },
    {
      title: "Neon is an accent, not a background",
      text: "The gradient, **Logo Cyan** and **Vibrant Orange** carry the energy in headlines, icons, borders and key terms. Long-form copy stays in calm neutrals (**15.7:1** for headings and **6.7:1** for body text on navy) so the page reads like an institution, not an arcade.",
    },
    {
      title: "Color wheel relationships",
      text: "Each accent has a place on the wheel. **Complements**: Vibrant Orange and Logo Cyan sit almost directly opposite each other, so pairing them gives the strongest contrast. **Analogous harmony**: Hella Pink, Neon Magenta, Hella Purple and Deep Violet are neighbors, so the gradient blends smoothly from one to the next. **Split-complementary contrast**: Hella Pink and Vibrant Orange sit on either side of Logo Cyan's opposite, so the three together give us **variety and energy without clashing**.",
    },
    {
      title: "The psychology of color",
      text: "Every hue has a job. **Midnight Navy** suggests depth, stability and trust, the qualities finance expects. **Pink and magenta** feel bold and unconventional, and **purple** has long signaled imagination and premium craft. **Cyan** reads as clarity and technology, and **orange** brings warmth, enthusiasm and approachability. The navy base keeps us credible, and the neon accents show we build at the edge.",
    },
    {
      title: "Accessible pairs for every accent",
      text: "Bright brand values often fail under white text, so each accent has a deeper partner tuned for **WCAG AA**: **Deep Cyan** for secondary buttons (4.7:1) and a darker orange for key terms on light backgrounds (4.6:1 or better). Dark-mode emphasis uses the true logo orange at **5.4:1** or better.",
    },
    {
      title: "A compromise we keep working on",
      text: "Not every pairing reaches **AAA** yet. We recently lifted **Neon Magenta** from #d60067 to #ff47a0 so dark-mode accents clear AA on navy (**5.7:1**). A few hover and icon states on our lighter slate cards still sit at 3.6:1, which meets the 3:1 bar for UI components but not for body text, and we keep auditing combinations like that one. We aim for **AA everywhere and AAA where we can**, and we tune the palette whenever the aesthetic and accessibility pull apart.",
    },
  ],
};

export const brandFonts = [
  { name: "Poppins", role: "Headings, navigation and buttons", class: "font-heading" },
  { name: "Roboto Mono", role: "Body copy and code", class: "font-mono" },
];
