// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import mdx from "@astrojs/mdx";
import mermaid from "astro-mermaid";
import { readFileSync } from "node:fs";
import { satteri } from "@astrojs/markdown-satteri";
import icon from "astro-icon";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import llmsIntegration from "astro-llms-md";
import { createLastmodResolver } from "./src/utils/sitemap";
import devContactApi from "./src/integrations/devContactApi";

const lastmodFor = createLastmodResolver();

// https://astro.build/config
export default defineConfig({
  site: "https://www.hellalabs.dev",

  // Every page URL ends in "/" (pages build to <route>/index.html). url() in src/utils/path.ts
  // adds the slash to internal links, so canonicals, sitemap and links all agree.
  trailingSlash: "always",
  build: { format: "directory" },

  // Global image defaults so <Image>/<Picture> (including MDX images) share responsive breakpoints
  image: {
    breakpoints: [640, 828, 1080, 1280, 1600, 1920],
  },

  markdown: {
    // rawHtml lets MDX compile the <pre class="mermaid"> HTML node astro-mermaid emits (without it
    // the MDX build fails with "Cannot compile a `raw` node"). astro-mermaid extends this processor.
    processor: satteri({ features: { rawHtml: true } }),
    // Dual themes: light colors inline, dark colors as --shiki-dark vars (switched in style.css)
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark" },
      wrap: true,
    },
  },

  integrations: [
    // `astro dev` only: serves /api/contact with the worker code and a no-op email sender
    devContactApi(),
    // Font Awesome 6 (the Hella brand icon set). Every icon name used in the site must be listed
    // here, or it won't render.
    icon({
      include: {
        "fa6-solid": [
          "arrow-left",
          "arrow-right",
          "arrow-up",
          "box-open",
          "book",
          "book-open",
          "calendar-check",
          "briefcase",
          "chart-line",
          "check",
          "chevron-down",
          "circle-check",
          "circle-exclamation",
          "clock",
          "code",
          "code-branch",
          "comment-dots",
          "credit-card",
          "cubes",
          "diagram-project",
          "dollar-sign",
          "envelope",
          "file-lines",
          "file-contract",
          "desktop",
          "flask",
          "gauge-high",
          "globe",
          "graduation-cap",
          "grip",
          "hammer",
          "hand-holding-dollar",
          "handshake",
          "heart",
          "id-badge",
          "laptop-code",
          "lightbulb",
          "list",
          "list-check",
          "location-dot",
          "lock",
          "marker",
          "maximize",
          "microchip",
          "mobile-screen",
          "moon",
          "network-wired",
          "pen-nib",
          "pen-to-square",
          "people-group",
          "plug",
          "right-left",
          "rocket",
          "rotate",
          "rss",
          "shield-halved",
          "sun",
          "triangle-exclamation",
          "users",
          "users-gear",
          "wand-magic-sparkles",
          "wrench",
          "xmark",
          "bars",
        ],
        "fa6-brands": [
          "aws",
          "chrome",
          "css3",
          "css3-alt",
          "dev",
          "discord",
          "docker",
          "ethereum",
          "github",
          "golang",
          "hashnode",
          "html5",
          "java",
          "js",
          "linkedin",
          "linkedin-in",
          "linux",
          "medium",
          "node",
          "node-js",
          "npm",
          "python",
          "react",
          "rust",
          "sass",
          "space-awesome",
          "stack-overflow",
          "telegram",
          "x-twitter",
          "youtube",
        ],
        // Tech logos Font Awesome doesn't have (tech stack tiles, see src/data/techStackData.ts)
        "simple-icons": [
          "astro",
          "ethers",
          "graphql",
          "jest",
          "nestjs",
          "reactivex",
          "solidity",
          "substack",
          "tailwindcss",
          "typescript",
          "vitest",
        ],
      },
    }),
    // Renders ```mermaid code blocks client-side; must come before mdx(). The diagram theme follows
    // data-theme on <html> (kept in sync with the .dark class by MainLayout and ThemeToggle).
    // mermaid-theme.css layers the brand colors (site tokens) over it; the diagram container
    // itself is styled in style.css.
    mermaid({
      theme: "dark",
      autoTheme: true,
      mermaidConfig: {
        fontFamily: "var(--font-poppins), 'Helvetica Neue', Helvetica, Arial, sans-serif",
        themeCSS: readFileSync(new URL("./src/styles/mermaid-theme.css", import.meta.url), "utf8"),
      },
    }),
    mdx(),
    // Writes sitemap-index.xml + sitemap-0.xml at build. The 404 page is excluded.
    sitemap({
      filter: (page) => {
        const { pathname } = new URL(page);
        return (
          !pathname.startsWith("/404") &&
          pathname !== "/contact/thanks/" &&
          // Redirect to the newest post, not a page of its own
          pathname !== "/blog/latest/"
        );
      },
      serialize: (item) => ({ ...item, lastmod: lastmodFor(item.url)?.toISOString() }),
    }),
    llmsIntegration({
      name: "Hella Labs",
      description:
        "Hella Labs provides Web3-native fractional engineering, DevRel and consulting for Fintech, Blockchain and Web3 startups, and maintains open-source Ethereum test automation tools such as Foundry Anvil Testcontainers and WireMock Testcontainers for Node.js.",
      exclude: ["/404", "/contact/thanks", "/blog/latest"],
      titleSelector: "title",
      contentSelector: "main",
      excludeSelectors: ["form"],
      generateLlmsTxt: true,
      generateLlmsFullTxt: true,
      generateIndividualMd: true,
    }),
  ],

  fonts: [
    {
      provider: fontProviders.google(),
      name: "Poppins",
      cssVariable: "--font-poppins",
      weights: ["400", "500", "600", "700"],
      styles: ["normal"],
    },
    {
      provider: fontProviders.google(),
      name: "Roboto Mono",
      cssVariable: "--font-roboto-mono",
      weights: ["400", "500", "700"],
      styles: ["normal", "italic"],
    },
    {
      provider: fontProviders.google(),
      name: "JetBrains Mono",
      cssVariable: "--font-jetbrains-mono",
      weights: ["600"],
      styles: ["normal"],
    },
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
