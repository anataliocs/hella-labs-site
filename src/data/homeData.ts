// Homepage hero, team strip, digital asset flywheel and the CTA under the blog feed (ported from the Jekyll hero/team settings)
import heroImage from "@src/assets/images/home-hero-image.jpg";
import chris from "@src/assets/images/team/chris-anatalio.png";
import anna from "@src/assets/images/team/anna-lopatina.jpg";
import manilaEngineer from "@src/assets/images/team/manila-office-engineer.jpg";
import manilaOffice from "@src/assets/images/team/manila-office.jpg";
import logo from "@src/assets/images/brand/hella-logo-1.jpg";
import flywheelImage from "@src/assets/images/new-blockchain-flywheel.jpg";

export const heroData = {
  title: "Hella Labs",
  subtitle: "Specialized Fintech+Blockchain Fractional Engineering, DevRel & Consulting",
  description:
    "Creators of industry-standard Web3 test automation tools. We provide fractional engineering to accelerate your transition to a decentralized future.",
  image: {
    src: heroImage,
    alt: "Neon-tinted street at sunset with a person walking past a car, overlaid with blockchain network nodes and currency tickers",
  },
  pillars: [
    { label: "Design", icon: "fa6-solid:marker" },
    { label: "Build", icon: "fa6-solid:code" },
    { label: "Launch", icon: "fa6-solid:rocket" },
    { label: "Scale", icon: "fa6-solid:maximize" },
  ],
  primaryCta: { label: "Let's Go", href: "/contact/", icon: "fa6-solid:rocket" },
  secondaryCta: {
    label: "DM",
    ariaLabel: "DM us on Telegram",
    href: "https://t.me/anataliocs",
    icon: "fa6-brands:telegram",
  },
  stack: [
    { name: "Ethereum", icon: "fa6-brands:ethereum" },
    { name: "Node.js", icon: "fa6-brands:node-js" },
    { name: "Node", icon: "fa6-brands:node" },
    { name: "CSS", icon: "fa6-brands:css3" },
    { name: "HTML5", icon: "fa6-brands:html5" },
    { name: "Rust", icon: "fa6-brands:rust" },
    { name: "Sass", icon: "fa6-brands:sass" },
    { name: "AWS", icon: "fa6-brands:aws" },
    { name: "Linux", icon: "fa6-brands:linux" },
    { name: "Discord", icon: "fa6-brands:discord" },
    { name: "Java", icon: "fa6-brands:java" },
    { name: "Docker", icon: "fa6-brands:docker" },
  ],
};

export const teamStripData = {
  title: "Deep US-based expertise multiplied by global workforce efficiency",
  cta: { label: "Meet the Team", href: "/team/", icon: "fa6-solid:people-group" },
  images: [
    { src: chris, alt: "Chris Anatalio" },
    { src: anna, alt: "Anna Lopatina" },
    {
      src: manilaEngineer,
      alt: "Illustrated Hella Labs global team engineer in front of the Manila skyline at dusk",
    },
    {
      src: manilaOffice,
      alt: "Neon Manila Office sign under a glowing Philippine flag, above a laptop and the city skyline",
    },
    { src: logo, alt: "Hella Labs logo" },
  ],
};

export interface FlywheelStage {
  title: string;
  icon: string;
  text: string;
}

// The emerging digital asset flywheel: stages run clockwise around the wheel in the image
export const flywheelData = {
  title: "The Emerging Digital Asset Flywheel",
  image: {
    src: flywheelImage,
    alt: "Pixel-art monitor showing a five-stage loop: RWA & Tokenization, Back-Office Rails, $33T Stablecoins, x402 AI Agents, and Yield & Liquidity, with arrows cycling back to the start",
  },
  stages: [
    {
      title: "RWA & Tokenization",
      icon: "fa6-solid:building-columns",
      text: "Institutions bring trillions in real-world assets (T-bills, credit, funds) on-chain as programmable collateral.",
    },
    {
      title: "Back-Office Rails",
      icon: "fa6-solid:gears",
      text: "Custodians, clearinghouses, and corporate ERPs integrate directly with blockchains for automated, real-time settlement.",
    },
    {
      title: "Stablecoin Volume",
      icon: "fa6-solid:coins",
      text: "Frictionless back-office plumbing scales stablecoins into the 24/7 global settlement layer for B2B and cross-border payments.",
    },
    {
      title: "x402 AI Agents",
      icon: "fa6-solid:robot",
      text: "Autonomous agents leverage deep, instant stablecoin liquidity to pay for APIs, data, and compute per-request via HTTP 402.",
    },
    {
      title: "Liquidity Demand",
      icon: "fa6-solid:water",
      text: "Continuous machine-to-machine transaction volume drives massive demand for stablecoin reserves.",
    },
    {
      title: "Idle Float",
      icon: "fa6-solid:vault",
      text: "The idle float backing stablecoin volume drives demand for tokenized T-bills incentivizing institutions to tokenize even more assets.",
    },
  ] satisfies FlywheelStage[],
  tagline: "Hella Labs accelerating towards the on-chain future",
};

// Call-to-action under the homepage blog feed
export const homeCtaData = {
  title: "Ready to build on-chain?",
  text: "Book a free 30-minute call. Tell us what you're building and we'll map out how fractional engineering, DevRel, or a custom integration can get you to launch faster.",
  button: { label: "Book a Free Call", href: "/contact/" },
  link: { label: "Or explore our services", href: "/web3-consultant-service-offerings/" },
};
