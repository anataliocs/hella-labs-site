// Converts MDX blog posts to portable Markdown files for cross-posting.
//
//   pnpm mdx-to-md <post> [<post> …] [--out <dir>] [--site <url>]
//   pnpm mdx-to-md --all
//
// <post> is a path (src/content/blog/foo.mdx) or a bare slug (foo). Output goes to
// exports/markdown/<slug>.md by default. Run `pnpm build` first to get an absolute cover_image:
// it's read from the built page's og:image, since src/assets images get hashed URLs.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { parseArgs } from "node:util";
import { convertMdxToMarkdown } from "../src/utils/mdxToMarkdown.ts";

// Same as `site` in astro.config.mjs
const DEFAULT_SITE = "https://www.hellalabs.dev";
const BLOG_DIR = "src/content/blog";
const DIST_DIR = "dist";

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    out: { type: "string", default: "exports/markdown" },
    site: { type: "string", default: DEFAULT_SITE },
    all: { type: "boolean", default: false },
    help: { type: "boolean", short: "h", default: false },
  },
});

if (values.help || (!values.all && positionals.length === 0)) {
  process.stdout.write(
    "Usage: pnpm mdx-to-md <post.mdx|slug> […] [--out exports/markdown] [--site <url>]\n" +
      "       pnpm mdx-to-md --all\n",
  );
  process.exit(values.help ? 0 : 1);
}

const posts = values.all
  ? readdirSync(BLOG_DIR)
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => join(BLOG_DIR, f))
  : positionals.map((p) => (p.endsWith(".mdx") ? p : join(BLOG_DIR, `${p}.mdx`)));

mkdirSync(values.out, { recursive: true });
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
  });

  const outFile = resolve(values.out, `${slug}.md`);
  writeFileSync(outFile, markdown);
  process.stdout.write(`✔ ${post} → ${outFile}\n`);
  if (!coverImage) warnings.unshift("No cover_image: run `pnpm build` first to resolve it");
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
