// Copy for the Lighthouse reports page (/lighthouse-reports/). The reports themselves come from
// the `reports` content collection (src/assets/reports/*.json + matching .html).

export const lighthouseData = {
  title: "Lighthouse Reports",
  description:
    "Google Lighthouse audits of hellalabs.dev on mobile and desktop: performance, accessibility, best practices, SEO and agentic browsing scores, with links to the full reports.",
  intro: [
    "Lighthouse is Google's open-source auditing tool, built into Chrome DevTools and PageSpeed Insights. It loads a page in a controlled lab environment, measures how quickly it renders and responds, and runs hundreds of automated checks for accessibility, security, search visibility and, most recently, how well AI agents can read and use the page.",
    "We hold our own site to the same standard we hold client front-ends to. These are unedited Lighthouse runs against the live production site; scroll down for the score summary of each device, with a link to its full interactive report.",
  ],
  // Keyed by Lighthouse category id; categories missing here still render with their own title
  categories: {
    performance: {
      icon: "fa6-solid:gauge-high",
      summary:
        "How fast the page loads and becomes usable, from Core Web Vitals such as Largest Contentful Paint, Total Blocking Time and Cumulative Layout Shift.",
    },
    accessibility: {
      icon: "fa6-solid:people-group",
      summary:
        "Automated WCAG checks: color contrast, labels and names, ARIA usage, heading order and keyboard navigation.",
    },
    "best-practices": {
      icon: "fa6-solid:shield-halved",
      summary:
        "Security and modern web hygiene: HTTPS, no browser console errors, no deprecated APIs and correctly sized images.",
    },
    seo: {
      icon: "fa6-solid:globe",
      summary:
        "Whether search engines can crawl and understand the page: titles, meta descriptions, valid links, robots rules and mobile-friendliness.",
    },
    "agentic-browsing": {
      icon: "fa6-solid:microchip",
      summary:
        "Lighthouse's newest category: whether AI agents can discover and operate the site, through a well-formed accessibility tree, a valid llms.txt and correct WebMCP integrations.",
    },
  } as Record<string, { icon: string; summary: string } | undefined>,
  // Lab metrics shown under each report's scores (Lighthouse audit ids)
  metrics: [
    "first-contentful-paint",
    "largest-contentful-paint",
    "total-blocking-time",
    "cumulative-layout-shift",
    "speed-index",
  ],
  devices: {
    mobile: {
      label: "Mobile",
      icon: "fa6-solid:mobile-screen",
      note: "Emulated mid-range phone on a throttled 4G connection with a slowed-down CPU, the stricter of the two runs.",
    },
    desktop: {
      label: "Desktop",
      icon: "fa6-solid:desktop",
      note: "Emulated desktop screen on a fast wired connection.",
    },
  },
  // Default copy for <LighthouseCta />, the block that points visitors to this page
  cta: {
    title: "We hold our own site to the same bar",
    text: "Our public Lighthouse reports show unedited mobile and desktop audits of hellalabs.dev across performance, accessibility, best practices, SEO, and agentic browsing, Lighthouse's new category for how well AI agents can read and use a site.",
    label: "See our Lighthouse reports",
    href: "/lighthouse-reports/",
  },
  scoreLegend: "Scores are 0–100: 90 and above is good, 50–89 needs improvement, below 50 is poor.",
};
