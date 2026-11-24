// Converts an MDX blog post (src/content/blog/*.mdx) into portable Markdown for cross-posting
// (Dev.to, Hashnode, Medium import, GitHub, …). Used by scripts/mdx-to-md.ts.
//
// - Frontmatter is reduced to the fields other platforms understand (title, description, date,
//   tags, canonical_url, cover_image).
// - The site's MDX components become plain Markdown (see `components` below); unknown components
//   are unwrapped to their children and reported in `warnings`.
// - Simple lowercase JSX (<p>, <strong>, <em>, <a href>, <br>) becomes Markdown; other raw HTML
//   (<div>, <figure>, …) is kept as HTML, with className → class.
// - import/export statements are dropped. String-literal {expressions} like {" "} become their
//   text; any other {expression} is dropped and reported.
// - Root-relative links and images (/contact/, /images/x.gif) become absolute URLs on `siteUrl`.
//
// Imports use relative paths (no @src alias) so the CLI can run it directly with Node.
import type {
  BlockContent,
  Heading,
  Link,
  Paragraph,
  PhrasingContent,
  Root,
  RootContent,
} from "mdast";
import type { MdxJsxFlowElement, MdxJsxTextElement } from "mdast-util-mdx";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { unified } from "unified";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";

export interface ConvertOptions {
  // Post slug; the canonical URL is `${siteUrl}/${slug}/` (posts are served at the site root)
  slug: string;
  // Absolute site origin, e.g. "https://www.hellalabs.dev" (no trailing slash needed)
  siteUrl: string;
  // Absolute URL of the cover image. The frontmatter `image` is a src/assets path whose built URL
  // is hashed, so the caller resolves it (e.g. from the built page's og:image).
  coverImage?: string;
}

export interface ConvertResult {
  markdown: string;
  // Things that couldn't be converted cleanly and should be checked by hand
  warnings: string[];
}

type JsxElement = MdxJsxFlowElement | MdxJsxTextElement;
type Node = Root | RootContent;

interface Context {
  source: string;
  siteUrl: string;
  warnings: string[];
}

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

const calloutLabels: Record<string, string> = {
  note: "Note",
  tip: "Tip",
  important: "Important",
  warning: "Warning",
  caution: "Caution",
};

export async function convertMdxToMarkdown(
  source: string,
  options: ConvertOptions,
): Promise<ConvertResult> {
  const siteUrl = options.siteUrl.replace(/\/+$/, "");
  const match = FRONTMATTER.exec(source);
  const data: Record<string, unknown> = match ? (parseYaml(match[1]) ?? {}) : {};
  const body = match ? source.slice(match[0].length) : source;
  const ctx: Context = { source: body, siteUrl, warnings: [] };

  const processor = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(remarkGfm)
    .use(remarkStringify, { bullet: "-", rule: "-", fences: true });

  const tree = processor.parse(body);
  transformChildren(tree, ctx);
  absolutizeUrls(tree, ctx);
  const markdown = processor.stringify(tree);

  const frontmatter = buildFrontmatter(data, options, siteUrl);
  return {
    markdown: `---\n${stringifyYaml(frontmatter, { lineWidth: 0 })}---\n\n${markdown}`,
    warnings: ctx.warnings,
  };
}

function buildFrontmatter(
  data: Record<string, unknown>,
  options: ConvertOptions,
  siteUrl: string,
): Record<string, unknown> {
  const frontmatter: Record<string, unknown> = {
    title: data.title,
    description: data.description,
    date: data.date,
    tags: Array.isArray(data.tags) ? data.tags : [],
    canonical_url: `${siteUrl}/${options.slug}/`,
  };
  if (options.coverImage) frontmatter.cover_image = options.coverImage;
  // YAML can't serialize undefined; drop missing fields
  return Object.fromEntries(Object.entries(frontmatter).filter(([, v]) => v !== undefined));
}

// ---------------------------------------------------------------------------------------------
// MDX → Markdown node transforms
// ---------------------------------------------------------------------------------------------

function transformChildren(parent: Node, ctx: Context): void {
  if (!("children" in parent)) return;
  const next: RootContent[] = [];
  for (const child of parent.children as RootContent[]) {
    next.push(...transformNode(child, ctx));
  }
  (parent as { children: RootContent[] }).children = next;
}

