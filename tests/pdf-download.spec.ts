import { expect, test } from "@playwright/test";

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

  test("links keep their on-screen treatment (colour, no underline) in print media", async ({
    page,
  }) => {
    // Theme-agnostic invariant: links render the same accent colour in print as
    // on screen (not ink-black) and stay un-underlined — regardless of which
    // theme is active. ?template= can make any theme active (ADR 0010), and each
    // theme has its own accent, so we compare screen↔print rather than hardcode
    // a single colour.
    const link = page.locator(".header-contact a").first();
    const screenColor = await link.evaluate(
      (el) => getComputedStyle(el).color,
    );

    await page.emulateMedia({ media: "print" });
    await expect(link).toHaveCSS("color", screenColor);
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
