# SURGE homepage and contact accessibility audit

**Audit date:** 27 September 2026  
**Environment:** Local static preview in Chrome for Testing, axe-core 4.11.1. This is an automated snapshot, not a certification or full manual accessibility assessment.

## Results

- Latest homepage axe scan at `/?finalaudit=2`: **0 reported violations**.
- Latest contact-page axe scan at `/contact`: **0 reported violations**.
- Earlier scans identified a missing homepage title, duplicate hero landmark naming, and a nested complementary `aside`; these were corrected by adding a descriptive title, giving the hero a unique label, and changing the station details panel from an `aside` landmark to a labeled `div` group.
- The contact form has associated visible labels, native required/type/length constraints, field hints, a privacy acknowledgement checkbox, an `aria-live` status, and first-invalid-field focus. Browser validation was exercised for invalid and valid field states; error text clears when the required entries are corrected.
- Keyboard checks: mobile navigation opens; Escape closes it and returns focus to the toggle. The six required legal/support footer links are visible on home and contact.
- Responsive checks: homepage at 390px, 768px, and 1440px was reviewed. The DOM reported no horizontal overflow at 390px or 768px; hero image element loaded during the review. Contact form at 390px had no horizontal overflow.
- Header mark bounds were measured after the fix: at 1440px it is 42px tall inside a 58px brand box; at 390px it is 36px tall inside a 51px brand box.

## Known limitations

- The local icon verification passed for `.ti-mail-forward`: local stylesheet referenced and WOFF2 loaded, with no missing icon-class selectors across 26 distinct classes. The current candidate hero image is a Pexels-hosted stock photo and loaded in the latest local browser check. External Google Fonts and image requests can still fail intermittently in the review environment; confirm availability and final appearance on the production origin.
- Manual screen-reader testing, 200%/400% zoom review, all browser/OS combinations, and contrast validation on the final deployed origin remain outstanding.
- This audit does not assess legal accessibility obligations or represent legal approval.

## Follow-up candidate checks — 27 September 2026

- Homepage at 390 × 844: axe-core 4.11.1 reported **zero violations in both light and dark themes**. Contact at 659 × 711 and privacy policy at 659 × 711 each reported **zero violations**.
- Current candidate mobile menu: opening sets `aria-expanded="true"`; Escape closes it, resets the expanded state and returns focus to the menu toggle. No horizontal overflow at 390 px (375 px document/client width).
- The legacy archived page’s contrast fixes were checked locally: `#9B9FA6` on `#14161A` = 6.82:1; `#FF7043` on `#2A2D35` = 5.02:1. Its repaired menu also closes on Escape and restores focus. Axe reports one moderate `region` finding on its off-screen screen-reader-only description; this archive remains noindex and must remain redirected.
- The candidate hero image loaded at 1600 px natural width in the browser, with alt text naming its photographer and stating that it is not a verified SURGE site. It remains externally hosted; a deployment/cache cold-load check is still required.
- With the map collapsed at 390 × 844, no map iframe was present; after clicking the map control, one titled Google Maps frame appeared and the viewport had no horizontal overflow. The post-activation axe scan reported zero violations. Screen-reader announcement of the third-party map content itself has not been manually assessed.

## Final deployed production checks — 27 September 2026 (13:05–13:29 UTC)

- After the clean-route and support-cache hotfixes, axe-core 4.11.1 reported **zero violations** on live homepage, contact, privacy-policy and cookie-policy snapshots at 659 × 711. The homepage also had zero violations at 1038 × 711 and 390 × 844.
- Production mobile menu opens, updates `aria-expanded`, and closes on Escape with focus returned to the menu toggle. Blank contact-form submission focuses `#contact-name` and announces the validation message; no message was sent.
- Google Maps was absent on initial page load and inserted only on activation; the confirmed pin rendered in the iframe. Map activation retained the 375 px mobile layout without horizontal overflow. Cross-origin map controls/announcements have not been manually screen-reader tested.
- Manual screen-reader use, 200%/400% zoom, reduced-motion with assistive technology, other browsers/OS and qualified accessibility/legal review remain outstanding.

## Live production checks — 27 September 2026

