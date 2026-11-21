// Runs against the real src/content/blog folder (tests run from the repo root)
import { describe, expect, it } from "vitest";
import { createLastmodResolver } from "@src/utils/sitemap";

const site = "https://www.hellalabs.dev";
const lastmod = createLastmodResolver();

describe("createLastmodResolver", () => {
  it("dates a blog post from its frontmatter", () => {
    expect(lastmod(`${site}/solidity-lifecycle-testing-foundry-anvil/`)).toBeInstanceOf(Date);
  });

  it("dates feed pages from the newest post", () => {
    const home = lastmod(`${site}/`);
    expect(home).toBeInstanceOf(Date);
    expect(lastmod(`${site}/blog/`)).toEqual(home);
    expect(lastmod(`${site}/tags/`)).toEqual(home);
  });

  it("returns undefined for a tag no post uses", () => {
    expect(lastmod(`${site}/tags/no-such-tag/`)).toBeUndefined();
  });
});
