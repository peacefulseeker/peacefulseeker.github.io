import { test, expect } from "@playwright/test";

test.describe("PDF download via browser print", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/resume/full");
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

  test("links stay blue and un-underlined in print media", async ({ page }) => {
    await page.emulateMedia({ media: "print" });
    // Links keep their on-screen treatment in print (blue, no text underline)
    // rather than switching to ink-black underlined text.
    const link = page.locator(".header-contact a").first();
    await expect(link).toHaveCSS("color", "rgb(37, 99, 235)");
    await expect(link).toHaveCSS("text-decoration-line", "none");
  });

  test("list items have break-inside avoid in print media", async ({
    page,
  }) => {
    await page.emulateMedia({ media: "print" });
    const li = page.locator("main li").first();
    await expect(li).toHaveCSS("break-inside", "avoid");
  });
});
