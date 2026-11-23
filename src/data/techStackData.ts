// Languages and technologies a blog post can highlight in its tech stack row (`techStack` in the
// blog frontmatter). Each tile gets a gradient built around the technology's own brand color,
// deepened where needed so the icon keeps ≥ 3:1 contrast (WCAG non-text). Font Awesome brands are
// used when they have the logo; Simple Icons fills the gaps (TypeScript, Solidity, NestJS, …), and
// tools with no published logo fall back to a fitting Font Awesome solid icon.
export interface Tech {
  name: string;
  // One-line description shown in the tile's hover infobox
  blurb: string;
  // Iconify name; must also be listed in the matching `include` set in astro.config.mjs
  icon: string;
  from: string;
  to: string;
  // Icon color (defaults to white)
  fg?: string;
}

export const techStack = {
  typescript: {
    name: "TypeScript",
    blurb: "JavaScript with static types that catch bugs before runtime",
    icon: "simple-icons:typescript",
    from: "#3178c6",
    to: "#1e4f8a",
  },
  javascript: {
    name: "JavaScript",
    blurb: "The language of the web, in the browser and on the server",
    icon: "fa6-brands:js",
    from: "#f7df1e",
    to: "#e0a800",
    fg: "#1a1a1a",
  },
  solidity: {
    name: "Solidity",
    blurb: "Contract-oriented language for Ethereum smart contracts",
    icon: "simple-icons:solidity",
    from: "#6b6f9e",
    to: "#2b2d4a",
  },
  nodejs: {
    name: "Node.js",
    blurb: "JavaScript runtime for servers, tooling and test suites",
    icon: "fa6-brands:node-js",
    from: "#539e43",
    to: "#2c5f25",
  },
  docker: {
    name: "Docker",
    blurb: "Packages apps and services into portable containers",
    icon: "fa6-brands:docker",
    from: "#2496ed",
    to: "#1d4fc4",
  },
  ethereum: {
    name: "Ethereum",
    blurb: "Programmable blockchain running smart contracts on the EVM",
    icon: "fa6-brands:ethereum",
    from: "#627eea",
    to: "#3c3c3d",
  },
  ethers: {
    name: "Ethers.js",
    blurb: "Compact library for talking to Ethereum nodes and wallets",
    icon: "simple-icons:ethers",
    from: "#2f44c4",
    to: "#0f1a63",
  },
  foundry: {
    name: "Foundry",
    blurb: "Fast Solidity toolkit for building, testing and deploying",
    icon: "fa6-solid:hammer",
    from: "#ea580c",
    to: "#7c2d12",
  },
  anvil: {
    name: "Anvil",
    blurb: "Foundry's local Ethereum node for development and tests",
    icon: "fa6-solid:cubes",
    from: "#c2410c",
    to: "#44403c",
  },
  wiremock: {
    name: "WireMock",
    blurb: "HTTP mock server for stubbing APIs and injecting faults",
    icon: "fa6-solid:plug",
    from: "#1a8fbf",
    to: "#0e4f75",
  },
  testcontainers: {
    name: "Testcontainers",
    blurb: "Throwaway Docker dependencies spun up from your tests",
    icon: "fa6-solid:box-open",
    from: "#12968a",
    to: "#291a3f",
  },
  graphql: {
    name: "GraphQL",
    blurb: "Query language that lets clients ask for exactly the data they need",
    icon: "simple-icons:graphql",
    from: "#e10098",
    to: "#8a005d",
  },
  nestjs: {
    name: "NestJS",
    blurb: "Structured, TypeScript-first Node.js backend framework",
    icon: "simple-icons:nestjs",
    from: "#e0234e",
    to: "#8f0f2b",
  },
  rxjs: {
    name: "RxJS",
    blurb: "Reactive streams for composing async and event-based data",
    icon: "simple-icons:reactivex",
    from: "#b7178c",
    to: "#5b1a8f",
  },
  websockets: {
    name: "WebSockets",
    blurb: "Persistent two-way connection between browser and server",
    icon: "fa6-solid:right-left",
    from: "#4b5563",
    to: "#1f2937",
  },
  html: {
    name: "HTML",
    blurb: "The markup that structures every web page",
    icon: "fa6-brands:html5",
    from: "#e34f26",
    to: "#a3300f",
  },
  css: {
    name: "CSS",
    blurb: "Styles, layouts and animations for the web",
    icon: "fa6-brands:css3-alt",
    from: "#1572b6",
    to: "#663399",
  },
  react: {
    name: "React",
    blurb: "Component library for building interactive UIs",
    icon: "fa6-brands:react",
    from: "#087ea4",
    to: "#04465e",
  },
  astro: {
    name: "Astro",
    blurb: "Content-first web framework that ships less JavaScript",
    icon: "simple-icons:astro",
    from: "#bc52ee",
    to: "#d4480b",
  },
  tailwind: {
    name: "Tailwind CSS",
    blurb: "Utility-first CSS framework for styling in markup",
    icon: "simple-icons:tailwindcss",
    from: "#0891b2",
    to: "#164e63",
  },
  vitest: {
    name: "Vitest",
    blurb: "Vite-native unit test runner with a Jest-compatible API",
    icon: "simple-icons:vitest",
    from: "#6f9a1b",
    to: "#3f5a0c",
  },
  jest: {
    name: "Jest",
    blurb: "Batteries-included JavaScript testing framework",
    icon: "simple-icons:jest",
    from: "#c21325",
    to: "#6b0a14",
  },
  rust: {
    name: "Rust",
    blurb: "Memory-safe systems language with zero-cost abstractions",
    icon: "fa6-brands:rust",
    from: "#ce422b",
    to: "#5c1d12",
  },
  python: {
    name: "Python",
    blurb: "Readable general-purpose language for scripts, data and AI",
    icon: "fa6-brands:python",
    from: "#3776ab",
    to: "#1e4a73",
  },
  go: {
    name: "Go",
    blurb: "Simple, fast compiled language built for concurrent services",
    icon: "fa6-brands:golang",
    from: "#00a7d0",
    to: "#00637c",
  },
} as const satisfies Record<string, Tech>;

export type TechKey = keyof typeof techStack;

export const techKeys = Object.keys(techStack) as [TechKey, ...TechKey[]];
