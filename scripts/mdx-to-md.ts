// Converts MDX blog posts to portable Markdown files for cross-posting.
//
//   pnpm mdx-to-md <post> [<post> …] [--format generic|hashnode|devto] [--draft] [--out <dir>]
//                  [--site <url>]
//   pnpm mdx-to-md --all [--format …]
//
// <post> is a path (src/content/blog/foo.mdx) or a bare slug (foo). --format picks the
// frontmatter (default generic); --draft makes Hashnode/Dev.to posts drafts. Output goes to
// exports/markdown/<slug>.md (generic) or exports/markdown/<format>/<slug>.md by default. Run `pnpm build` first to get an absolute cover_image:
// it's read from the built page's og:image, since src/assets images get hashed URLs.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { parseArgs } from "node:util";
import {
  convertMdxToMarkdown,
  type FrontmatterFormat,
  frontmatterFormats,
} from "../src/utils/mdxToMarkdown.ts";

// Same as `site` in astro.config.mjs
const DEFAULT_SITE = "https://www.hellalabs.dev";
const BLOG_DIR = "src/content/blog";
const DIST_DIR = "dist";

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    out: { type: "string" },
    format: { type: "string", short: "f", default: "generic" },
    draft: { type: "boolean", default: false },
    site: { type: "string", default: DEFAULT_SITE },
    all: { type: "boolean", default: false },
    help: { type: "boolean", short: "h", default: false },
  },
});

if (values.help || (!values.all && positionals.length === 0)) {
  process.stdout.write(
    "Usage: pnpm mdx-to-md <post.mdx|slug> […] [--format generic|hashnode|devto] [--draft]\n" +
      "                      [--out <dir>] [--site <url>]\n" +
      "       pnpm mdx-to-md --all [--format …]\n",
  );
  process.exit(values.help ? 0 : 1);
}

if (!isFormat(values.format)) {
  console.error(`Unknown --format ${values.format}; use one of ${frontmatterFormats.join(", ")}`);
  process.exit(1);
}
const format = values.format;
const outDir =
  values.out ?? (format === "generic" ? "exports/markdown" : join("exports/markdown", format));
if (values.draft && format === "generic") console.warn("⚠ --draft has no effect on generic output");

const posts = values.all
  ? readdirSync(BLOG_DIR)
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => join(BLOG_DIR, f))
  : positionals.map((p) => (p.endsWith(".mdx") ? p : join(BLOG_DIR, `${p}.mdx`)));

mkdirSync(outDir, { recursive: true });
let failed = false;

for (const post of posts) {
  if (!existsSync(post)) {
    console.error(`✖ ${post}: file not found`);
    failed = true;
    continue;
  }
  const slug = basename(post).replace(/\.mdx$/, "");
  const coverImage = builtOgImage(slug);
  const { markdown, warnings } = await convertMdxToMarkdown(readFileSync(post, "utf8"), {
    slug,
    siteUrl: values.site,
    coverImage,
    format,
    draft: values.draft,
  });

  const outFile = resolve(outDir, `${slug}.md`);
  writeFileSync(outFile, markdown);
  process.stdout.write(`✔ ${post} → ${outFile}\n`);
  if (!coverImage) warnings.unshift("No cover image: run `pnpm build` first to resolve it");
  for (const warning of warnings) console.warn(`  ⚠ ${warning}`);
}

process.exit(failed ? 1 : 0);

// The cover image's absolute URL, from the built page's og:image (undefined if not built)
function builtOgImage(slug: string): string | undefined {
  const page = join(DIST_DIR, slug, "index.html");
  if (!existsSync(page)) return undefined;
  const html = readFileSync(page, "utf8");
  return /<meta property="og:image" content="([^"]+)"/.exec(html)?.[1];
}

function isFormat(value: string): value is FrontmatterFormat {
  return (frontmatterFormats as readonly string[]).includes(value);
}