function transformNode(node: RootContent, ctx: Context): RootContent[] {
  switch (node.type) {
    case "mdxjsEsm":
      return [];
    case "mdxFlowExpression":
    case "mdxTextExpression": {
      const literal = stringLiteral(node.value);
      if (literal !== undefined && node.type === "mdxTextExpression") return [text(literal)];
      if (!/^\s*\/\*[\s\S]*\*\/\s*$/.test(node.value)) {
        ctx.warnings.push(`Dropped JS expression {${node.value.trim().slice(0, 60)}}`);
      }
      return [];
    }
    case "mdxJsxFlowElement":
    case "mdxJsxTextElement":
      return transformJsx(node, ctx);
    default:
      transformChildren(node, ctx);
      return [node];
  }
}

function transformJsx(node: JsxElement, ctx: Context): RootContent[] {
  const name = node.name ?? "";
  // Fragments (<>…</>) and unknown components: keep the content, drop the wrapper
  if (!name) return unwrap(node, ctx);
  if (/^[a-z]/.test(name)) return htmlElement(node, ctx);

  const component = components[name];
  if (component) return component(node, ctx);

  ctx.warnings.push(`Unknown component <${name}> was unwrapped to its children`);
  return unwrap(node, ctx);
}

type ComponentConverter = (node: JsxElement, ctx: Context) => RootContent[];

// One entry per component in src/components/content/index.ts that blog posts use
const components: Record<string, ComponentConverter> = {
  // > **Tip:** text
  Callout(node, ctx) {
    const type = stringAttr(node, "type") ?? "note";
    const label = calloutLabels[type] ?? "Note";
    const children = transformedChildren(node, ctx) as BlockContent[];
    const strong: PhrasingContent = {
      type: "strong",
      children: [{ type: "text", value: `${label}:` }],
    };
    const first = children[0];
    if (first?.type === "paragraph") {
      first.children.unshift(strong, { type: "text", value: " " });
    } else {
      children.unshift({ type: "paragraph", children: [strong] });
    }
    return [{ type: "blockquote", children }];
  },

  // Plain list; the green check bullets are styling only
  CheckList: unwrap,
  FeatureGrid: unwrap,

  CodePen(node, ctx) {
    const slug = stringAttr(node, "slug");
    if (!slug) {
      ctx.warnings.push("<CodePen> without a slug was dropped");
      return [];
    }
    const user = stringAttr(node, "user") ?? "anataliocs";
    const title = stringAttr(node, "title") ?? "CodePen demo";
    const href = `https://codepen.io/${user}/pen/${slug}`;
    return [paragraph([text("▶️ "), link(href, `${title} on CodePen`)])];
  },

  IconDivider: () => [{ type: "thematicBreak" }],

  // ### Title, then the card text and its optional CTA link
  FeatureCard(node, ctx) {
    const title = stringAttr(node, "title") ?? "";
    const cta = objectAttr(node, "cta");
    const out: RootContent[] = [
      heading(headingDepth(node, 3), title),
      ...transformedChildren(node, ctx),
    ];
    if (cta.label && cta.href) out.push(paragraph([link(cta.href, cta.label)]));
    return out;
  },

  // ### Title, the slot paragraphs, then the button (and secondary link) as bold links
  CtaSection(node, ctx) {
    const title = stringAttr(node, "title") ?? "";
    const button = objectAttr(node, "button");
    const secondary = objectAttr(node, "link");
    const out: RootContent[] = [
      heading(headingDepth(node, 3), title),
      ...transformedChildren(node, ctx),
    ];
    if (button.label && button.href) {
      out.push(paragraph([{ type: "strong", children: [link(button.href, `${button.label} →`)] }]));
    }
    if (secondary.label && secondary.href)
      out.push(paragraph([link(secondary.href, secondary.label)]));
    return out;
  },
};

function unwrap(node: JsxElement, ctx: Context): RootContent[] {
  return transformedChildren(node, ctx);
}

function transformedChildren(node: JsxElement, ctx: Context): RootContent[] {
  return (node.children as RootContent[]).flatMap((child) => transformNode(child, ctx));
}

// Lowercase JSX: simple text elements map to Markdown, anything else stays HTML
function htmlElement(node: JsxElement, ctx: Context): RootContent[] {
  const children = () => transformedChildren(node, ctx) as PhrasingContent[];
  switch (node.name) {
    case "p":
    case "span":
      // MDX already parsed the content as paragraphs / phrasing
      return transformedChildren(node, ctx).map((child) => {
        if (child.type === "paragraph") child.children = collapseJsxWhitespace(child.children);
        return child;
      });
    case "strong":
    case "b":
      return [{ type: "strong", children: children() }];
    case "em":
    case "i":
      return [{ type: "emphasis", children: children() }];
    case "br":
      return [{ type: "break" }];
    case "a": {
      const href = stringAttr(node, "href");
      if (href) return [{ type: "link", url: href, children: children() }];
      return transformedChildren(node, ctx);
    }
    default:
      return [rawHtml(node, ctx)];
  }
}

