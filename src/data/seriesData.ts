// Multi-part blog series. A post joins one with `series: { id, part }` in its frontmatter; the
// name and description live here so a series can be renamed in one place. Listed on /blog/series/
// and in the "Part N of M" box on each post (SeriesNav).
export interface BlogSeries {
  name: string;
  description: string;
}

export const blogSeries = {
  "real-time-onchain-data-nestjs": {
    name: "Real-Time On-chain Data with Nest.js",
    description:
      "Wrap a blockchain SDK in reusable Nest.js modules once, then serve live on-chain data over WebSockets, Server-Sent Events and GraphQL to ultra-thin clients with RxJS.",
  },
} as const satisfies Record<string, BlogSeries>;

export type SeriesId = keyof typeof blogSeries;

export const seriesIds = Object.keys(blogSeries) as [SeriesId, ...SeriesId[]];
