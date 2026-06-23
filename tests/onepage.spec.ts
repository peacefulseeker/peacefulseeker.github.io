import { expect, test } from "@playwright/test";

test.describe("One-page template — default resume view at /resume", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/resume");
  });

  test("renders name and role in the header", async ({ page }) => {
    await expect(page.locator("h1.resume-name")).toContainText(
      "Alexey Vorobyov",
    );
    await expect(page.locator(".resume-role")).toContainText(
      "Senior Software Engineer",
    );
  });

  test("renders the Experience section in the main column", async ({
    page,
  }) => {
    await expect(page.locator('main h2:has-text("Experience")')).toBeVisible();
  });

  test("renders sidebar blocks (Technologies, Education, Certifications)", async ({
    page,
  }) => {
    for (const heading of ["Technologies", "Education", "Certifications"]) {
      await expect(
        page.locator(`aside h2:has-text("${heading}")`),
      ).toBeVisible();
    }
  });

  test("exposes a PDF button and a toggle to the full version", async ({
    page,
  }) => {
    await expect(page.locator("button.pdf-btn")).toBeVisible();

    const toggle = page.locator("a.version-toggle");
    await expect(toggle).toContainText("Full version");
    await expect(toggle).toHaveAttribute("href", /\/resume\/full\/?$/);
  });

  test("toggle and PDF button are hidden in print", async ({ page }) => {
    await page.emulateMedia({ media: "print" });
    await expect(page.locator("button.pdf-btn")).toBeHidden();
    await expect(page.locator("a.version-toggle")).toBeHidden();
  });

  test("no horizontal scroll on a 375px viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const [scrollWidth, clientWidth] = await page.evaluate(() => [
      document.documentElement.scrollWidth,
      document.documentElement.clientWidth,
    ]);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });
});

test.describe("Cross-link — full view points back to the one-pager", () => {
  test("the /resume/full header links to the one-page view at /resume", async ({
    page,
  }) => {
    await page.goto("/resume/full");
    const toggle = page.locator("a.version-toggle");
    await expect(toggle).toContainText("One-page version");
    await expect(toggle).toHaveAttribute("href", /\/resume\/?$/);
  });
});
