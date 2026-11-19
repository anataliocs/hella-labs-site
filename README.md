# Hella Labs Website

Source for [hellalabs.dev](https://www.hellalabs.dev): Web3-native fractional engineering, DevRel
and consulting for Fintech, Blockchain and Web3 startups, plus the Topic Zero blog.

Built with [Astro](https://astro.build/) (fully static), Tailwind CSS 4, Alpine.js and MDX content
collections. Ported from the original Jekyll site (`hella-site-base`).

We maintain open-source Ethereum test automation tools:

- [Foundry Anvil Testcontainers for Node.js](https://github.com/hella-web3/foundryanvil-testcontainers-nodejs)
- [WireMock Testcontainers for Node.js](https://github.com/hella-web3/wiremock-testcontainers-nodejs)
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

| Command         | Description                                               |
| --------------- | --------------------------------------------------------- |
| `pnpm dev`      | Dev server                                                |
| `pnpm check`    | Type-check and validate content with `astro check`        |
| `pnpm lint`     | ESLint (Astro, TypeScript, accessibility rules)           |
| `pnpm format`   | Prettier write                                            |
| `pnpm build`    | Static build to `dist/`                                   |
| `pnpm validate` | Run `check`, `lint`, `format:check`, and `build` together |
| `pnpm deploy`   | Build and upload `dist/` to Cloudflare (static assets)    |

Run `pnpm validate` before committing or opening a pull request.

## License

MIT. See [LICENSE](LICENSE).

---

_Made with ❤️ by the Hella Labs team. Speeding up the transition to a Web3 future._
