// Gradients for blog topic pills: the brand pink/purple, primary and secondary, plus the sunset
// skyline palette (amber sun, coral sky, violet clouds, indigo night). Every stop keeps white
// text at WCAG AA (≥ 4.5:1), which is why the deeper dark-mode pink (#d60067) and
// `secondary-strong` (#10808a) stand in for the lighter brand values.
export interface TagGradient {
  from: string;
  to: string;
}

export const tagGradients: TagGradient[] = [
  { from: "#d60067", to: "#8311c0" }, // neon: header pink → purple
  { from: "#ae00ee", to: "#4643ec" }, // primary purple → dusk indigo
  { from: "#c2410c", to: "#be185d" }, // sunset orange → rose
  { from: "#10808a", to: "#4338ca" }, // secondary cyan → indigo (code screen)
  { from: "#b45309", to: "#db2777" }, // golden hour → pink sky
  { from: "#7c3aed", to: "#db2777" }, // violet clouds → pink
  { from: "#5b21b6", to: "#1d4ed8" }, // night skyline: violet → blue
  { from: "#e11d48", to: "#a21caf" }, // coral → magenta
  { from: "#10808a", to: "#8311c0" }, // secondary cyan → brand purple
];
