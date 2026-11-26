import { describe, expect, it } from "vitest";
import { convertMdxToMarkdown } from "@src/utils/mdxToMarkdown";

const site = "https://www.hellalabs.dev";

async function body(mdx: string) {
  const { markdown, warnings } = await convertMdxToMarkdown(mdx, { slug: "post", siteUrl: site });
  return { md: markdown.replace(/^---\n[\s\S]*?\n---\n\n/, ""), warnings };
}

describe("convertMdxToMarkdown", () => {
  it("reduces frontmatter to portable fields", async () => {
    const { markdown } = await convertMdxToMarkdown(
      [
        "---",
        'title: "Hello"',
        'description: "A long description that should stay on one single line in the YAML output, no matter how long it is"',
        "date: 2025-08-05T09:29:35+03:00",
        "image: ../../assets/images/blog/x.jpg",
        "imageAlt: Alt",
        'tags: ["CSS", "Web3"]',
        "featured: true",
        "---",
        "",
        "Hi",
      ].join("\n"),
      { slug: "hello", siteUrl: `${site}/`, coverImage: `${site}/_astro/x.jpg` },
    );
    expect(markdown).toBe(
      [
        "---",
        "title: Hello",
        "description: A long description that should stay on one single line in the YAML output, no matter how long it is",
        "date: 2025-08-05T09:29:35+03:00",
        "tags:",
        "  - CSS",
        "  - Web3",
        `canonical_url: ${site}/hello/`,
        `cover_image: ${site}/_astro/x.jpg`,
        "---",
        "",
        "Hi",
        "",
      ].join("\n"),
    );
  });

  const post = [
    "---",
    'title: "Hello"',
    'description: "Short summary"',
    "date: 2025-08-05T09:29:35+03:00",
    "image: ../../assets/images/blog/x.jpg",
    'tags: ["CSS", "Web3", "Smart Contracts", "Server-Sent Events", "RxJS", "css"]',
    "---",
    "",
    "Hi",
  ].join("\n");
  const cover = `${site}/_astro/x.jpg`;

  it("writes Hashnode frontmatter with comma-separated tag slugs (max 5)", async () => {
    const { markdown, warnings } = await convertMdxToMarkdown(post, {
      slug: "hello",
      siteUrl: site,
      coverImage: cover,
      format: "hashnode",
    });
    expect(markdown).toBe(
      [
        "---",
        "title: Hello",
        "slug: hello",
        "tags: css, web3, smart-contracts, server-sent-events, rxjs",
        `cover: ${cover}`,
        `canonical: ${site}/hello/`,
        "seoDescription: Short summary",
        `ogImage: ${cover}`,
        "publishedAt: 2025-08-05T06:29:35Z",
        "enableToc: true",
        "disableComments: false",
        "saveAsDraft: false",
        "---",
        "",
        "Hi",
        "",
      ].join("\n"),
    );
    expect(warnings).toEqual([]);
  });

  it("writes Dev.to frontmatter with alphanumeric tags (max 4) and draft support", async () => {
    const { markdown, warnings } = await convertMdxToMarkdown(post, {
      slug: "hello",
      siteUrl: site,
      coverImage: cover,
      format: "devto",
      draft: true,
    });
    expect(markdown).toBe(
      [
        "---",
        "title: Hello",
        "published: false",
        "description: Short summary",
        "tags:",
        "  - css",
        "  - web3",
        "  - smartcontracts",
        "  - serversentevents",
        `cover_image: ${cover}`,
        `canonical_url: ${site}/hello/`,
        "---",
        "",
        "Hi",
        "",
      ].join("\n"),
    );
    expect(warnings).toEqual(["Dev.to allows 4 tags; dropped rxjs"]);
  });

  it("drops imports and turns Callouts into labeled blockquotes", async () => {
    const { md } = await body(
      'import X from "./x";\n\n<Callout type="tip">\n\nKeep it **simple**.\n\n</Callout>\n',
    );
    expect(md).toBe("> **Tip:** Keep it **simple**.\n");
  });

  it("converts CodePen, IconDivider and CtaSection", async () => {
    const { md } = await body(
      [
        '<CodePen slug="abc" title="Demo" />',
        "",
        '<IconDivider icon="fa6-solid:code" />',
        "",
        '<CtaSection title="Talk to us" button={{ label: "Contact", href: "/contact/" }}>',
        "  <p>",
        '    We ship{" "}',
        "    <strong>fast</strong> sites.",
        "  </p>",
        "</CtaSection>",
      ].join("\n"),
    );
    expect(md).toBe(
      [
        "▶️ [Demo on CodePen](https://codepen.io/anataliocs/pen/abc)",
        "",
        "---",
        "",
        "### Talk to us",
        "",
        "We ship **fast** sites.",
        "",
        `**[Contact →](${site}/contact/)**`,
        "",
      ].join("\n"),
    );
  });

  it("makes root-relative links and images absolute", async () => {
    const { md } = await body(
      '[Team](/team/) ![Alt](/images/a.gif)\n\n<img src="/images/b.png" alt="" />\n',
    );
    expect(md).toContain(`[Team](${site}/team/)`);
    expect(md).toContain(`![Alt](${site}/images/a.gif)`);
    expect(md).toContain(`<img src="${site}/images/b.png" alt="" />`);
  });

  it("keeps other HTML and unwraps unknown components with a warning", async () => {
    const { md, warnings } = await body(
      '<div className="fx">Hi</div>\n\n<Mystery>\n\nInner text\n\n</Mystery>\n',
    );
    expect(md).toBe('<div class="fx">Hi</div>\n\nInner text\n');
    expect(warnings).toEqual(["Unknown component <Mystery> was unwrapped to its children"]);
  });

  it("leaves code blocks untouched", async () => {
    const code = "```tsx\nimport { X } from 'y';\n<Callout>{value}</Callout>\n```\n";
    expect((await body(code)).md).toBe(code);
  });
});