// Text indented inside JSX (<p>\n  We ship{" "}\n  <strong>…) follows JSX whitespace rules: line
// breaks and their indentation collapse to a single space, and the ends are trimmed.
function collapseJsxWhitespace(nodes: PhrasingContent[]): PhrasingContent[] {
  const merged: PhrasingContent[] = [];
  for (const node of nodes) {
    const last = merged.at(-1);
    if (node.type === "text" && last?.type === "text") last.value += node.value;
    else merged.push(node);
  }
  merged.forEach((node, i) => {
    if (node.type !== "text") return;
    node.value = node.value.replace(/\s*\n\s*/g, " ");
    if (i === 0) node.value = node.value.trimStart();
    if (i === merged.length - 1) node.value = node.value.trimEnd();
  });
  return merged.filter((node) => node.type !== "text" || node.value !== "");
}

// Keeps a JSX element as the HTML it was written as
function rawHtml(node: JsxElement, ctx: Context): RootContent {
  const start = node.position?.start.offset;
  const end = node.position?.end.offset;
  const raw = (start !== undefined && end !== undefined ? ctx.source.slice(start, end) : "")
    .replace(/\{\s*(["'`])(.*?)\1\s*\}/g, "$2")
    .replace(/\bclassName=/g, "class=");
  if (raw.includes("{")) {
    ctx.warnings.push(`<${node.name}> contains a JSX {expression}; check the HTML output by hand`);
  }
  return { type: "html", value: raw };
}

// ---------------------------------------------------------------------------------------------
// JSX attribute helpers
// ---------------------------------------------------------------------------------------------

// "text" / 'text' / `text` → text; anything else → undefined
function stringLiteral(expression: string): string | undefined {
  return /^\s*(["'`])(.*)\1\s*$/s.exec(expression)?.[2];
}

function stringAttr(node: JsxElement, name: string): string | undefined {
  for (const attr of node.attributes) {
    if (attr.type === "mdxJsxAttribute" && attr.name === name) {
      if (typeof attr.value === "string") return attr.value;
      // {"value"} or {'value'}
      if (attr.value) return stringLiteral(attr.value.value);
    }
  }
  return undefined;
}

// Reads string fields of an object-literal attribute, e.g. button={{ label: "Go", href: "/x/" }}
function objectAttr(node: JsxElement, name: string): Record<string, string> {
  const attr = node.attributes.find((a) => a.type === "mdxJsxAttribute" && a.name === name);
  if (!attr || attr.type !== "mdxJsxAttribute" || !attr.value || typeof attr.value === "string") {
    return {};
  }
  const fields: Record<string, string> = {};
  for (const [, key, , value] of attr.value.value.matchAll(/(\w+)\s*:\s*(["'`])(.*?)\2/g)) {
    fields[key] = value;
  }
  return fields;
}

function headingDepth(node: JsxElement, fallback: Heading["depth"]): Heading["depth"] {
  const as = /^h([1-6])$/.exec(stringAttr(node, "as") ?? "");
  return as ? (Number(as[1]) as Heading["depth"]) : fallback;
}

// ---------------------------------------------------------------------------------------------
// mdast builders + URL rewriting
// ---------------------------------------------------------------------------------------------

function text(value: string): PhrasingContent {
  return { type: "text", value };
}

function link(url: string, label: string): Link {
  return { type: "link", url, children: [text(label)] };
}

function paragraph(children: PhrasingContent[]): Paragraph {
  return { type: "paragraph", children };
}

function heading(depth: Heading["depth"], value: string): Heading {
  return { type: "heading", depth, children: [text(value)] };
}

function absolute(url: string, siteUrl: string): string {
  return url.startsWith("/") && !url.startsWith("//") ? `${siteUrl}${url}` : url;
}

function absolutizeUrls(node: Node, ctx: Context): void {
  if (node.type === "link" || node.type === "image" || node.type === "definition") {
    node.url = absolute(node.url, ctx.siteUrl);
    if (node.type === "image" && /^\.{1,2}\//.test(node.url)) {
      ctx.warnings.push(`Relative image path ${node.url} has no public URL; upload it by hand`);
    }
  } else if (node.type === "html") {
    node.value = node.value.replace(
      /\b(href|src)=(["'])(\/(?!\/)[^"']*)\2/g,
      (_, attr: string, quote: string, path: string) =>
        `${attr}=${quote}${ctx.siteUrl}${path}${quote}`,
    );
  }
  if ("children" in node) {
    for (const child of node.children as RootContent[]) absolutizeUrls(child, ctx);
  }
}