- After the final Pages deployment, homepage, contact, privacy, and cookie pages were scanned with axe-core 4.11.1 at 659 × 711: **zero reported violations** on each; homepage additionally had zero findings at 390 × 844. Automated scans do not replace assistive-technology review.
- Production mobile nav: opening announces expanded; Escape closes it, resets `aria-expanded` and restores focus to the menu toggle. Contact blank submit focuses `#contact-name` and announces the validation status without sending any message.
- Production map: no frame is present on initial load; the click control adds the titled Google Maps iframe. It displayed the owner-confirmed pin without horizontal overflow. Cross-origin iframe content was not separately evaluated by axe; perform manual screen-reader checks before claiming complete accessibility.

## Live keyboard, accessible-tree, and zoom check — 27 September 2026, 16:51 UTC

- On `https://www.surgecharging.com/`, manually reviewed the browser accessibility-tree snapshot: a “Skip to content” link, banner, labelled “Main navigation,” main landmark, one level-1 heading, content sections, labelled controls and `contentinfo` landmark were exposed. The hero image had descriptive alt text identifying the photographer and clearly saying the photo is illustrative/not a confirmed SURGE site.
- Keyboard test at 390 × 844: focusing the mobile menu toggle and pressing Enter set `aria-expanded="true"`; Escape closed the menu and returned focus to `#menu-toggle` with its “Open menu” name.
- The 320-CSS-pixel live viewport had horizontal page overflow (document scroll width 346 px versus a 305 px client width); inspection traced the overflow to the mobile theme-toggle label/control extending beyond the header. The local, not-yet-deployed candidate hides that label on narrow screens and removes the document's 320 px minimum width; its follow-up check must verify no document overflow at 320 px.
- Attempting browser zoom keyboard shortcuts in the automated live-browser session did not change device scale or CSS viewport width, so this did **not** count as a 200%/400% zoom test. No NVDA, JAWS, VoiceOver or TalkBack speech output was available; the accessibility-tree review is not a substitute for listening with a screen reader. Actual screen-reader and browser zoom tests remain outstanding.
- The current live deployment predates the working-tree founder/gallery update; AI-gallery load, controls and keyboard interaction have been validated only against the local preview candidate, not production.

## Working candidate regression checks — 27 September 2026, 17:00 UTC

- The local v7 homepage exposes the Founder section and nav link with only the supplied “Abhishek — Founder” role and company focus. No unverified achievements or personal background were added.
- Axe-core 4.11.1 reported **zero violations** at the 390 × 844 mobile candidate viewport. The 320 px document minimum-width regression was removed; the candidate document scroll width matched its client width at 320, 390, 768, 902, 920, 1000, 1050 and 1440 px.
- The generated gallery’s three images loaded at 1024 × 576. Keyboard ArrowRight moved between slides; the previous/next disabled states and polite status updated. These candidate checks do not indicate that the gallery is live or tested behind the production CSP.
- Real assistive-technology speech and actual 200%/400% browser zoom remain unverified; the live-browser environment did not provide a screen-reader engine or actionable zoom shortcut.

## Final cache-busted production review — 27 September 2026, 18:26 UTC

- Production release commit `e49af87` deployed successfully in GitHub Actions run `36340455523`. Homepage theme/CSS/carousel scripts are loaded from versioned URLs to avoid stale assets; shared theme-script URLs on Contact, policy and 404 pages were versioned too.
- The production homepage opened light with an older saved dark-theme value present, and its theme-color metadata was white. Theme changes still update the toggle state and persist across reload.
- Production axe-core 4.11.1 checks reported **zero violations** on homepage and contact at 390 × 844. Contact blank-submit test focused `#contact-name`, exposed the existing validation status, and did not launch an email.
- Production at 320, 390, 768 and 1440 CSS px had no document horizontal overflow. The three concept images loaded; Left/Right carousel operation updated the polite status and the next button disabled at the final item. Escape closes mobile navigation and returns focus. The map is inserted only on click.
- Clean public routes returned 200. HSTS, CSP, `X-Frame-Options` and `X-Content-Type-Options` were present. Internal audit/docs returned 404; legacy route aliases redirected to `/`.
- Actual NVDA/JAWS/VoiceOver/TalkBack output and browser 200%/400% zoom/reflow checks remain outstanding; use the manual checklist in `kombai-accessibility-audit-2026-09-27-22-27.md`. This automated/browser QA is not an accessibility certification.
