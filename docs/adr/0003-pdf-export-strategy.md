# 0003. Use the browser's native print dialog for PDF export

**Status:** Accepted
**Date:** 2026-05-29

## Context

The resume page must offer a downloadable PDF. The site is fully static with no server endpoints and no runtime dependencies. The PDF must fit on a single page with readable typography and hide on-screen chrome. Print fidelity is baselined against Chrome; other browsers may differ.

## Decision

A visible "Download PDF" button on the resume page invokes the browser's print dialog (e.g. `window.print()`); the user saves as PDF from that dialog. Print CSS hides the button and any nav chrome, adjusts margins, and lays the resume out on a single page. **No** client-side PDF library and **no** server-side renderer.

## Alternatives considered

**Client-side PDF libraries (jsPDF, html2pdf, pdf-lib).** Render the page to canvas or rebuild it via a synthetic layout engine, then serialize to PDF in JavaScript. Adds a sizable runtime bundle, frequently mishandles web fonts and CSS features (flex/grid quirks, page-break control, embedded SVG), and duplicates work the browser's print engine already does correctly. DOM-snapshot approaches (html2canvas-based) produce output consistently worse than the browser print dialog. Document-model libraries (e.g. `react-pdf`) can produce high-quality vector output but require rebuilding the layout in a separate abstraction — maintaining two layout implementations (one for web, one for PDF) for no clear benefit over print CSS.

**Build-time PDF generation (headless Chromium at build time).** Run Puppeteer or Playwright during `pnpm build`, navigate to the rendered HTML, print to PDF, and drop the file into `dist/` as a static asset — the download button becomes a plain `<a href="resume.pdf" download>` link. Technically viable: it does not violate the "no server endpoints" constraint, produces pixel-identical output in a controlled environment, and gives users a one-click download. Rejected because: it adds a disproportionate build dependency (~300 MB Chromium binary), couples the build to a specific browser version, and increases build time. The UX gain (one click vs. two) is marginal for an engineer audience already comfortable with browser dialogs.

**Server-side renderer (Puppeteer / Playwright / WeasyPrint).** Produces the most faithful PDF but requires a server runtime to host the headless browser. That directly contradicts the PRD's Constraints — no server endpoints, no backend infrastructure — and bringing in such a service would dwarf the rest of the project's footprint.

## Consequences

- **Positive:** Zero added runtime dependencies; the PDF is rendered by the same engine that drew the screen, so the rendering pipeline is known and testable — there is no secondary layout engine to debug; the user controls margins, headers/footers, and paper size via the OS print dialog they already know.
- **Negative:** Output varies across browsers — Chrome is the baseline; Firefox/Safari/Edge differences are accepted; the UX is a two-step dialog rather than a one-click download.
- **Neutral:** Print CSS becomes a first-class concern of the templates — `@media print` styles must be maintained and manually verified alongside screen styles for every template. With two templates this means four rendering contexts to validate on every layout change (two screen, two print); the cost scales linearly with template count.

## Revisit if

- Pixel-identical PDF output across browsers becomes a hard requirement.
- The site needs programmatic PDF generation (e.g. bulk export of every resume, scheduled emailing, automated archival, or build-time pre-rendering).
- User testing shows the print-dialog flow is a meaningful friction point for the engineer audience.
