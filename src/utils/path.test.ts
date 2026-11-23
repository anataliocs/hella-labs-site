import { describe, expect, it } from "vitest";
import { isActivePath, isExternal, resolveHref, url } from "@src/utils/path";

describe("url", () => {
  it.each([
    [undefined, "/"],
    ["", "/"],
    ["/", "/"],
    ["/team", "/team/"],
    ["team", "/team/"],
    ["/team/", "/team/"],
    ["/feed.xml", "/feed.xml"],
    ["/tags?tag=web3", "/tags/?tag=web3"],
    ["/services#offers", "/services/#offers"],
  ])("url(%j) → %s", (input, expected) => {
    expect(url(input)).toBe(expected);
  });
});

describe("isActivePath", () => {
  it("matches the exact page and nested routes", () => {
    expect(isActivePath("/open-source/", "/open-source")).toBe(true);
    expect(isActivePath("/open-source/wiremock/", "/open-source")).toBe(true);
  });

  it("does not match sibling routes that share a prefix", () => {
    expect(isActivePath("/open-sourcery/", "/open-source")).toBe(false);
  });

  it("only treats home as active on the home page", () => {
    expect(isActivePath("/", "/")).toBe(true);
    expect(isActivePath("/team/", "/")).toBe(false);
  });

  it("ignores nested routes when exact", () => {
    expect(isActivePath("/blog/", "/blog/", true)).toBe(true);
    expect(isActivePath("/blog/series/", "/blog/", true)).toBe(false);
  });
});

describe("isExternal / resolveHref", () => {
  it.each(["https://x.com", "http://a.b", "mailto:hi@x.dev", "tel:+15555555555"])(
    "%s is external and left untouched",
    (href) => {
      expect(isExternal(href)).toBe(true);
      expect(resolveHref(href)).toBe(href);
    },
  );

  it("keeps anchors and normalizes internal links", () => {
    expect(resolveHref("#top")).toBe("#top");
    expect(resolveHref("/contact")).toBe("/contact/");
    expect(isExternal("/contact")).toBe(false);
  });
});
