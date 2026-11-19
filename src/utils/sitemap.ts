// Build-time helper for @astrojs/sitemap (imported by astro.config.mjs; runs in Node).
// Resolves an accurate <lastmod> for every URL, since search engines only trust lastmod when it
// is consistently correct (changefreq/priority are ignored by Google, so they're not emitted):
// - Blog posts (/<slug>/): frontmatter `updated`, falling back to `date`
// - Tag pages (/tags/<tag>/): newest post carrying that tag
// - Feeds (/, /blog/, /page/N/, /tags/): newest post overall
// - Everything else: last git commit touching the page's source files (omitted if git is
//   unavailable, e.g. a build from a tarball)
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { tagSlug } from "./text";

const blogDir = "src/content/blog";
const feedRoutes = ["", "blog", "page"];

// Content collection folders that back dynamic routes: /<route>/<id>/ → src/content/<dir>/<id>.*
const contentRoutes: Record<string, string> = {
  services: "src/content/services",
  "open-source": "src/content/projects",
};

interface PostMeta {
  modified: Date;
  tags: string[];
}

function parseDate(frontmatter: string, field: string): Date | undefined {
  const match = new RegExp(`^${field}:\\s*["']?([^"'\\n]+)["']?\\s*$`, "m").exec(frontmatter);
  const date = match ? new Date(match[1]) : undefined;
  return date && !Number.isNaN(date.getTime()) ? date : undefined;
}

// Supports both `tags: ["A", "B"]` and a YAML block list
function parseTags(frontmatter: string): string[] {
  const inline = /^tags:\s*\[(.*)\]\s*$/m.exec(frontmatter);
  const block = /^tags:\s*\n((?:\s+-\s.*\n?)+)/m.exec(frontmatter);
  const raw = inline ? inline[1].split(",") : (block?.[1].split("\n") ?? []);
  return raw
    .map((tag) =>
      tag
        .replace(/^\s*-\s*/, "")
        .trim()
        .replace(/^["']|["']$/g, ""),
    )
    .filter(Boolean);
}

function readPosts(): Map<string, PostMeta> {
  const posts = new Map<string, PostMeta>();
  if (!existsSync(blogDir)) return posts;
  for (const file of readdirSync(blogDir)) {
    if (!/\.mdx?$/.test(file)) continue;
    const frontmatter = /^---\n([\s\S]*?)\n---/.exec(
      readFileSync(join(blogDir, file), "utf8"),
    )?.[1];
    if (!frontmatter) continue;
    const modified = parseDate(frontmatter, "updated") ?? parseDate(frontmatter, "date");
    if (modified)
      posts.set(file.replace(/\.mdx?$/, ""), { modified, tags: parseTags(frontmatter) });
  }
  return posts;
}

function newest(dates: Date[]): Date | undefined {
  return dates.reduce<Date | undefined>((max, d) => (!max || d > max ? d : max), undefined);
}

// Last commit date across the given paths, or undefined outside a git checkout
function gitLastModified(paths: string[]): Date | undefined {
  const existing = paths.filter((p) => existsSync(p));
  if (existing.length === 0) return undefined;
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cI", "--", ...existing], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return out ? new Date(out) : undefined;
  } catch {
    return undefined;
  }
}

// Source files that make up a static route: the .astro page plus any backing content entry
function sourceFiles(segments: string[]): string[] {
  const route = segments.join("/");
  const files = [`src/pages/${route}.astro`, `src/pages/${route}/index.astro`];
  const [first, second] = segments;
  if (segments.length === 1) {
    files.push(`src/content/pages/${first}.md`, `src/content/pages/${first}.mdx`);
  }
  const contentDir = contentRoutes[first];
  if (contentDir && second) {
    files.push(`src/pages/${first}/[slug].astro`);
    files.push(`${contentDir}/${second}.md`, `${contentDir}/${second}.mdx`);
  }
  return files;
}

export function createLastmodResolver(base = "/"): (url: string) => Date | undefined {
  const posts = readPosts();
  const all = [...posts.values()];
  const newestPost = newest(all.map((p) => p.modified));
  const prefix = base.replace(/\/$/, "");

  return (url) => {
    const segments = new URL(url).pathname.slice(prefix.length).split("/").filter(Boolean);
    const [first = "", second] = segments;

    if (segments.length === 1 && posts.has(first)) return posts.get(first)?.modified;
    if (first === "tags") {
      if (!second) return newestPost;
      return newest(
        all.filter((p) => p.tags.some((t) => tagSlug(t) === second)).map((p) => p.modified),
      );
    }
    if (feedRoutes.includes(first)) return newestPost;
    return gitLastModified(sourceFiles(segments));
  };
}
