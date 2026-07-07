import { expect, test } from "@playwright/test";

test.describe("Theme × density — active view renders all fields", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/resume/full");
  });

  test("renders name in h1", async ({ page }) => {
    const h1 = page.locator("h1.resume-name");
    await expect(h1).toContainText("Alexey Vorobyov");
  });

  test("renders role in the header", async ({ page }) => {
    const role = page.locator("header .resume-role");
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
    const headerBox = await page.locator("header.resume-header").boundingBox();
    const bodyBox = await page.locator("main h2").first().boundingBox();

    expect(headerBox).not.toBeNull();
    expect(bodyBox).not.toBeNull();
    expect(headerBox!.y).toBeLessThan(bodyBox!.y);
  });

  // The full route carries both axis classes: the theme (from frontmatter) and
  // the density (from the route). One stylesheet keys its rules off these, so
  // the theme's background token resolves predictably (ADR 0008).
  test("body carries the theme + density classes and the theme background", async ({
    page,
  }) => {
    const className = await page.locator("body").getAttribute("class");
    expect(className).toBe("theme-timeline density-full");

    // Timeline theme background is #f3f4f6.
    const bg = await page
      .locator("body")
      .evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg).toBe("rgb(243, 244, 246)");
  });
});

test.describe("?template= query param switching", () => {
  test("?template=classic on /resume/full overrides to theme-classic", async ({
    page,
  }) => {
    await page.goto("/resume/full?template=classic");
    const className = await page.locator("body").getAttribute("class");
    expect(className).toBe("theme-classic density-full");
  });

  test("?template=timeline on /resume/full is a no-op (already timeline)", async ({
    page,
  }) => {
    await page.goto("/resume/full?template=timeline");
    const className = await page.locator("body").getAttribute("class");
    expect(className).toBe("theme-timeline density-full");
  });

  test("?template=invalid on /resume/full leaves class unchanged", async ({
    page,
  }) => {
    await page.goto("/resume/full?template=invalid");
    const className = await page.locator("body").getAttribute("class");
    expect(className).toBe("theme-timeline density-full");
  });

  test("?template=classic on /resume sets theme-classic at onepage density", async ({
    page,
  }) => {
    await page.goto("/resume?template=classic");
    const className = await page.locator("body").getAttribute("class");
    expect(className).toBe("theme-classic density-onepage");
  });

  test("density toggle preserves ?template= in its href", async ({ page }) => {
    await page.goto("/resume/full?template=classic");
    const toggleHref = await page
      .locator(".version-toggle")
      .getAttribute("href");
    expect(toggleHref).toContain("template=classic");
  });
});
