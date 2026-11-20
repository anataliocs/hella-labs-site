// RSS feed of every post (/feed.xml, same URL as the Jekyll feed)
import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { siteData } from "@src/data/siteData";
import { url } from "@src/utils/path";
import { getPosts, postPath } from "@src/utils/posts";

// WebSub (PubSubHubbub) hub. CI pings it after each deploy so subscribers get pushed updates.
const WEBSUB_HUB = "https://pubsubhubbub.appspot.com/";

export const GET: APIRoute = async ({ site }) => {
  const posts = await getPosts();
  const siteURL = site ?? new URL(import.meta.env.SITE);
  const feedURL = new URL(url("/feed.xml"), siteURL).href;
  return rss({
    title: siteData.title,
    description: siteData.description,
    site: siteURL,
    xmlns: { atom: "http://www.w3.org/2005/Atom" },
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: url(postPath(post)),
      categories: post.data.tags,
    })),
    // WebSub discovery: subscribers find the hub and the canonical topic URL in the feed itself
    customData: [
      "<language>en-us</language>",
      `<atom:link rel="hub" href="${WEBSUB_HUB}" />`,
      `<atom:link rel="self" type="application/rss+xml" href="${feedURL}" />`,
    ].join(""),
  });
};
