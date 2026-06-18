import { test, expect } from "@playwright/test";

test.describe("Landing page — root status board at /", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders the name and role", async ({ page }) => {
    await expect(page.locator("h1.landing-name")).toContainText(
      "Alexey Vorobyov",
    );
    await expect(page.locator(".landing-role")).toContainText(
      "Senior Software Engineer",
    );
  });

  test("exposes a CV call-to-action pointing at the resume", async ({
    page,
  }) => {
    const cta = page.locator("a.landing-cta");
    await expect(cta).toContainText("View CV");
    await expect(cta).toHaveAttribute("href", /\/resume\/?$/);
  });

  test("CTA navigates to the one-page resume", async ({ page }) => {
    await page.locator("a.landing-cta").click();
    await expect(page.locator("h1.op-name")).toContainText("Alexey Vorobyov");
  });

  test("shows status rows with a unified dot indicator", async ({ page }) => {
    await expect(page.locator(".landing-val")).toHaveCount(4);
    // Every row carries exactly one status dot — one consistent mark.
    await expect(page.locator(".landing-val .dot")).toHaveCount(4);
  });
});
