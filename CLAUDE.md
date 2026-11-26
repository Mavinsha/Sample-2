# K7 CyberSecurity — homepage design samples

Each sample is a homepage design concept for K7 Seventh Sense, built as a single
self-contained HTML file so the team can open it and compare.

## Content sources
- Homepage copy: "Enterprise Website Content – V23.0 – Home Page – 20.11.2026" (docx).
- Navigation: "Navigation menu v22.5" (docx). Platform, Solutions and Services are
  mega-menus; Partners, Resources, Why K7 and About Us are dropdowns; Support is a link.
- Use the copy exactly as written (fix obvious typos only). Testimonials, the AMTSO
  award image and the report image are placeholders until real assets arrive.

## Rules for every sample
- **No arrows on buttons** — text-only buttons, including carousel controls
  ("Previous" / "Next") and "Learn More" links.
- **Fully responsive, no empty side space on wide screens.** Content runs edge to edge
  with a fluid gutter (`--gut: clamp(16px, 4.4vw, 112px)`), never a fixed max-width
  container. Above 1760px the page scales up with `html { zoom }` steps (`--z` holds
  the factor; divide any `vh`-based heights by it). Check 390px, 1440px and 2560px,
  with no horizontal scroll at any width.
- **Interactive.** Every sample includes the shared layer in `_shared/`
  (scroll reveals, reading-progress bar, magnetic buttons, count-up stats, swipeable
  autoplay carousel) plus interactions specific to its own concept.
  Respect `prefers-reduced-motion`.
- Each sample gets a unique concept name and must not look like a generic template.
- A reference image from the user sets the **theme only** (palette, materials, mood).
  Hero visuals and imagery must express K7's own content (Seventh Sense, endpoint to
  SOC, the infrastructure it protects), not the reference's subject matter.
- Hero: H1 is "K7 Seventh Sense"; "Unified Endpoint-To-SOC Security Platform" sits
  beneath it. Keep section headings (e.g. "Beyond The Obvious") in their sections.
  Exception: Sample 03 (Ownerboard) leads with the accountability line "One
  Accountable Partner. Endpoint To SOC." at the user's request.
- Keep glow restrained: no heavy bloom, halos or neon on everything.
- Logo: use the official files in `_shared/brand/` (`k7-logo-white.svg` on dark
  backgrounds, `k7-logo.svg` on light). The footer shows the logo with the line
  "Security That Answers To You" beneath it.
- Navigation: Platform, Solutions and Services are full-width mega-menus; Partners,
  Resources, Why K7 and About Us open as full-width horizontal panels (items laid out
  side by side), not narrow vertical lists.
- Autoplay and other scripted actions must not fire synthetic clicks that close menus.
- File naming: `sample-NN-<name>/Sample NN · <Name> - Index.html`.
- Treat every page as final copy: no "placeholder", "illustrative" or "image to be
  supplied" labels, and no sample name or tag anywhere in the page (Sample 03 onward;
  the folder and file name identify the sample).
- Do not publish these pages as claude.ai artifacts (they carry K7 branding);
  deliver the HTML file.

## Build notes
- The environment's network blocks cdn.jsdelivr.net and unpkg.com but allows npm.
  Bundle libraries into the file instead of linking a CDN
  (see `sample-02-emberglass/_src/build.mjs`, which inlines three.js and Lucide icons).
