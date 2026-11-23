// Main navigation (header dropdowns + footer link columns)

// Placeholder href for "the newest post", resolved by the header (see Header.astro)
export const latestPostHref = "/blog/latest/";

export interface NavItem {
  title: string;
  href: string;
  // Only active on this exact path, not its sub-pages (e.g. "All posts" vs /blog/series/)
  exact?: boolean;
  children?: NavItem[];
}

export const mainNav: NavItem[] = [
  {
    title: "Services",
    href: "/web3-consultant-service-offerings/",
    children: [
      { title: "Custom Discord Bot", href: "/services/custom-discord-bot/" },
      { title: "On-chain Web/Mobile Apps", href: "/services/dapp-web-front-end/" },
      { title: "DevOps & Test Automation", href: "/services/devops-test-automation/" },
      { title: "Web3 Tooling & SDKs", href: "/services/web3-tooling-sdks/" },
      { title: "DevRel & Technical Content", href: "/services/technical-articles/" },
      { title: "GTM Launch Package", href: "/services/gtm-launch-package/" },
    ],
  },
  {
    title: "Open Source",
    href: "/open-source/",
    children: [
      { title: "Foundry Anvil Testcontainers", href: "/open-source/foundry-anvil-testcontainers/" },
      { title: "WireMock Testcontainers", href: "/open-source/wiremock-testcontainers/" },
    ],
  },
  { title: "Team", href: "/team/" },
  { title: "Contact", href: "/contact/" },
  {
    title: "Blog",
    href: "/blog/",
    children: [
      { title: "All Posts", href: "/blog/", exact: true },
      // The header swaps this for the newest post's own URL at build time, so clicking it is a
      // normal page load; /blog/latest/ stays as a redirect for shared links.
      { title: "Latest Post", href: latestPostHref },
      { title: "Series", href: "/blog/series/" },
    ],
  },
];

// Header call-to-action (rocket button)
export const navCta = { href: "/contact/", label: "Contact Hella Labs" };
