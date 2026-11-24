// SEO helpers: absolute URLs, title/description builders and JSON-LD.
import { siteData } from "@src/data/siteData";
import { footerSocialLinks, telegramLink } from "@src/data/socialData";
import { url } from "@src/utils/path";

type JsonLd = Record<string, unknown>;

// Absolute URL (site + BASE_URL + path, trailing slash on pages) for canonicals, OG and JSON-LD
export function absoluteUrl(path: string): string {
  return new URL(url(path), import.meta.env.SITE).href;
}

// Trims to the last full word under `max` characters
export function clip(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
}

// "Team" → "Team | Hella Labs"
export function withBrand(title: string): string {
  return `${title} | ${siteData.name}`;
}

const organizationId = `${absoluteUrl("/")}#organization`;
const websiteId = `${absoluteUrl("/")}#website`;
// Every external profile linked in the footer, plus Telegram (the RSS feed is on-site, so it's skipped)
const sameAs = [...footerSocialLinks, telegramLink]
  .map((s) => s.href)
  .filter((href) => href.startsWith("http"));

// Organization + WebSite, output on every page so other nodes can reference them by @id
export function siteJsonLd(logoUrl: string): JsonLd {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: siteData.name,
        legalName: siteData.legalName,
        description: siteData.description,
        url: absoluteUrl("/"),
        logo: logoUrl,
        sameAs,
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: siteData.title,
        description: siteData.description,
        url: absoluteUrl("/"),
        inLanguage: "en",
        publisher: { "@id": organizationId },
      },
    ],
  };
}

export function webPageJsonLd(page: { title: string; description: string; path: string }): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.title,
    description: page.description,
    url: absoluteUrl(page.path),
    isPartOf: { "@id": websiteId },
  };
}

export function breadcrumbJsonLd(crumbs: { name: string; path: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

export function blogPostingJsonLd(post: {
  title: string;
  description: string;
  path: string;
  image: string;
  date: Date;
  updated?: Date;
  tags: string[];
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: post.image,
    datePublished: post.date.toISOString(),
    dateModified: (post.updated ?? post.date).toISOString(),
    author: {
      "@type": "Person",
      name: siteData.author.name,
      url: absoluteUrl(siteData.author.href),
    },
    publisher: { "@id": organizationId },
    mainEntityOfPage: absoluteUrl(post.path),
    keywords: post.tags.join(", "),
    inLanguage: "en",
  };
}
