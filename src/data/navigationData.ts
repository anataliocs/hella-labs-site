// Main navigation (header dropdowns + footer link columns)

// Placeholder href for "the newest post", resolved by the header (see Header.astro)
export const latestPostHref = "/blog/latest/";

export interface NavItem {
  title: string;
  href: string;
  // astro-icon name; must be listed in the icon `include` config in astro.config.mjs
  icon: string;
  // Only active on this exact path, not its sub-pages (e.g. "All posts" vs /blog/series/)
  exact?: boolean;
  children?: NavItem[];
}

export const mainNav: NavItem[] = [
  {
    title: "Services",
    href: "/web3-consultant-service-offerings/",
    icon: "fa6-solid:briefcase",
    children: [
      {
        title: "On-chain Web/Mobile Apps",
        href: "/services/dapp-web-front-end/",
        icon: "fa6-solid:mobile-screen",
      },
      {
        title: "DevOps & Test Automation",
        href: "/services/devops-test-automation/",
        icon: "fa6-brands:docker",
      },
      {
        title: "Web3 Tooling & SDKs",
        href: "/services/web3-tooling-sdks/",
        icon: "fa6-solid:microchip",
      },
      {
        title: "Custom Discord Bot",
        href: "/services/custom-discord-bot/",
        icon: "fa6-brands:discord",
      },
      {
        title: "DevRel & Technical Content",
        href: "/services/technical-articles/",
        icon: "fa6-solid:pen-to-square",
      },
      {
        title: "GTM Launch Package",
        href: "/services/gtm-launch-package/",
        icon: "fa6-solid:rocket",
      },
    ],
  },
  {
    title: "Open Source",
    href: "/open-source/",
    icon: "fa6-solid:code-branch",
    children: [
      {
        title: "Foundry Anvil Testcontainers",
        href: "/open-source/foundry-anvil-testcontainers/",
        icon: "fa6-brands:ethereum",
      },
      {
        title: "WireMock Testcontainers",
        href: "/open-source/wiremock-testcontainers/",
        icon: "fa6-solid:network-wired",
      },
    ],
  },
  {
    title: "Blog",
    href: "/blog/",
    icon: "fa6-solid:pen-nib",
    children: [
      { title: "All Posts", href: "/blog/", exact: true, icon: "fa6-solid:list" },
      // The header swaps this for the newest post's own URL at build time, so clicking it is a
      // normal page load; /blog/latest/ stays as a redirect for shared links.
      { title: "Latest Post", href: latestPostHref, icon: "fa6-solid:clock" },
      { title: "Series", href: "/blog/series/", icon: "fa6-solid:book-open" },
    ],
  },
  {
    title: "About",
    href: "/team/",
    icon: "fa6-solid:circle-info",
    children: [
      { title: "Team", href: "/team/", icon: "fa6-solid:people-group" },
      { title: "Brand Kit", href: "/brand-kit/", icon: "fa6-solid:palette" },
      { title: "Careers", href: "/careers/", icon: "fa6-solid:user-tie" },
    ],
  },
  // Kept last so it sits at the far right of the header nav
  { title: "Contact", href: "/contact/", icon: "fa6-solid:envelope" },
];

// Header call-to-action (rocket button)
export const navCta = { href: "/contact/", label: "Contact Hella Labs" };
