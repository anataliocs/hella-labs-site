// Components available to every MDX entry without an import, passed via <Content components />
import BadgeRow from "@src/components/content/BadgeRow.astro";
import ButtonLink from "@src/components/content/ButtonLink.astro";
import Callout from "@src/components/content/Callout.astro";
import CheckList from "@src/components/content/CheckList.astro";
import CodePen from "@src/components/content/CodePen.astro";
import ConnectLinks from "@src/components/content/ConnectLinks.astro";
import CoverageSunburst from "@src/components/content/CoverageSunburst.astro";
import CtaSection from "@src/components/content/CtaSection.astro";
import FeatureCard from "@src/components/content/FeatureCard.astro";
import FeatureGrid from "@src/components/content/FeatureGrid.astro";
import HighlightBox from "@src/components/content/HighlightBox.astro";
import IconDivider from "@src/components/content/IconDivider.astro";
import LighthouseCta from "@src/components/content/LighthouseCta.astro";
import LinkBanner from "@src/components/content/LinkBanner.astro";
import ProjectCards from "@src/components/projects/ProjectCards.astro";

export const mdxComponents = {
  BadgeRow,
  ButtonLink,
  Callout,
  CheckList,
  CodePen,
  ConnectLinks,
  CoverageSunburst,
  CtaSection,
  FeatureCard,
  FeatureGrid,
  HighlightBox,
  IconDivider,
  LighthouseCta,
  LinkBanner,
  ProjectCards,
};
