// Global workforce pitch (Manila office), adapted from the team page's "Global Talent" section
import manilaOfficeWide from "@src/assets/images/manila-office-wide.jpg";

export const globalTeamData = {
  title: "Global Talent, Silicon Valley Standards",
  intro:
    "We combine Silicon Valley expertise with global talent efficiency. Our Manila office works alongside our senior US engineers as one integrated team, so your project keeps moving around the clock.",
  benefits: [
    {
      title: "24/7 Development Cycles",
      icon: "fa6-solid:globe",
      text: "Strategic overlap with US and Asia-Pacific time zones enables true follow-the-sun development. Work handed off at the end of the US day is moving forward by morning.",
    },
    {
      title: "Cost-Effective Excellence",
      icon: "fa6-solid:dollar-sign",
      text: "Access top-tier engineering talent at 60-70% cost savings without compromising on quality or communication.",
    },
    {
      title: "Integrated Teams",
      icon: "fa6-solid:people-group",
      text: "Manila-based developers work alongside our senior engineers in the US, taking part in architecture decisions, code reviews, and strategic planning.",
    },
  ],
  image: {
    src: manilaOfficeWide,
    alt: "Hella Labs Manila office: a neon Philippine flag and Manila Office sign glowing above a laptop, with the city skyline at dusk through the windows",
  },
  cta: { label: "Meet the Team", href: "/team/", icon: "fa6-solid:people-group" },
};
