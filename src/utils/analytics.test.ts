import { afterEach, describe, expect, test, vi } from "vitest";

import { analyticsEnabled } from "@utils/analytics";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("analyticsEnabled", () => {
  test("returns true when PUBLIC_UMAMI_ENABLED is 'true'", () => {
    vi.stubEnv("PUBLIC_UMAMI_ENABLED", "true");
    expect(analyticsEnabled()).toBe(true);
  });

  test("returns false in non-production when flag is not set", () => {
    // import.meta.env.PROD is false by default in test/dev mode
    expect(analyticsEnabled()).toBe(false);
  });

  test("returns false in non-production when flag is set to any other value", () => {
    vi.stubEnv("PUBLIC_UMAMI_ENABLED", "false");
    expect(analyticsEnabled()).toBe(false);
  });

  test("returns true in production builds when flag is not set", () => {
    vi.stubEnv("PROD", true);
    expect(analyticsEnabled()).toBe(true);
  });
});
