# SURGE accessibility audit and remaining manual checks

**Date:** 27 September 2026 (UTC)
**Target:** local candidate and deployed `https://www.surgecharging.com/` release `e49af87`
**Automated engine:** axe-core 4.11.1 via Kombai browser
**Scope:** homepage, contact and current policy routes; keyboard, responsive, consent, gallery, map and theme interactions. This is not a certification or a substitute for assistive-technology and real browser-zoom testing.

## Summary

- User-attached homepage result at 390 × 844 reported zero axe violations.
- Fresh local snapshots reported **zero axe violations** on the homepage in light and dark themes at 390 × 844, contact at 390 × 844, and Privacy, Terms, Cookie and Refund/Cancellation routes at 659 × 714.
- At the tested page widths (320, 390, 768, 1050 and 1440 CSS px), document scroll width did not exceed the client width.
- Actual speech output with a screen reader and true 200%/400% browser zoom have **not** been tested. An accessibility-tree inspection or a narrow viewport alone does not count as either test.

## Verified local findings

### Theme and visual state

- `site-theme.js` now uses `surge-theme-v2` and defaults to `light`, regardless of an older `surge-theme=dark` value or the operating system’s dark preference.
- On a no-v2-preference reload the root theme was `light`, body background `rgb(255, 255, 255)`, and theme-color meta content `#FFFFFF`.
- The visible toggle still switches to dark, updates its accessible state/name, persists `dark` across reload, and likewise persists a return to light. Light mode renders across the homepage, contact and policy pages.
- The local homepage was reviewed at desktop and mobile sizes. The 320 px CSS viewport fix keeps the document from horizontal overflow; the gallery retains its own horizontal scrolling area.

### Interaction and form states

- Mobile menu activation set `aria-expanded=true`; Escape closed it, set the value false and returned focus to the menu toggle.
- Gallery ArrowRight moved the settled status from illustration 1 through 2 to 3, next became disabled on slide 3, and previous returned to slide 2. All three image resources loaded in one review pass.
- The map frame count was zero before activation and one after choosing “Load interactive Google Map”.
- With consent cleared, the consent banner appeared and no analytics script/`gtag` was present before choice. “Necessary only” stored the necessary choice and left analytics unloaded; privacy settings could be reopened.
- Empty contact-form submission remained invalid, focused `#contact-name`, and presented the existing live validation message. No email draft was opened or sent.
- Reduced-motion emulation reported the preference and prevented the homepage reveal-animation class from being enabled.

### Automated snapshot matrix

| Page/state | Viewport | axe-core 4.11.1 result |
| --- | ---: | --- |
| Home, light (fresh preference; prior dark key present) | 390 × 844 | 0 violations |
| Home, dark | 390 × 844 | 0 violations |
| Contact, light; empty-form validation then scan | 390 × 844 | 0 violations |
| Privacy Policy | 659 × 714 | 0 violations |
| Terms & Conditions | 659 × 714 | 0 violations |
| Cookie Policy | 659 × 714 | 0 violations |
| Refund / Cancellation Policy | 659 × 714 | 0 violations |

Axe scans cover detectable rule failures in a snapshot; they do not confirm announcement quality, end-to-end keyboard usability, zoom reflow, or third-party iframe usability.

## Environment notes and limitations

- Google Fonts, the Pexels hero photo and generated gallery image host returned intermittent network failures (`status 0`) during uncached isolated-browser page loads. They rendered/loaded in other local passes. Check production cold-cache behavior; keep fallback text/layout usable if those hosts are unavailable.
- The local preview is a custom static server. It cannot validate Cloudflare Pages response headers and redirect semantics; those were checked separately on the deployed origin below.
- Google Fonts and remote image requests failed intermittently in uncached Kombai-browser local runs, though all three generated gallery images and the Pexels hero loaded on the final production run. Continue to monitor cold-cache third-party asset availability.
- No speech-capable screen reader was available to this audit. Prior attempts to invoke browser zoom shortcuts in the automated review did not change zoom/device scale; that was not a valid zoom test.

## Required human screen-reader follow-up — not yet completed

Record assistive technology, browser, operating system, date and outcome for each test. Test the actual live deployment using a keyboard and listening to announcements, not only the accessibility tree.

