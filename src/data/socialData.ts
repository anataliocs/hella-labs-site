// Social profiles shown in the footer, sidebar and contact page. `icon` is an astro-icon name.

export interface SocialLink {
  name: string;
  href: string;
  icon: string;
}

export const socialLinks: SocialLink[] = [
  { name: "X (Twitter)", href: "http://twitter.hellalabs.dev/", icon: "fa6-brands:x-twitter" },
  { name: "GitHub", href: "https://github.com/hella-labs", icon: "fa6-brands:github" },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/hella-web3",
    icon: "fa6-brands:linkedin",
  },
  { name: "YouTube", href: "https://www.youtube.com/@hella-web3", icon: "fa6-brands:youtube" },
  { name: "Dev.to", href: "https://dev.to/hella-web3", icon: "fa6-brands:dev" },
  { name: "RSS feed", href: "/feed.xml", icon: "fa6-solid:rss" },
];

export const telegramLink: SocialLink = {
  name: "Telegram",
  href: "https://t.me/hella_web3",
  icon: "fa6-brands:telegram",
};
