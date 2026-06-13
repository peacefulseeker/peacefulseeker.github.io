/**
 * Returns the appropriate href scheme for a contact field value, or null for
 * entries that should render as plain text (no link).
 *
 * Input: a raw string from the `contact[].value` frontmatter field.
 *
 * Cases handled:
 * - Social handle (`@janedoe`): → null (rejected before email check)
 * - Email (`user@example.com`, contains `@`, no `://`): → `mailto:user@example.com`
 * - Full URL (`https://…` or `http://…`): → unchanged
 * - Bare domain (`github.com/janedoe`): → `https://github.com/janedoe`
 * - Everything else (phone number, location, plain text): → null
 */
const BARE_DOMAIN_RE = /^[a-z0-9-]+\.[a-z]{2,}/i;

export function contactHref(value: string): string | null {
  if (value.startsWith("@")) return null;
  if (value.includes("@") && !value.includes("://")) return `mailto:${value}`;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (BARE_DOMAIN_RE.test(value)) return `https://${value}`;
  return null;
}
