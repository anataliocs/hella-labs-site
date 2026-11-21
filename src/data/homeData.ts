// Homepage hero + team strip (ported from the Jekyll hero/team settings)
import heroImage from "@src/assets/images/101.jpg";
import chris from "@src/assets/images/team/chris-anatalio.png";
import anna from "@src/assets/images/team/anna-lopatina.jpg";
import manilaEngineer from "@src/assets/images/team/manila-office-engineer.jpg";
import manilaOffice from "@src/assets/images/team/manila-office.jpg";
import logo from "@src/assets/images/brand/hella-logo-1.png";

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
  secondaryCta: { label: "DM", href: "https://t.me/anataliocs", icon: "fa6-brands:telegram" },
  // Stack we work with, shown as glowing brand icons under the buttons
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
