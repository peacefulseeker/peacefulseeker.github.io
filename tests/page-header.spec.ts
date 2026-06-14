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

    const role = page.locator("header .subtitle");
    await expect(role).toContainText("Senior Software Engineer");
  });

  test("TC-03-01: header element appears before the markdown body in the DOM", async ({
    page,
  }) => {
    const headerBox = await page.locator("header.resume-header-bar").boundingBox();
    const firstBodyHeading = page.locator("main h2").first();
    const bodyBox = await firstBodyHeading.boundingBox();

    expect(headerBox).not.toBeNull();
    expect(bodyBox).not.toBeNull();
    expect(headerBox!.y).toBeLessThan(bodyBox!.y);
  });

  // TC-03-05: Location does not render as an anchor in the classic header
  test("TC-03-05: location does not render as an anchor", async ({ page }) => {
    const locationAnchor = page.locator(
      `a:has-text("Remote / Latvia"), a[href*="Latvia"]`,
    );
    await expect(locationAnchor).toHaveCount(0);
  });

  // TC-03-06: Name and role each appear in the header
  test('TC-03-06: "Alexey Vorobyov" appears exactly once on the page', async ({
    page,
  }) => {
    const matches = page.getByText("Alexey Vorobyov", { exact: true });
    await expect(matches).toHaveCount(1);
  });

  test('TC-03-06: "Senior Software Engineer" appears in header subtitle', async ({
    page,
  }) => {
    const headerRole = page.locator("header .subtitle");
    await expect(headerRole).toContainText("Senior Software Engineer");
    await expect(headerRole).toHaveCount(1);
  });
});