- [ ] **Windows + NVDA + Firefox or Chrome:** navigate by landmarks and headings; verify skip link; inspect focus order; announce the menu toggle state/name, open it, close with Escape and confirm focus return.
- [ ] **Gallery:** enter the labelled carousel region; confirm slide/position context; use Left/Right arrows and previous/next buttons; listen for the polite settled-slide status after each change and after touch/trackpad swipe; verify disabled controls are announced and usable.
- [ ] **Theme and consent:** verify the theme button’s name/state after each toggle; on a cleared consent profile listen to the banner and choices, select Necessary only, reopen settings, and verify focus and updated analytics preference announcements.
- [ ] **Contact:** keyboard-submit empty form, confirm the first invalid field and error/status are announced; correct fields and acknowledgement. Do not send a real enquiry without authorization.
- [ ] **Map:** verify the load button has a useful name and the newly inserted, titled Google Maps frame is introduced coherently; note cross-origin limitations.
- [ ] **JAWS + supported Windows browser (if available):** repeat menu, carousel/status and contact validation paths; log any differences.
- [ ] **macOS/iOS VoiceOver + Safari (if available):** repeat landmark/heading navigation, menu, gallery, consent, form and map checks.
- [ ] **Android TalkBack + Chrome (if available):** repeat swipe-navigation order, gallery controls/status, consent banner and form/error tests.
- [ ] Separate a platform combination that was unavailable from a completed test; do not mark unavailable combinations as passing.

## Required real browser zoom/reflow follow-up — not yet completed

- [ ] In current desktop Chrome or Firefox, record browser/OS and test actual 200% and 400% browser zoom on home, contact and at least one long policy route. Reset to 100% after each run.
- [ ] For WCAG 1.4.10-style reflow, test 400% at a 1280 CSS-pixel-wide browser window (approximately a 320 CSS-pixel layout width). Verify text and controls reflow without page-level horizontal scroll, clipped content, overlaps or lost functionality. The charging carousel may scroll horizontally within its own labelled region; ensure those cards and their controls remain reachable.
- [ ] Verify navigation, primary actions, theme toggle, privacy-settings control, consent choices, contact fields/errors, footer links and long policy paragraphs at increased zoom.
- [ ] Repeat key checks in light and dark themes; capture screenshots at each zoom level and attach them to the completed audit record.
- [ ] If any overflow or clipping appears, record the selector/element and viewport/zoom, fix it, and rerun axe plus the same manual steps.

## Post-deployment verification — 27 September 2026, 18:26 UTC

- **Production release:** `e49af87` (`Bust cached theme and gallery scripts`) is at `origin/main`. GitHub Actions deployment run [36340455523](https://github.com/abhishekmahadevaiah-ai/surge-ev/actions/runs/36340455523) completed successfully. The release that introduced the content/theme change was `0fd95e9`; this follow-up added cache-busted URLs for `site-theme.js`, `v7.css` and `v7.js` on the homepage, plus the versioned theme script on contact, policy and 404 routes after production checks exposed stale asset cache behavior.
- **Light-first verified on production:** with legacy `surge-theme=dark` seeded and v2 preference absent, `https://www.surgecharging.com/` loaded `data-theme=light`, white body `rgb(255, 255, 255)`, and `#FFFFFF` theme color using `/site-theme.js?v=20260927-6`. The visible control continued to toggle dark/light and preserve the selected v2 preference on reload. The v7 stylesheet/script loaded with `?v=20260927-2`.
- **Live responsive/interaction checks:** at 320, 390, 768 and 1440 CSS px, document scroll width did not exceed client width. Gallery ArrowRight advanced the settled status to illustrations 2 and 3, disabled the next control at slide 3, and all three 1024px natural-width illustration images loaded. Mobile navigation Escape closed the menu and returned focus to its toggle. No map iframe was present initially; activating the map control inserted one.
- **Production automated scans:** axe-core 4.11.1 reported **zero violations** on the homepage at 390 × 844 and the contact page at 390 × 844 (including its empty-form validation state). Automated results do not certify screen-reader or zoom behavior.
- **Route/security smoke check:** homepage, contact, Privacy, Terms, Cookie and Refund/Cancellation routes, and versioned CSS/JS asset URLs returned 200. Production responses included CSP, HSTS (`max-age=31536000; includeSubDomains`), `X-Frame-Options: SAMEORIGIN`, and `X-Content-Type-Options: nosniff`. Internal audit and README paths returned 404. `/index-legacy-20260927.html` and the other legacy preview paths redirected to `/`; the final path rendered the current homepage without legacy claims.
- **Still outstanding:** true 200%/400% browser zoom/reflow and spoken screen-reader QA (NVDA, JAWS, VoiceOver and TalkBack combinations where available). Keep the checklist above open; no actual assistive-technology speech test or browser zoom test is claimed complete. Policy wording remains marked draft pending counsel-approved final text.
