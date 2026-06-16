import { test, expect } from "@playwright/test";

test.describe("PDF download via browser print", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/full");
  });

  test("Download PDF button is a visible semantic button", async ({ page }) => {
    const btn = page.locator("button.pdf-btn");
    await expect(btn).toBeVisible();
    await expect(btn).toHaveAttribute("type", "button");
    await expect(btn).toContainText("PDF");
  });

  test("clicking the button calls window.print()", async ({ page }) => {
    await page.evaluate(() => {
      (window as unknown as Record<string, boolean>).__printCalled = false;
      window.print = () => {
        (window as unknown as Record<string, boolean>).__printCalled = true;
      };
    });

    await page.locator("button.pdf-btn").click();

    const called = await page.evaluate(
      () => (window as unknown as Record<string, boolean>).__printCalled,
    );
    expect(called).toBe(true);
  });

  test("button is hidden in print media", async ({ page }) => {
    await page.emulateMedia({ media: "print" });
    const btn = page.locator("button.pdf-btn");
    await expect(btn).toBeHidden();
  });

  test("links are underlined in print media", async ({ page }) => {
    await page.emulateMedia({ media: "print" });
    const link = page.locator("main a:not(.version-toggle)").first();
    await expect(link).toHaveCSS("text-decoration-line", "underline");
  });

  test("list items have break-inside avoid in print media", async ({
    page,
  }) => {
    await page.emulateMedia({ media: "print" });
    const li = page.locator("main li").first();
    await expect(li).toHaveCSS("break-inside", "avoid");
  });
});
