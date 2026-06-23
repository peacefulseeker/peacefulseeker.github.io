import { expect, test } from "@playwright/test";

// One-page fill gauge / CI gate
//
// Renders the one-pager to A4 under print CSS via Chromium's own paginator
// (page.pdf) and fails if the content spills past a single page. This is the
// "automated single-page assertion" anticipated by ADR 0005. Run on demand
// with `pnpm onepage:fit`; it also runs as part of `pnpm test:integration`.

// A4 content box at 96dpi (CSS defines 96px = 1in = 25.4mm exactly, so this is
// not an approximation), inside the 10mm @page margin declared in
// src/styles/page-onepage.css (@page { margin: 10mm }). These constants drive (a) the
// PDF margin, (b) the viewport width we measure at, so the DOM wraps exactly like
// the printed page, and (c) the advisory fill-% gauge. If that @page margin
// changes, update PAGE_MARGIN_MM to match.
const PAGE_MARGIN_MM = 10;
const PX_PER_MM = 96 / 25.4;
const A4_CONTENT_WIDTH_PX = Math.round((210 - 2 * PAGE_MARGIN_MM) * PX_PER_MM); // ~718
const A4_CONTENT_HEIGHT_PX = Math.round((297 - 2 * PAGE_MARGIN_MM) * PX_PER_MM); // ~1047

/**
 * Count pages in a Chromium-generated PDF buffer.
 *
 * Chromium emits the page tree uncompressed, so each page leaf appears as a
 * `/Type /Page` dictionary in the latin1-decoded bytes (content streams are
 * Flate-compressed, but the page dictionaries are not). We count page leaves
 * (`/Type /Page` not followed by another letter, to exclude the `/Type /Pages`
 * tree root). This is more robust than scraping `/Count`, which appears on
 * every intermediate page-tree node, not just the root.
 */
function countPdfPages(pdf: Buffer): number {
  const bytes = pdf.toString("latin1");
  const matches = bytes.match(/\/Type\s*\/Page(?![a-zA-Z])/g);
  return matches ? matches.length : 0;
}

test.describe("One-page fill gauge", () => {
  test("the one-pager fits a single A4 page in print", async ({ page }) => {
    // Measure at the A4 content width so the DOM wraps exactly like the printed
    // page — at a wider viewport the column is shorter and the gauge understates
    // fill. Height is irrelevant to scrollHeight, which reports full content.
    await page.setViewportSize({
      width: A4_CONTENT_WIDTH_PX,
      height: A4_CONTENT_HEIGHT_PX,
    });
    await page.goto("/resume");
    await page.emulateMedia({ media: "print" });

    // A4 paper (Chromium would otherwise default to US Letter, which is shorter
    // and would falsely fail fitting content). Margin mirrors the @page rule in
    // page-onepage.css so the PDF matches the browser print-dialog flow (ADR 0003).
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: `${PAGE_MARGIN_MM}mm`,
        right: `${PAGE_MARGIN_MM}mm`,
        bottom: `${PAGE_MARGIN_MM}mm`,
        left: `${PAGE_MARGIN_MM}mm`,
      },
    });

    const pages = countPdfPages(pdf);
    const scrollHeight = await page.evaluate(
      () => document.documentElement.scrollHeight,
    );
    const fillPct = Math.round((scrollHeight / A4_CONTENT_HEIGHT_PX) * 100);

    // Author-facing gauge (visible via `pnpm onepage:fit`).
    console.log(
      `page used: ${fillPct}% · ${
        pages === 1 ? "fits 1 page" : `OVERFLOWS to ${pages} pages`
      }`,
    );

    expect(
      pages,
      "one-pager spilled past a single A4 page — trim it via onepage_highlights_num / onepage_include / summary_short in src/content/resumes/alexey-vorobyov.md",
    ).toBe(1);
  });
});
