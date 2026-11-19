const base = import.meta.env.BASE_URL.replace(/\/$/, "");

// Builds an internal URL that respects BASE_URL. Page paths always get a trailing slash (to match
// `trailingSlash: "always"` and the directory build format); file paths like /feed.xml don't.
// Query strings and hashes are kept: url("/tags?x=1") → "/tags/?x=1".
export function url(path = "/"): string {
  const p = !path ? "/" : path.startsWith("/") ? path : `/${path}`;
  const split = p.search(/[?#]/);
  const pathname = split === -1 ? p : p.slice(0, split);
  const suffix = split === -1 ? "" : p.slice(split);
  const lastSegment = pathname.slice(pathname.lastIndexOf("/") + 1);
  const needsSlash = !pathname.endsWith("/") && !lastSegment.includes(".");
  return `${base}${pathname}${needsSlash ? "/" : ""}${suffix}`;
}

// Checks if the current pathname matches a nav link's href, including nested routes
// e.g. href="/open-source" is active for both "/open-source/" and "/open-source/wiremock/"
export function isActivePath(pathname: string, href: string): boolean {
  const target = url(href).replace(/\/+$/, "") || "/";
  const current = pathname.replace(/\/+$/, "") || "/";
  if (target === "/") return current === "/";
  return current === target || current.startsWith(`${target}/`);
}

// External links (http(s), mailto, tel) open in a new tab and skip url()
export function isExternal(href: string): boolean {
  return /^(https?:\/\/|mailto:|tel:)/.test(href);
}

// url() for internal links, untouched for external/anchor links
export function resolveHref(href: string): string {
  return isExternal(href) || href.startsWith("#") ? href : url(href);
}
