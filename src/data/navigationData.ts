// Main navigation (header dropdowns + footer link columns)

export interface NavItem {
  title: string;
  href: string;
  children?: NavItem[];
}

export const mainNav: NavItem[] = [
  {
    title: "Services",
    href: "/web3-consultant-service-offerings/",
    children: [
      { title: "Custom Discord Bot", href: "/services/custom-discord-bot/" },
      { title: "dApp Web Front-End", href: "/services/dapp-web-front-end/" },
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
  { title: "Blog", href: "/blog/" },
];

// Header call-to-action (rocket button)
export const navCta = { href: "/contact/", label: "Contact Hella Labs" };
