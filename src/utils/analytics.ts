// Umami analytics config + the injection flag (see ADR 0009).
//
// Umami is cookieless and anonymized, so no consent banner is needed. The
// website-id is a public identifier (it ships in the page source regardless),
// so committing it as a constant is fine — there is no secret here.
export const UMAMI_SRC = "https://cloud.umami.is/script.js";
export const UMAMI_WEBSITE_ID = "334171e2-2119-466d-a803-cc4468fed467";

// Load in production by default; set PUBLIC_UMAMI_ENABLED="true" to opt a dev server in.
export function analyticsEnabled(): boolean {
  return (
    import.meta.env.PUBLIC_UMAMI_ENABLED === "true" || import.meta.env.PROD
  );
}
