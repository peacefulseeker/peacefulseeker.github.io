import { test, expect } from "@playwright/test";

const VIEWPORTS = [
  { width: 375, height: 812, label: "375px" },
  { width: 393, height: 851, label: "393px" },
];

for (const vp of VIEWPORTS) {
  test.describe(`Mobile layout — ${vp.label}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test.beforeEach(async ({ page }) => {
      await page.goto("/full");
    });

    test("no horizontal scrollbar", async ({ page }) => {
      const [scrollWidth, clientWidth] = await page.evaluate(() => [
        document.documentElement.scrollWidth,
        document.documentElement.clientWidth,
      ]);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    });

    test("body text font-size is at least 16px", async ({ page }) => {
      const fontSize = await page.evaluate(() =>
        parseFloat(window.getComputedStyle(document.body).fontSize),
      );
      expect(fontSize).toBeGreaterThanOrEqual(16);
    });

    test("no element extends beyond viewport width", async ({ page }) => {
      const exceeds = await page.evaluate((vpWidth) => {
        return Array.from(document.querySelectorAll("*")).some(
          (el) => el.getBoundingClientRect().right > vpWidth + 1,
        );
      }, vp.width);
      expect(exceeds).toBe(false);
    });

    test("contact items do not overlap", async ({ page }) => {
      const items = page.locator(".contact-links > *");
      const count = await items.count();
      const boxes = await Promise.all(
        Array.from({ length: count }, (_, i) => items.nth(i).boundingBox()),
      );

      for (let i = 0; i < boxes.length - 1; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
          const a = boxes[i];
          const b = boxes[j];
          if (!a || !b) continue;
          const xOverlap = a.x < b.x + b.width && a.x + a.width > b.x;
          const yOverlap = a.y < b.y + b.height && a.y + a.height > b.y;
          expect(
            xOverlap && yOverlap,
            `contact item ${i} and ${j} overlap`,
          ).toBe(false);
        }
      }
    });
  });
}
