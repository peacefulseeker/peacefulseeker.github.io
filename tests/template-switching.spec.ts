import { test, expect } from "@playwright/test";

test.describe("Template switching — active template renders all fields", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders name in h1", async ({ page }) => {
    const h1 = page.locator("h1.resume-name");
    await expect(h1).toContainText("Alexey Vorobyov");
  });

  test("renders role in subtitle", async ({ page }) => {
    const subtitle = page.locator("main header .subtitle");
    await expect(subtitle).toContainText("Senior Software Engineer");
  });

  test("renders contact links", async ({ page }) => {
    const contact = page.locator(".contact");
    await expect(contact).toBeVisible();

    const githubLink = page.locator(
      'a[href="https://github.com/peacefulseeker"]',
    );
    await expect(githubLink).toBeVisible();

    const locationSpan = page.locator(".contact span");
    await expect(locationSpan).toContainText("Riga, Latvia");
  });

  test("renders all body sections (Summary, Experience, Education)", async ({
    page,
  }) => {
    for (const heading of ["Summary", "Experience", "Education"]) {
      const section = page.locator(`h2:has-text("${heading}")`);
      await expect(section).toBeVisible();
    }
  });

  test("body content appears after header", async ({ page }) => {
    const headerBox = await page.locator("main header").boundingBox();
    const bodyBox = await page.locator("main h2").first().boundingBox();

    expect(headerBox).not.toBeNull();
    expect(bodyBox).not.toBeNull();
    expect(headerBox!.y).toBeLessThan(bodyBox!.y);
  });
});
