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
