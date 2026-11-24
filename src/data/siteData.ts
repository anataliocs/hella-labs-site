// Site-wide settings (ported from the Jekyll _config.yml + _data/settings.yml)
import defaultImage from "@src/assets/images/hella-bg-1.jpg";
import authorAvatar from "@src/assets/images/team/chris-anatalio.png";
import logoLight from "@src/assets/images/brand/hella-logo-4.png";
import logoDark from "@src/assets/images/brand/hella-logo-3.jpg";

export const siteData = {
  // Short brand name, appended to page titles ("Team | Hella Labs")
  name: "Hella Labs",
  // Full title, used for the homepage and the footer
  title: "Hella Labs Fintech and Blockchain Fractional Engineering",
  legalName: "Hella Consulting",
  description:
    "Hella Labs: Fintech + Blockchain native fractional engineering, DevRel, digital marketing and strategy. US expertise multiplied by the cost effectiveness of offshore resources.",
  keywords: [
    "Web3",
    "Consulting",
    "Fintech",
    "Engineering",
    "DevRel",
    "Digital Marketing",
    "Strategy",
    "Blockchain",
    "Crypto",
    "Cryptocurrency",
    "Digital Assets",
    "Tokenization",
    "RWAs",
    "Fractional Engineering",
    "Fractional CTO",
  ],
  locale: "en_US",
  themeColor: "#ae00ee",
  twitterHandle: "@Hella_Web3",
  // Bing Webmaster Tools site ownership verification (msvalidate.01)
  bingSiteVerification: "8B55AC4C2FDC3E8C669FB64694F8FE1D",

  logo: { light: logoLight, dark: logoDark, alt: "Hella Labs" },
  // 1200×630 fallback for og:image when a page has no image of its own
  defaultImage: {
    src: defaultImage,
    alt: "Glowing neon Hella logo, a rock-on hand sign above the word Hella",
  },

  author: {
    name: "Chris Anatalio",
    avatar: authorAvatar,
    href: "/team/",
  },

  // Office locations, shown as map pins (LocationPins)
  locations: ["NYC", "Manila"],
  footer: {
    description:
      "Unleash the potential of your startup with Onsite, Remote and Offshore consulting and staff augmentation. We provide the expertise of Silicon Valley multiplied by the cost-effectiveness of Offshore resources.",
    copyrightName: "Hella Labs",
    builtBy: { name: "Chris Anatalio", href: "https://www.linkedin.com/in/anataliocs/" },
    // Bottom footer row: machine-readable files generated at build (astro-llms-md +
    // @astrojs/sitemap) and the Lighthouse reports page, which is only linked from here
    resourceLinks: [
      { title: "Lighthouse reports", href: "/lighthouse-reports/" },
      { title: "llms.txt", href: "/llms.txt" },
      { title: "llms-full.txt", href: "/llms-full.txt" },
      { title: "Sitemap index", href: "/sitemap-index.xml" },
      { title: "Sitemap", href: "/sitemap-0.xml" },
    ],
  },

  contact: {
    // Handled by the Cloudflare Worker in worker/index.ts, which emails the submission
    formAction: "/api/contact",
    buttonText: "LFG!",
    sendingText: "Sending…",
    successMessage: "Thanks! Your message is on its way. We'll get back to you soon.",
    errorMessage: "Sorry, your message couldn't be sent. Please try again or reach us on Telegram.",
    inquiryTypes: ["Consulting", "Fractional Engineering", "Questions", "OSS", "Events"],
    telegram: "https://t.me/hella_web3",
    directMessage: "https://t.me/anataliocs",
    // Shown after a successful submission (inline on /contact/ and on /contact/thanks/)
    nextSteps: {
      title: "What happens next",
      // Button at the bottom of the block, linking to `directMessage` (Telegram DM)
      ctaLabel: "Need answers sooner?",
      blogLink: { label: "Check out our blog", href: "/blog/" },
      steps: [
        { icon: "fa6-solid:clock", text: "We respond within 24 hours." },
        {
          icon: "fa6-solid:calendar-check",
          text: "We reach out to schedule a free 1-hour consultation.",
        },
        {
          icon: "fa6-solid:file-lines",
          text: "We send you a report with recommendations and actionable next steps.",
        },
        {
          icon: "fa6-solid:handshake",
          text: "If we're aligned, we move forward to the contract step.",
        },
      ],
      notes: [
        "Rates vary based on the work. We spin up tightly integrated US/Manila teams to maintain a continuous development cadence.",
        "Our global workforce allows us to offer very competitive rates.",
      ],
    },
  },

  // Comments load on demand when the reader clicks "Show Comments"
  disqus: {
    enabled: true,
    shortname: "dsq-count-scr",
    title: "Start the conversation",
    buttonText: "Show Comments",
  },

  blog: {
    title: "Topic Zero Blog",
    // Posts per page on the homepage feed (/, /page/2/, …)
    pageSize: 4,
  },
} as const;
