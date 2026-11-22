// Contact form validation rules, shared by the Worker (worker/index.ts, the source of truth) and
// the form's client-side checks (src/components/contact/ContactForm.astro) so the two can't drift.
// Keep this module free of Worker and DOM APIs.

export const CONTACT_LIMITS = {
  name: 200,
  email: 254,
  inquiry: 100,
  message: 5000,
  /** Shortest message worth sending; filters out "hi" and keyboard mashing */
  messageMin: 20,
  /** Most service checkboxes accepted (there are only a handful; this just caps abuse) */
  services: 20,
} as const;

/** Inquiry types that show the service-offering checkboxes; services are ignored for the rest */
export const SERVICE_INQUIRY_TYPES: readonly string[] = [
  "Consulting",
  "Fractional Engineering",
  "Questions",
];

/** Unanchored, so it also works as an HTML `pattern` attribute (which anchors implicitly) */
export const EMAIL_PATTERN = "[^\\s@<>]+@[^\\s@<>]+\\.[^\\s@<>]+";
export const EMAIL_RE = new RegExp(`^${EMAIL_PATTERN}$`);
