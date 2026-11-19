# Junie's Best Practices for Astro Websites

Welcome to the guidelines for maintaining and developing this Astro project.

## 1. Content Management

- **Use Content Collections:** Always define collections in `src/content/config.ts` to ensure type safety for your MD/MDX files.
- **Frontmatter Validation:** Ensure all required frontmatter fields (title, date, etc.) are present and correctly typed.

## 2. Performance

- **Optimized Images:** Use `astro:assets` for all images to benefit from automatic resizing, optimization, and format conversion.
- **Minimize Client-Side JS:** Prefer static HTML whenever possible. Use `client:*` directives for interactive components only when necessary.

## 3. Styling

- **Tailwind CSS:** Keep styles consistent by using Tailwind utility classes defined in the project configuration.
- **Component Isolation:** Keep component styles scoped to the component (default behavior in `.astro` files).

## 4. Development

- **TypeScript:** Enforce strict type checking in `tsconfig.json`.
- **Reusable Components:** Abstract repetitive UI patterns into components in `src/components/`.

## 5. SEO & Accessibility

- **Semantic HTML:** Use proper tags (`<header>`, `<main>`, `<section>`, `<article>`).
- **Meta Tags:** Ensure each page has appropriate meta tags (title, description, open graph images).
- **Alt Text:** Always provide meaningful `alt` text for images.
