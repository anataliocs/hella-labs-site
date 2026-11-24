// Social profiles shown in the footer, sidebar and contact page (the footer adds the blog
// platforms). `icon` is an astro-icon name.

export interface SocialLink {
  name: string;
  href: string;
  icon: string;
}

const profiles: SocialLink[] = [
  { name: "X (Twitter)", href: "https://x.com/Hella_Web3", icon: "fa6-brands:x-twitter" },
  { name: "GitHub", href: "https://github.com/hella-labs", icon: "fa6-brands:github" },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/hella-labs",
    icon: "fa6-brands:linkedin",
  },
  { name: "YouTube", href: "https://www.youtube.com/@hella-labs", icon: "fa6-brands:youtube" },
  { name: "Dev.to", href: "https://dev.to/hella-labs", icon: "fa6-brands:dev" },
];

// Newsletter/blog platforms we cross-post to (footer only, to keep the sidebar tile row short)
const blogPlatforms: SocialLink[] = [
  { name: "Substack", href: "https://substack.com/@hellalabs", icon: "simple-icons:substack" },
  { name: "Hashnode", href: "https://hellalabs.hashnode.dev/", icon: "fa6-brands:hashnode" },
];

const rss: SocialLink = { name: "RSS feed", href: "/feed.xml", icon: "fa6-solid:rss" };

export const socialLinks: SocialLink[] = [...profiles, rss];

export const footerSocialLinks: SocialLink[] = [...profiles, ...blogPlatforms, rss];

export const telegramLink: SocialLink = {
  name: "Telegram",
  href: "https://t.me/hella_web3",
  icon: "fa6-brands:telegram",
};
