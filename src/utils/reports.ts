// Lighthouse reports: summary data from the `reports` collection, paired with the URL of the
// self-contained HTML report saved beside each JSON file (emitted as a static asset at build).
import { getCollection, type CollectionEntry } from "astro:content";

export type Report = CollectionEntry<"reports">;

const htmlReports = import.meta.glob<string>("/src/assets/reports/*.html", {
  query: "?url",
  import: "default",
  eager: true,
});

/** URL of the HTML report for a collection entry (same file name, `.html` extension) */
export function reportHtmlUrl(report: Report): string | undefined {
  return htmlReports[`/src/assets/reports/${report.id}.html`];
}

/** All reports, mobile first (the stricter run), then by file name */
export async function getReports(): Promise<Report[]> {
  const reports = await getCollection("reports");
  const rank = (r: Report) => (r.data.configSettings.formFactor === "mobile" ? 0 : 1);
  return reports.sort((a, b) => rank(a) - rank(b) || a.id.localeCompare(b.id));
}

/** Lighthouse 0–1 score as a 0–100 integer, or null when the category didn't apply */
export function toPercent(score: number | null): number | null {
  return score === null ? null : Math.round(score * 100);
}

/** Lighthouse's own rating bands: ≥90 good, 50–89 average, <50 poor */
export function scoreRating(percent: number | null): "good" | "average" | "poor" | "na" {
  if (percent === null) return "na";
  if (percent >= 90) return "good";
  return percent >= 50 ? "average" : "poor";
}
