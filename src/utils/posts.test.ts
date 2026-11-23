import { describe, expect, it } from "vitest";
import { tagGradients } from "@src/data/tagColorsData";
import {
  formatDate,
  getAdjacentPosts,
  getFeaturedPosts,
  getRelatedPosts,
  getSeriesPosts,
  getTags,
  groupByYearAndMonth,
  postPath,
  postsWithTag,
  readingTime,
  tagPath,
  type Post,
} from "@src/utils/posts";

// Just enough of a blog collection entry for the pure helpers
function post(id: string, date: string, tags: string[], extra: Partial<Post["data"]> = {}): Post {
  return {
    id,
    body: "",
    data: { date: new Date(date), tags, featured: false, ...extra },
  } as unknown as Post;
}

// Newest first, like getPosts()
const posts = [
  post("c", "2025-08-05T00:00:00Z", ["Solidity", "Testing"], { featured: true }),
  post("b", "2025-08-01T00:00:00Z", ["Testing"]),
  post("a", "2024-12-31T00:00:00Z", ["Web3"], { featured: true }),
];

describe("formatting", () => {
  it("formats dates like the Jekyll theme, in UTC", () => {
    expect(formatDate(new Date("2025-08-05T23:30:00Z"))).toBe("05 Aug, 2025");
  });

  it("builds post and tag paths", () => {
    expect(postPath(posts[0])).toBe("/c/");
    expect(tagPath("Smart Contracts")).toBe("/tags/smart-contracts/");
  });

  it("estimates reading time", () => {
    const words = (n: number) => ({ ...posts[0], body: "word ".repeat(n) }) as Post;
    expect(readingTime(words(100))).toBe("1 min read");
    expect(readingTime(words(900))).toBe("5 min read");
  });
});

describe("tags", () => {
  it("counts tags, sorts by name and assigns gradients in order", () => {
    expect(getTags(posts)).toEqual([
      { name: "Solidity", slug: "solidity", count: 1, gradient: tagGradients[0] },
      { name: "Testing", slug: "testing", count: 2, gradient: tagGradients[1] },
      { name: "Web3", slug: "web3", count: 1, gradient: tagGradients[2] },
    ]);
  });

  it("cycles through the palette when there are more tags than gradients", () => {
    const names = Array.from({ length: tagGradients.length + 1 }, (_, i) => `Tag ${i + 10}`);
    const tags = getTags([post("x", "2025-01-01T00:00:00Z", names)]);
    expect(tags.at(-1)?.gradient).toBe(tagGradients[0]);
  });

  it("filters posts by tag slug", () => {
    expect(postsWithTag(posts, "testing").map((p) => p.id)).toEqual(["c", "b"]);
  });
});

describe("post lists", () => {
  it("finds related posts by shared tags, excluding the post itself", () => {
    expect(getRelatedPosts(posts[1], posts).map((p) => p.id)).toEqual(["c"]);
  });

  it("returns featured posts except the excluded one", () => {
    expect(getFeaturedPosts(posts, "c").map((p) => p.id)).toEqual(["a"]);
  });

  it("finds newer and older neighbours", () => {
    const { newer, older } = getAdjacentPosts(posts[1], posts);
    expect(newer?.id).toBe("c");
    expect(older?.id).toBe("a");
  });

  it("lists a post's series in part order, and nothing outside a series", () => {
    const series = (part: number) => ({ series: { name: "Streams", part } });
    const parts = [
      post("p2", "2025-09-02T00:00:00Z", [], series(2)),
      post("other", "2025-09-03T00:00:00Z", [], { series: { name: "Other", part: 1 } }),
      post("p1", "2025-09-01T00:00:00Z", [], series(1)),
    ];
    expect(getSeriesPosts(parts[0], parts).map((p) => p.id)).toEqual(["p1", "p2"]);
    expect(getSeriesPosts(posts[0], posts)).toEqual([]);
  });

  it("groups posts by year and month", () => {
    const groups = groupByYearAndMonth(posts);
    expect(groups.map((g) => [g.year, g.count])).toEqual([
      [2025, 2],
      [2024, 1],
    ]);
    expect(groups[0].months).toEqual([{ name: "August", posts: [posts[0], posts[1]] }]);
  });
});
