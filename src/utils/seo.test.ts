import { describe, expect, it } from "vitest";
import { siteData } from "@src/data/siteData";
import {
  absoluteUrl,
  blogPostingJsonLd,
  breadcrumbJsonLd,
  clip,
  webPageJsonLd,
  withBrand,
} from "@src/utils/seo";

const site = import.meta.env.SITE.replace(/\/$/, "");

describe("absoluteUrl", () => {
  it("prefixes the site and adds a trailing slash to pages", () => {
    expect(absoluteUrl("/team")).toBe(`${site}/team/`);
    expect(absoluteUrl("/feed.xml")).toBe(`${site}/feed.xml`);
  });
});

describe("clip", () => {
  it("collapses whitespace and leaves short text alone", () => {
    expect(clip("  hello \n  world  ")).toBe("hello world");
  });

  it("cuts at the last full word and adds an ellipsis", () => {
    const result = clip("one two three four five", 12);
    expect(result).toBe("one two…");
    expect(result.length).toBeLessThanOrEqual(12);
  });
});

describe("withBrand", () => {
  it("appends the site name", () => {
    expect(withBrand("Team")).toBe(`Team | ${siteData.name}`);
  });
});

describe("JSON-LD builders", () => {
  it("builds a WebPage with an absolute URL", () => {
    const ld = webPageJsonLd({ title: "Team", description: "d", path: "/team" });
    expect(ld).toMatchObject({ "@type": "WebPage", name: "Team", url: `${site}/team/` });
  });

  it("numbers breadcrumb positions from 1", () => {
    const ld = breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
    ]);
    expect(ld.itemListElement).toEqual([
      { "@type": "ListItem", position: 1, name: "Home", item: `${site}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${site}/blog/` },
    ]);
  });

  it("falls back to the publish date when a post has no update date", () => {
    const date = new Date("2025-08-05T00:00:00Z");
    const ld = blogPostingJsonLd({
      title: "T",
      description: "D",
      path: "/post",
      image: `${site}/img.jpg`,
      date,
      tags: ["Solidity", "Testing"],
    });
    expect(ld).toMatchObject({
      datePublished: date.toISOString(),
      dateModified: date.toISOString(),
      keywords: "Solidity, Testing",
      mainEntityOfPage: `${site}/post/`,
    });
  });
});
