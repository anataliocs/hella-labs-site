# CLAUDE.md

Guidelines for working on the Hella Labs website (hellalabs.dev). It's a static site built with Astro 7, Tailwind CSS 4, Alpine.js, and MDX content collections.

## Commands

```bash
pnpm dev               # Dev server at http://localhost:4321
pnpm check             # astro check (type-check .astro/.ts, validate content schemas)
pnpm lint              # ESLint (Astro, TypeScript, a11y rules)
pnpm lint:fix          # ESLint with auto-fix
pnpm format            # Prettier write
pnpm format:check      # Prettier check
pnpm test              # Vitest unit tests (src/**/*.test.ts, worker/**/*.test.ts)
pnpm build             # Production static build to dist/
pnpm validate          # check + lint + format:check + test + build
```

## Definition of Done

A task is **not done** until all of the following pass with zero errors:

1. `pnpm check`: no type or content-schema errors
2. `pnpm lint`: no ESLint errors (don't add `eslint-disable` comments to silence a real issue)
3. `pnpm build`: the static build succeeds

Run `pnpm validate` to do all of these in one go (it also checks Prettier formatting). If something fails, fix the cause before saying the work is finished. If a failure was already there before your change and fixing it is out of scope, say so explicitly; don't skip over it.

## Project Structure

- `src/pages/`: file-based routes. Dynamic routes (`[slug].astro`, `page/[page].astro`) must export `getStaticPaths`.
- `src/layouts/MainLayout.astro`: the shared page shell (head/SEO meta, fonts, header, footer, Alpine bootstrap). Every page uses it.
- `src/components/`: reusable UI, grouped by feature (`blog/`, `home/`, `services/`, `projects/`, …). Shared primitives (`Button`, `Container`, `PageShell`, `OptimizedImage`, …) live at the root. `content/` holds the components available to every MDX entry (registered in `content/index.ts`).
- `src/content/` + `src/content.config.ts`: MD/MDX content collections (`blog`, `services`, `projects`, `pages`) with Zod schemas. Blog posts are served at the site root (`/<slug>/`) to keep the original Jekyll URLs.
- `src/data/`: typed static data (`*Data.ts`) that feeds components.
- `src/utils/`: pure helpers (paths, post queries, SEO/JSON-LD, images, sitemap).
- `src/styles/style.css`: Tailwind entry point and `@theme` tokens.
- `public/`: static files copied as-is.

## Astro Best Practices

### Static first, minimal JS

- The site is fully static (SSG). Don't add an SSR adapter or on-demand rendering unless asked.
- Render on the server by default. Only add client-side JS when you need interactivity.
- For interactivity, use **Alpine.js** (`x-data`, `x-model`, …), which is started globally in `MainLayout`. Don't add a UI framework (React/Vue/Svelte) for small widgets.
- Keep component `<script>` tags small. Astro bundles and dedupes them; avoid `is:inline` unless you need it.

### Components

- Type every component's props with an `interface Props` in the frontmatter.
- Pull data from `src/data/` or content collections. Don't hard-code repeated content in markup.
- Before writing new markup, reuse an existing component or extend one.
- Import with the `@src/*` alias (e.g. `@src/components/Button.astro`), not long relative paths.
- Use `import type` for type-only imports (lint enforces this).

### Content collections

- Define all collections and their schemas in `src/content.config.ts`. Any new frontmatter field must be added to the schema.
- Query with `getCollection` / `getEntry` from `astro:content`, not manual file globs.
- `pnpm check` validates frontmatter against the schemas, so run it after content edits.

### Routing and links

- Build internal links with `url()` from `@src/utils/path` so they respect `BASE_URL`.
- For nav active states, use `isActivePath()`.
- Prefer trailing-slash-free, lowercase, hyphenated slugs.

### Images and assets

- For images in `src/`, use `astro:assets` (`<Image />` / `<Picture />`). That gives you optimization, responsive sizes, and modern formats.
- Always give `alt` text. Use `alt=""` only for purely decorative images.
- Set `width`/`height` (or use `astro:assets`) to avoid layout shift. Lazy-load images below the fold.
- Icons: use `astro-icon` with the Font Awesome 6 sets (`fa6-solid:`, `fa6-brands:`), the Hella brand icon set. A new icon name must be added to the matching `include` list in `astro.config.mjs`, or it won't render.
- Fonts are configured through the Astro Fonts API in `astro.config.mjs`. Don't add `<link>`s to Google Fonts.

### Styling

- Use Tailwind utility classes and the theme tokens in `src/styles/style.css`. Avoid arbitrary values when a token exists.
- Colors use semantic tokens (`bg-surface`, `text-heading`, `border-line`, `text-primary`, …) that switch between the light and dark (default) themes on their own; only reach for `dark:` when a component needs a different token in dark mode.
- Prettier sorts Tailwind classes automatically, so don't hand-order them.
- Only write a scoped `<style>` block when utilities can't do the job.

### SEO

- Every page passes a unique `title` and `description` to `MainLayout`.
- Extra head tags (Open Graph, JSON-LD) go through the layout's `head` slot.
- Use one `<h1>` per page and keep heading levels in order.
- Use semantic elements: `<header>`, `<main>`, `<nav>`, `<section>`, `<article>`, `<footer>`.

### Accessibility

The lint step enforces a11y rules (`astro/jsx-a11y/*`). In particular:

- Every form control needs a label. Wrap the input in its `<label>`, or pair `<label for>` with an input `id`. Inside Alpine `x-for` loops, build ids per item with `:id` / `:for`.
- Interactive elements must be real `<button>`s or `<a href>`s, not clickable `<div>`s.
- Icon-only buttons and links need an `aria-label`.
- Keep color contrast at WCAG AA or better.

### TypeScript

- The project uses `astro/tsconfigs/strict`. Don't use `any` and don't add `@ts-ignore`. Fix the types instead.
- Prefix intentionally unused variables or args with `_`.

## Conventions

- Formatting is owned by Prettier (`.prettierrc.json`) and `.editorconfig`: 2-space indent, LF, 100-char lines.
- Keep changes focused. Don't reformat or refactor unrelated files in a feature change.
- Never edit generated output: `dist/` and `.astro/`.
