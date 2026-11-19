// Minimal inline Markdown for short frontmatter strings: escapes HTML, then **bold** → <strong>
export function renderInline(text: string): string {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
  return escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

// "Smart Contracts" → "smart-contracts", "CSS-tricks" → "css-tricks". Browser-safe (used by the
// /tags/?tag= legacy redirect).
export function tagSlug(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
