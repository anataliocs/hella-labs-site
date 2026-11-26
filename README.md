# Hella Labs Website

[![CI](https://github.com/anataliocs/hella-labs-site/actions/workflows/ci.yml/badge.svg)](https://github.com/anataliocs/hella-labs-site/actions/workflows/ci.yml)
[![Lighthouse](https://img.shields.io/badge/Lighthouse-report-F44B21?logo=lighthouse&logoColor=white)](https://anataliocs.github.io/hella-labs-site/)

Source for [hellalabs.dev](https://hellalabs.dev/): Web3-native fractional engineering, DevRel
and consulting for Fintech, Blockchain and Web3 startups, plus the Topic Zero blog.

Built with [Astro](https://astro.build/) (fully static), Tailwind CSS 4, Alpine.js and MDX content
collections. Ported from the original Jekyll site (`hella-site-base`).

We maintain open-source Ethereum test automation tools:

- [Foundry Anvil Testcontainers for Node.js](https://github.com/hella-labs/foundryanvil-testcontainers-nodejs)
- [WireMock Testcontainers for Node.js](https://github.com/hella-labs/wiremock-testcontainers-nodejs)
- [Ethereum Transaction Explorer TUI](https://github.com/anataliocs/etherscan-tui-go)

## Development

```bash
pnpm install
pnpm dev        # http://localhost:4321
```

## Content

| What                 | Where                   | URL                                   |
| -------------------- | ----------------------- | ------------------------------------- |
| Blog posts           | `src/content/blog/`     | `/<slug>/`                            |
| Service offerings    | `src/content/services/` | `/services/<slug>/`                   |
| Open-source projects | `src/content/projects/` | `/open-source/<slug>/`                |
| Team, OSS overview   | `src/content/pages/`    | `/team/`, `/open-source/`             |
| Site settings, nav   | `src/data/`             | header, footer, hero, contact, social |
| Images (optimized)   | `src/assets/images/`    | referenced from frontmatter / imports |
| Static files (as-is) | `public/`               | favicons, animated GIFs               |

Frontmatter is validated by the schemas in `src/content.config.ts`. MDX entries can use the
components in `src/components/content/` (`<Callout>`, `<CodePen>`, `<CtaSection>`, `<FeatureGrid>`,
…) without importing them.

Other routes: `/` (hero + feed), `/page/<n>/`, `/blog/` (archive), `/tags/`, `/tags/<tag>/`,
`/web3-consultant-service-offerings/`, `/contact/` (Formspree form), `/feed.xml`, `/sitemap-index.xml`.

## Scripts

| Command          | Description                                               |
| ---------------- | --------------------------------------------------------- |
| `pnpm dev`       | Dev server                                                |
| `pnpm check`     | Type-check and validate content with `astro check`        |
| `pnpm lint`      | ESLint (Astro, TypeScript, accessibility rules)           |
| `pnpm format`    | Prettier write                                            |
| `pnpm build`     | Static build to `dist/`                                   |
| `pnpm validate`  | Run `check`, `lint`, `format:check`, and `build` together |
| `pnpm deploy`    | Build and upload `dist/` to Cloudflare (static assets)    |
| `pnpm mdx-to-md` | Convert MDX blog posts to portable Markdown (see below)   |

Run `pnpm validate` before committing or opening a pull request.

## Cross-posting: MDX to Markdown

`pnpm mdx-to-md` turns a blog post into a plain `.md` file you can publish on Dev.to, Hashnode,
Medium (import), GitHub and similar platforms.

```bash
pnpm build                                    # optional, but needed for cover_image (see below)
pnpm mdx-to-md pure-css-animations            # by slug…
pnpm mdx-to-md src/content/blog/foo.mdx       # …or by path (several at once is fine)
pnpm mdx-to-md --all                          # every post in src/content/blog/
pnpm mdx-to-md foo --format hashnode          # Hashnode frontmatter (exports/markdown/hashnode/)
pnpm mdx-to-md foo -f devto --draft           # Dev.to frontmatter, as an unpublished draft
pnpm mdx-to-md foo --out ~/Desktop/posts      # output folder (default: exports/markdown/)
pnpm mdx-to-md foo --site https://example.com # origin for canonical and absolute URLs
```

Example

```
pnpm mdx-to-md pure-css-animations --out tmp/ --site https://hellalabs.dev/pure-css-animations/
```

Each post is written to `<out>/<slug>.md`; the default `<out>` is `exports/markdown/` for generic
output and `exports/markdown/<format>/` for `hashnode` or `devto`. `exports/` is git- and Prettier-ignored.

**What the conversion does**

- **Frontmatter** depends on `--format` (site-only fields like `techStack`, `featured` and
  `series` are always dropped):
  - `generic` (default): `title`, `description`, `date`, `tags`, `canonical_url`
    (`https://www.hellalabs.dev/<slug>/`) and `cover_image`, which most platforms accept.
  - `hashnode`: `title`, `slug`, `tags` (comma-separated slugs, max 5), `cover`, `canonical`,
    `seoDescription`, `ogImage`, `publishedAt` (UTC), `enableToc: true`, `disableComments: false`
    and `saveAsDraft` (`true` with `--draft`).
  - `devto`: `title`, `published` (`false` with `--draft`), `description`, `tags` (lowercase
    alphanumeric, max 4), `cover_image` and `canonical_url`.
  - Tags past a platform's limit are dropped in order, with a warning.
- **`cover_image`** is read from the built page's `og:image`, because `src/assets` images get hashed
  URLs at build time. Without a fresh `pnpm build` it's left out, with a warning.
- **MDX components** become Markdown:

  | Component                      | Output                                               |
  | ------------------------------ | ---------------------------------------------------- |
  | `<Callout type="tip">`         | Blockquote starting with **Tip:** (Note, Warning, …) |
  | `<CodePen>`                    | Link to the pen                                      |
  | `<IconDivider>`                | `---` divider                                        |
  | `<FeatureCard>`                | Heading, text and optional CTA link                  |
  | `<CtaSection>`                 | Heading, text and the button as a bold link          |
  | `<CheckList>`, `<FeatureGrid>` | Content kept, wrapper removed                        |
  | Any other component            | Content kept, wrapper removed, **warning printed**   |

- **HTML:** `<p>`, `<strong>`/`<b>`, `<em>`/`<i>`, `<a href>` and `<br>` become Markdown. Other
  elements (`<div>`, `<figure>`, `<svg>`, …) stay as HTML with `className` renamed to `class`.
- **Links and images** starting with `/` (`/contact/`, `/images/x.gif`) become absolute URLs.
- **`import`/`export` lines** and `{expressions}` are removed (`{" "}` becomes a space). Code blocks
  are never touched.

**Check before publishing**

- Read any `⚠` warnings the script prints.
- Live CSS demos (e.g. `<div class="fx-aurora">`) depend on the site's stylesheet and render as
  plain text elsewhere.
- Mermaid diagrams stay as code blocks: GitHub draws them, Dev.to shows the source.
- Dev.to allows at most 4 lowercase, alphanumeric tags; trim `tags` by hand if needed.

To add support for a new MDX component, add a converter to the `components` map in
`src/utils/mdxToMarkdown.ts` and a case to `src/utils/mdxToMarkdown.test.ts`. The converter can
also be called directly:

```ts
import { convertMdxToMarkdown } from "@src/utils/mdxToMarkdown";

const { markdown, warnings } = await convertMdxToMarkdown(mdxSource, {
  slug: "my-post",
  siteUrl: "https://www.hellalabs.dev",
  coverImage: "https://www.hellalabs.dev/_astro/cover.jpg", // optional
});
```

## License

MIT. See [LICENSE](LICENSE).

---

_Made with ❤️ by the [Hella Labs](https://hellalabs.dev/) team. Speeding up the transition to a decentralized future._
