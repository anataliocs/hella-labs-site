// Build-time helper for @astrojs/sitemap (imported by astro.config.mjs; runs in Node).
// Blog posts (served at /<slug>/) get their frontmatter `date` as lastmod; the homepage feed,
// blog archive and tag pages get the newest post date. Other pages have no lastmod.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const blogDir = "src/content/blog";
const feedRoutes = ["", "blog", "tags", "page"];

function postDates(): Map<string, Date> {
  const dates = new Map<string, Date>();
  if (!existsSync(blogDir)) return dates;
  for (const file of readdirSync(blogDir)) {
    if (!/\.mdx?$/.test(file)) continue;
    const match = /^date:\s*["']?([^"'\n]+)["']?\s*$/m.exec(
      readFileSync(join(blogDir, file), "utf8"),
    );
    const date = match ? new Date(match[1]) : undefined;
    if (date && !Number.isNaN(date.getTime())) dates.set(file.replace(/\.mdx?$/, ""), date);
  }
  return dates;
}

export function createLastmodResolver(base = "/"): (url: string) => Date | undefined {
  const dates = postDates();
  const newest = [...dates.values()].sort((a, b) => b.getTime() - a.getTime())[0];
  const prefix = base.replace(/\/$/, "");

  return (url) => {
    const segments = new URL(url).pathname.slice(prefix.length).split("/").filter(Boolean);
    const [first = ""] = segments;
    if (segments.length === 1 && dates.has(first)) return dates.get(first);
    if (feedRoutes.includes(first)) return newest;
    return undefined;
  };
}
