import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { techKeys } from "@src/data/techStackData";

// Hex color like "#4643ec"

// Call to action box rendered at the end of service pages
const cta = z.object({
  title: z.string(),
  text: z.string(),
  label: z.string(),
  href: z.string().default("/contact/"),
});

// Blog posts, served at the site root (/<id>/) like the original Jekyll permalinks
const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      // Last significant revision; drives sitemap <lastmod>, dateModified and
      // article:modified_time (defaults to `date`)
      updated: z.coerce.date().optional(),
      image: image(),
      imageAlt: z.string(),
      tags: z.array(z.string()).default([]),
      // Language/technology tiles shown under the byline (keys from src/data/techStackData.ts)
      techStack: z.array(z.enum(techKeys)).default([]),
      // Multi-part series: posts sharing a `name` are linked in order of `part` (SeriesNav)
      series: z.object({ name: z.string(), part: z.number().int().positive() }).optional(),
      // Listed in the sidebar "Featured posts" widget
      featured: z.boolean().default(false),
    }),
});

// Service offerings (/services/<id>/), ordered by `order` on the services index
const services = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/services" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      // Shorter title for the services index card (defaults to `title`)
      cardTitle: z.string().optional(),
      description: z.string(),
      image: image(),
      imageAlt: z.string(),
      icon: z.string(),
      type: z.enum(["Build", "Launch"]),
      order: z.number(),
      cta,
    }),
});

// Open-source projects (/open-source/<id>/). The card fields feed the /open-source/ listing.
const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      image: image(),
      imageAlt: z.string(),
      icon: z.string(),
      order: z.number(),
      tagline: z.string(),
      summary: z.string(),
      // Short wins for the listing card; **bold** is supported
      highlights: z.array(z.string()),
      github: z.url(),
      npm: z.url(),
    }),
});

// Standalone long-form pages (team, open-source overview)
const pages = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/pages" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      image: image(),
      imageAlt: z.string(),
      // Shown above the title in the icon header style
      icon: z.string().optional(),
    }),
});

// Lighthouse audits of the live site (/lighthouse-reports/). Each entry is a Lighthouse JSON
// export saved next to its HTML report of the same name (e.g. lighthouse-mobile.{json,html}).
// Only the summary fields are kept; the full detail lives in the embedded HTML report.
const lighthouseScore = z.number().min(0).max(1).nullable();
const reports = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/assets/reports" }),
  schema: z.object({
    lighthouseVersion: z.string(),
    fetchTime: z.coerce.date(),
    finalDisplayedUrl: z.url(),
    configSettings: z.object({
      formFactor: z.enum(["mobile", "desktop"]),
      throttlingMethod: z.string(),
    }),
    categories: z.record(z.string(), z.object({ title: z.string(), score: lighthouseScore })),
    audits: z.record(
      z.string(),
      z.object({
        title: z.string(),
        score: lighthouseScore,
        displayValue: z.string().optional(),
      }),
    ),
  }),
});

export const collections = { blog, services, projects, pages, reports };
