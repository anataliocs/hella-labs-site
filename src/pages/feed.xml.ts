// RSS feed of every post (/feed.xml, same URL as the Jekyll feed)
import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { siteData } from "@src/data/siteData";
import { url } from "@src/utils/path";
import { getPosts, postPath } from "@src/utils/posts";

export const GET: APIRoute = async ({ site }) => {
  const posts = await getPosts();
  return rss({
    title: siteData.title,
    description: siteData.description,
    site: site ?? import.meta.env.SITE,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: url(postPath(post)),
      categories: post.data.tags,
    })),
    customData: "<language>en-us</language>",
  });
};
