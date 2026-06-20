import { test, expect } from "@playwright/test";

test.describe("Template switching — active template renders all fields", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/resume/full");
  });

  test("renders name in h1", async ({ page }) => {
    const h1 = page.locator("h1.resume-name");
    await expect(h1).toContainText("Alexey Vorobyov");
  });

  test("renders role in subtitle", async ({ page }) => {
    const role = page.locator("header .subtitle");
    await expect(role).toContainText("Senior Software Engineer");
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
    const headerBox = await page
      .locator("header.resume-header-bar")
      .boundingBox();
    const bodyBox = await page.locator("main h2").first().boundingBox();

    expect(headerBox).not.toBeNull();
    expect(bodyBox).not.toBeNull();
    expect(headerBox!.y).toBeLessThan(bodyBox!.y);
  });

  // Regression guard: classic + timeline CSS both bundle onto /resume/full, so
  // each template scopes its rules under a single body.tpl-<name> root class.
  // If a template's styles ever leak back to a bare `body` selector, the two
  // background rules collide and one clobbers the other (the original bug).
  test("only the active template's body styles apply (no cross-template leak)", async ({
    page,
  }) => {
    const className = await page.locator("body").getAttribute("class");
    expect(className).toBe("tpl-classic");

    // Classic's background is #f5f5f0; timeline's #f3f4f6 must not win.
    const bg = await page
      .locator("body")
      .evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg).toBe("rgb(245, 245, 240)");
  });
});
