// Blog post queries and helpers: sorting, reading time, tags, related/featured posts.
import { getCollection, type CollectionEntry } from "astro:content";
import { tagGradients, type TagGradient } from "@src/data/tagColorsData";
import { tagSlug } from "@src/utils/text";

export { tagSlug };

export type Post = CollectionEntry<"blog">;

export interface Tag {
  name: string;
  slug: string;
  count: number;
  // Pill gradient, assigned round-robin in alphabetical order so neighbouring topics never match
  gradient: TagGradient;
}

// All posts, newest first
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection("blog");
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function postPath(post: Post): string {
  return `/${post.id}/`;
}

// "05 Aug, 2025" (the Jekyll theme's "%d %-b, %Y" format)
export function formatDate(date: Date): string {
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
  return `${day} ${month}, ${date.getUTCFullYear()}`;
}

// Same rule as the Jekyll theme: 1 min under 360 words, otherwise words / 180
export function readingTime(post: Post): string {
  const words = (post.body ?? "").split(/\s+/).filter(Boolean).length;
  return words < 360 ? "1 min read" : `${Math.floor(words / 180)} min read`;
}

export function tagPath(tag: string): string {
  return `/tags/${tagSlug(tag)}/`;
}

// Every tag across `posts`, sorted alphabetically, each with its pill gradient
export function getTags(posts: Post[]): Tag[] {
  const tags = new Map<string, Omit<Tag, "gradient">>();
  for (const post of posts) {
    for (const name of post.data.tags) {
      const slug = tagSlug(name);
      const tag = tags.get(slug);
      if (tag) tag.count++;
      else tags.set(slug, { name, slug, count: 1 });
    }
  }
  return [...tags.values()]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((tag, i) => ({ ...tag, gradient: tagGradients[i % tagGradients.length] }));
}

export function postsWithTag(posts: Post[], slug: string): Post[] {
  return posts.filter((post) => post.data.tags.some((t) => tagSlug(t) === slug));
}

// Every part of the series `post` belongs to, in part order (empty when it isn't in one)
export function getSeriesPosts(post: Post, posts: Post[]): Post[] {
  const name = post.data.series?.name;
  if (!name) return [];
  return posts
    .filter((p) => p.data.series?.name === name)
    .sort((a, b) => (a.data.series?.part ?? 0) - (b.data.series?.part ?? 0));
}

// Posts sharing at least one tag with `post`, most shared tags first
export function getRelatedPosts(post: Post, posts: Post[], max = 3): Post[] {
  const own = new Set(post.data.tags.map(tagSlug));
  return posts
    .filter((p) => p.id !== post.id)
    .map((p) => ({ p, shared: p.data.tags.filter((t) => own.has(tagSlug(t))).length }))
    .filter(({ shared }) => shared > 0)
    .sort((a, b) => b.shared - a.shared)
    .slice(0, max)
    .map(({ p }) => p);
}

export function getFeaturedPosts(posts: Post[], excludeId?: string, max = 8): Post[] {
  return posts.filter((p) => p.data.featured && p.id !== excludeId).slice(0, max);
}

// Neighbours in date order: `older` was published before `post`, `newer` after
export function getAdjacentPosts(post: Post, posts: Post[]) {
  const index = posts.findIndex((p) => p.id === post.id);
  return { newer: posts[index - 1], older: posts[index + 1] };
}

// { year → { month → posts } } in newest-first order, for the /blog/ archive
export function groupByYearAndMonth(posts: Post[]) {
  const years = new Map<number, Map<string, Post[]>>();
  for (const post of posts) {
    const year = post.data.date.getUTCFullYear();
    const month = post.data.date.toLocaleString("en-US", { month: "long", timeZone: "UTC" });
    const months = years.get(year) ?? new Map<string, Post[]>();
    months.set(month, [...(months.get(month) ?? []), post]);
    years.set(year, months);
  }
  return [...years.entries()].map(([year, months]) => ({
    year,
    count: [...months.values()].flat().length,
    months: [...months.entries()].map(([name, items]) => ({ name, posts: items })),
  }));
}
