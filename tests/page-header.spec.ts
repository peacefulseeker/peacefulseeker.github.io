import { test, expect } from "@playwright/test";

test.describe("Page header from frontmatter", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  // TC-03-01: Name and role render in h1/subtitle, header before body
  test('TC-03-01: h1 contains "Alexey Vorobyov" and subtitle contains "Senior Software Engineer"', async ({
    page,
  }) => {
    const h1 = page.locator("h1.resume-name");
    await expect(h1).toContainText("Alexey Vorobyov");

    const subtitle = page.locator("main header .subtitle");
    await expect(subtitle).toContainText("Senior Software Engineer");
  });

  test("TC-03-01: header element appears before the markdown body in the DOM", async ({
    page,
  }) => {
    const headerBox = await page.locator("main header").boundingBox();
    const firstBodyHeading = page.locator("main h2").first();
    const bodyBox = await firstBodyHeading.boundingBox();

    expect(headerBox).not.toBeNull();
    expect(bodyBox).not.toBeNull();
    expect(headerBox!.y).toBeLessThan(bodyBox!.y);
  });

  // TC-03-04: Bare domain → https://github.com/peacefulseeker
  test("TC-03-04: bare domain renders as https:// anchor", async ({ page }) => {
    const githubLink = page.locator(
      'a[href="https://github.com/peacefulseeker"]',
    );
    await expect(githubLink).toBeVisible();
    await expect(githubLink).toContainText("github.com/peacefulseeker");
  });

  // TC-03-05: Plain text → <span> with no href
  test("TC-03-05: location renders as span without an anchor", async ({
    page,
  }) => {
    const locationAnchor = page.locator(
      `a:has-text("Riga, Latvia"), a[href*="Riga"]`,
    );
    await expect(locationAnchor).toHaveCount(0);

    const locationSpan = page.locator(".contact span");
    await expect(locationSpan).toContainText("Riga, Latvia");
  });

  // TC-03-06: Name and role each appear exactly once on the page
  test('TC-03-06: "Alexey Vorobyov" appears exactly once on the page', async ({
    page,
  }) => {
    const matches = page.getByText("Alexey Vorobyov", { exact: true });
    await expect(matches).toHaveCount(1);
  });

  test('TC-03-06: "Senior Software Engineer" appears exactly once on the page', async ({
    page,
  }) => {
    const matches = page.getByText("Senior Software Engineer", { exact: true });
    await expect(matches).toHaveCount(1);
  });
});
