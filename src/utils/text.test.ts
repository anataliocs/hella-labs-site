import { describe, expect, it } from "vitest";
import { renderInline, tagSlug } from "@src/utils/text";

describe("renderInline", () => {
  it("turns **bold** into <strong>", () => {
    expect(renderInline("Ship **fast** and **safe**")).toBe(
      "Ship <strong>fast</strong> and <strong>safe</strong>",
    );
  });

  it("escapes HTML before applying markup", () => {
    expect(renderInline('<script>"x" & **y**</script>')).toBe(
      "&lt;script&gt;&quot;x&quot; &amp; <strong>y</strong>&lt;/script&gt;",
    );
  });
});

describe("tagSlug", () => {
  it.each([
    ["Smart Contracts", "smart-contracts"],
    ["CSS-tricks", "css-tricks"],
    ["  Web3 / DeFi!  ", "web3-defi"],
    ["Node.js", "node-js"],
  ])("%s → %s", (tag, slug) => {
    expect(tagSlug(tag)).toBe(slug);
  });
});
