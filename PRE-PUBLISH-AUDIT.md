# SURGE pre-publish audit — internal working document

> **DRAFT LEGAL TEXT; NO INDEPENDENT COMPLIANCE DETERMINATION.** The authorized SURGE user attested in this conversation that owner/counsel sign-offs and P0 release gates are complete. That attestation is not independently verified by this audit. Legal identity, operational claims, privacy practices and final terms must match current business records and the approved counsel version.

Initial audit baseline: 27 September 2026. Original scope: repository pages and scripts available in the workspace. This is a code/content audit, not an external security test, legal opinion, company-registration check, or penetration test. The later live-production verification is recorded separately below.

## Approved brand and contact source of truth

- Legal/business name: **SURGE Energy Pvt. Ltd.** (exact spelling supplied by the business; legal registration not independently verified)
- Brand: **SURGE**
- Official tagline: **YOUR ELECTRIC PIT STOP**
- Official support: **support@surgecharging.com**, **+91 9110605621**
- Website: **https://www.surgecharging.com/**
- Supplied product/technical statements for the intended production message: **120 kW DC fast charging**, **dual CCS2**, **Tumakuru, Karnataka**. These were supplied by the business for this task; technical, regulatory and installed-site verification remains with the operator.
- No registered office address was supplied. Do not create one or imply that Tumakuru is the registered office. Add the verified registered office to the CMS only after the company supplies it.
- No published price, opening hours, uptime, station count/coverage, customer review, testimonial, app availability, or live charger status is substantiated by this audit.

## Form data map

The current public website has one contact enquiry form in `contact.html`. No separate search form or property submission form is present in the production site. Phone number, city/location, company/property/fleet size, vehicle/charging-session information, payment data and sensitive personal information are not requested by the website form. Avoid adding them unless the operator documents why they are necessary.

| Field | Collected | Purpose | Required | Destination/storage | Access | Retention |
| --- | --- | --- | --- | --- | --- | --- |
| Name | User-entered name | Address and respond to enquiry | Yes | Current fallback opens the visitor's mail app; only stored if the user sends an email. If a public Google Form is configured later, it will be transmitted to its Google Form and linked response Sheet. | Mailbox/form/Sheet access must be restricted to named SURGE support personnel; owner to confirm | No approved period supplied. Set a documented deletion schedule; retain only while needed to respond and meet confirmed obligations. |
| Email | Work/personal email entered by visitor | Reply to enquiry | Yes | Same email or future form route as above | Same access limitation; owner to confirm | Owner to set/confirm a schedule. |
| Enquiry type | One of the visible topic choices | Route the request to an appropriate support workflow | Yes | Same email or future form route as above | Same access limitation; owner to confirm | Owner to set/confirm a schedule. |
| Message | Free-form enquiry text | Understand and respond to the request | Yes | Same email or future form route as above. User should be warned not to include credentials or sensitive personal information. | Same access limitation; owner to confirm | Owner to set/confirm a schedule. |
| Website honeypot | Hidden anti-spam field; intended to reject automated submissions | Basic client-side spam signal only | No; must remain empty | Not submitted to the support destination | Browser-side adapter | Not retained. This is not a substitute for server-side spam protection. |

**Current service state:** `google-form-config.js` contains blank action and field IDs. The selected behavior is the browser-validated mail-app draft; keep it truthful, and do not claim a successful submission or delivery. It may not work if a visitor has no mail handler. There is no server-side validation, rate limiting, abuse monitoring, duplicate-submission protection, or authoritative delivery receipt. A backend is not included by the user's choice; if an actual web-submission endpoint is added later, assess those protections first.

## Third-party data-flow register

| Provider/integration | Current use | Data potentially disclosed | Cookies/tracking and consent considerations | Action/verification |
| --- | --- | --- | --- | --- |
| Cloudflare Pages | Serves the static site; redirects and headers | Network request metadata such as IP, user agent and requested path | Hosting/security processing; hosting cookies are not specified by repository | Confirm Cloudflare account region, retention and contractual terms with provider. Existing HSTS and security headers are configured; verify deployment response. |
| Google Analytics 4 / Google Tag Manager host | Measurement ID in `analytics-config.js`; script is dynamically inserted by `site-enhancements.js` only after an analytics choice | Page/view and event data, technical/device identifiers and IP-related data as governed by Google | Analytics cookies/identifiers may be set after affirmative consent. Actual GA retention, signals and account settings are not visible in source | Test network traffic before/after accept/reject/withdraw; verify GA data retention and consent settings in the property; obtain counsel review. |
| Google Fonts | Remote font stylesheet on pages using it | IP address, requested URL, browser/network metadata | No Google Analytics tag is inserted by the font stylesheet; provider behavior/policy may change | Decide whether to self-host fonts after license review or keep with disclosed third-party request; counsel to assess. |
| Tabler Icons Webfont | Pinned Tabler Icons Webfont 3.35.0 stylesheet and WOFF2 font served locally from `assets/vendor/tabler-icons/` | No external Tabler request from current HTML; Cloudflare serves the static CSS/font files | No tracking cookie configured. MIT copyright/license is included beside the vendored files. | Verify same-origin asset status on Cloudflare; keep version and license together when updating. |
| Google Maps | User-activated directions link and click-to-load iframe embed for the owner-confirmed destination (13.312764, 77.115488; Maps label `8478+455 Tumakur, Karnataka, India`) | On directions-link click or explicit map-load action, Google receives a request and may receive IP address, browser and location/request metadata | No iframe or Maps request is added on initial page load; the visitor activates either surface | The authorized SURGE owner confirmed this pin in chat. Keep the embed click-to-load; recheck the pin and link with the operator before changing location details. |
| Google Forms / response Sheet | Optional adapter/config files; currently unconfigured | If configured and submitted, form values and request metadata go to Google; linked Sheet stores responses | Third-party processing; storage/access/retention depends on Form and Sheet configuration | Keep disabled until owner supplies action/field IDs, confirms public-response settings, ACL, retention and notice. Do not claim configured delivery. |
| Anime.js CDN (esm.sh) | Dynamically imported for the decorative SVG energy-wave animation on the production homepage | CDN request metadata and script request | Not a marketing tracker as configured; it is a non-essential external script request. The current code imports it independently of analytics consent. | Decide whether to self-host, retain with disclosure, or remove the animation. Confirm the production CSP allowlist and review any consent requirement. |
| YouTube privacy-enhanced embed | Old noindex electric-racing preview only | Provider receives request metadata if loaded | Not production content; verify redirect makes it unreachable via public routes | Preview route redirects to root. |
| Pexels stock hero image | Homepage loads a stock EV charging photograph from `images.pexels.com` | Pexels receives image request/network metadata such as IP address and browser details | No tracking configured by site code. Pexels license states its photos may be used for free and attribution is not required; photographer credit is included as attribution. This illustrative image is explicitly not represented as a verified SURGE site. Recheck current license/source terms before publication. | Photo: Reinhard Bruckner on Pexels (`https://images.pexels.com/photos/4678065/pexels-photo-4678065.jpeg`). Image host is included in candidate CSP. Verify clean-cache load and response headers after deployment. |

No payment gateway, CAPTCHA, CRM, social embed, customer-support widget or charging-platform API is integrated into the current production page according to the repository scan. Re-audit if one is added.

## Non-legal findings addressed in this change set

- Replace old and conflicting public business/contact data with the exact supplied details.
- Remove unsupported production-page 180 kW claims, unverified station counts/coverage/prices/statuses, ratings, testimonials, app claims, fake availability, and the non-approved “DRIVE TOMORROW” phrase.
- Publish draft policy pages at the requested clean routes and link all six required legal/support/consent destinations visibly in footers.
- Keep Google Maps user-activated: the directions link is explicit, and the interactive iframe is created only after a button click.
- Label draft legal copy for review; do not claim statutory compliance or legal approval.
- Make the unconfigured static enquiry path truthful and provide an official email fallback.
- Keep previews/noindex pages off the production route.

## Owner / counsel sign-off status

- The authorized SURGE user attested in this conversation that qualified-counsel/owner sign-offs and required P0 release gates are complete, and authorized pushing the candidate to `main`. This is an attestation, not independently reviewed legal advice or proof attached to this repository.
- Verify company legal name against incorporation certificate, registered office and approved consumer-support details; these source records were not provided for this audit.
- Confirm exact charger output, number/standard of connectors, installed sites, station coordinates, availability/operating hours, and actual service model.
- Approve final privacy, terms, cookie and refund/cancellation wording with qualified Indian counsel. Review Indian data protection/privacy, consumer protection, e-commerce/payment, electronic communications, GST/tax, accessibility, IP and Karnataka/EV charging rules that apply to the actual operating model. No compliance claim is made here.
- The owner selected the current browser-validated email-draft fallback; do not represent it as a delivered form. A production form backend remains out of scope unless SURGE supplies the email/provider choice and credentials. Until then, server-side validation, rate limits, spam/abuse protection, duplicate protection and delivery receipts remain unavailable. Verify mailbox access control, retention/deletion and breach/contact process for messages that users send.
- Set and verify Google Analytics data-retention and consent settings; determine whether remote Google Fonts and Anime.js CDN requests require a different lawful basis or self-hosting. Tabler Icons are now self-hosted; verify same-origin icon assets on Cloudflare.
- The authorized SURGE user confirmed the Google Maps pin at 13.312764, 77.115488 for this site. Operations should continue to verify active service/station details before presenting availability or charging-session facts.
- Confirm commercial permission/terms for all creative assets and third-party libraries.
- Run a live deployment security test for HTTPS, CSP, HSTS, secure response headers, secret scans, link/image failures, CSP report failures and analytics behavior.

## QA record — local baseline only

- Desktop review: 1440 × 900 visual review of homepage and network section; hero asset appeared in the capture and the layout had no document-width overflow.
- Tablet review: 768 × 1024; no horizontal overflow, mobile navigation control visible, hero image element reported loaded in the browser check.
- Mobile review: 390 × 844 homepage and contact form; no horizontal overflow, mobile menu opens and Escape closes it, header wordmark measured within its brand box.
- Contact form: required-field failure displayed inline feedback and focused the first invalid field; with all fields/acknowledgement completed browser validity became true and the error cleared. Form opens an email draft only; successful delivery was not tested or represented.
- Consent: local browser confirmed no GA tag/resource before choice, “Necessary only” kept analytics absent, “Allow analytics” inserted the tag, and reopening settings disabled/removed it. Network-based production confirmation remains outstanding.
- Local clean-route checks: `/`, `/contact`, `/privacy-policy`, `/terms-and-conditions`, `/cookie-policy`, and `/refund-cancellation-policy` returned page content in the updated local preview; `/contact` → `/privacy-policy` link navigation worked. A separate static target scan found no missing page files for current, legacy-alias or preview redirect destinations. This did not exercise Cloudflare Pages `_redirects` status codes or production headers.
- Tabler check: all 26 distinct icon class names used across the HTML pages occur in the pinned Webfont 3.35.0 CSS; no missing glyph class was found. Browser computed `.ti-mail-forward` to `font-family: tabler-icons`; local CSS was available and the WOFF2 font request returned 200. No console errors or failed local icon requests were captured.
- Browser accessibility audit (axe): last homepage audit reported no violations at its captured 659 × 730 viewport; the contact-page audit reported no violations at 390 × 844. This automated scan does not replace manual keyboard, screen-reader, zoom, or full-page testing.
- Browser console: no JavaScript errors in reviewed page captures. Tabler Icons Webfont 3.35.0 is now served from the repository under `assets/vendor/tabler-icons/`, removing its third-party runtime dependency. Google Fonts failed intermittently in the isolated browser, and the generated hero image still uses an external CDN; verify them and the CSP from the deployed origin. The page rendered during the later screenshot may have used cached font/image resources.
- No deployment was performed as part of the source remediation. Earlier browser validation used an improvised local static server and did not exercise Cloudflare Pages `_redirects` status codes or production headers. See the dated live-production verification below for the actual deployed behavior.
- No legal approval, corporate-record verification or penetration test was performed. The deployment workflow publishes on pushes to `main`.

## Live production verification — release BLOCKED

**Checked:** 27 September 2026, approximately 11:28–11:46 UTC. **Origin:** `https://www.surgecharging.com`. Read-only browser and HTTP checks; no production changes were made. This captures the deployment that was live at check time, not the current uncommitted workspace candidate.

### Release state and route results

- Local Git reports `HEAD` and `origin/main` both at `5f46603` (`Refine SEO schema and charger CTAs`). The SURGE audit/remediation files in the workspace are modified or untracked and are not in that commit. The Cloudflare Actions workflow at `.github/workflows/deploy.yml` deploys on pushes to `main` or manual dispatch. The checked live site therefore does **not** contain this workspace's prepared 120 kW homepage, new policy pages, current header/redirect configuration, or associated compliance copy.
- Production `/` returns **200** but serves the older “SURGE Charging — 180kW EV charging across Karnataka” site. The live page asserts 180 kW, 24/7 service/support, live bay status, 500+ locations, 1,000+ charge points, 90+ stations, prices, an app, fabricated customer reviews, and other operational claims that the approved workspace audit treats as unverified. Do not treat that live content as approved or publish-ready.
- Production `/contact` returns **200** but is the old form variant. It says enquiries are sent to Google Forms once configured, displays “Form setup required: connect the Google Form to send,” and exposes the old `SURGE ELECTRIC PVT LTD` identity and `abhishek@surgecharging.com` contact. The current form configuration in the workspace is blank; no successful form delivery was attempted.
- All four current policy routes return **404**: `/privacy-policy`, `/terms-and-conditions`, `/cookie-policy`, and `/refund-cancellation-policy`. Their corresponding `.html` URLs also return 404. The live `/privacy` and `/terms` routes instead return **200** with older policy pages.
- Older app/preview routes remain reachable: `/index-v3`, `/index-route-ledger-v2`, `/editorial-voltage`, `/electric-racing`, and `/terminal-ops` returned **200** during checks. `/v7` and `/v7.html` returned 404. The deployed redirects do not match the current workspace `_redirects` rules.
- `/contact.html` and `/index.html` redirect to `/contact` and `/` respectively. `/privacy.html` and `/terms.html` redirect to the old `/privacy` and `/terms`, not the new policy routes.
- Live `robots.txt` returns 200 and allows `/`, but its live sitemap lists only `/`, `/contact`, `/privacy`, and `/terms`. It does not list the four new policy routes; live sitemap `lastmod` values remain 12 September 2026. The current workspace sitemap is therefore not deployed.
- Workspace candidate assets `/site-theme.js`, `/assets/vendor/tabler-icons/tabler-icons.min.css`, its WOFF2, `/v7.css`, and `/v7.js` all returned 404 from production. Cloudflare does not normally expose `_headers` or `_redirects` as public assets (both returned 404); the actual behavior was assessed through response headers and URL status/redirect chains instead.
- `https://surgecharging.com/` (apex, without `www`) failed DNS resolution during the probe; the `www` hostname resolves and returns 200. Confirm DNS and canonical-host redirection before relying on apex aliases.

### Deployed response headers

The `www` homepage and contact responses included HSTS (`max-age=31536000; includeSubDomains`), `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy: camera=(), microphone=(), geolocation=()`. **No `Content-Security-Policy` response header was present**, despite the CSP rule in the current workspace `_headers`. Production also returned `Access-Control-Allow-Origin: *`; confirm that this broad response header is intentional. The observed `Link` header preconnected to Google Fonts, unpkg, and esm.sh, consistent with the older production code rather than the local icon-bundled release candidate.

### Browser QA — live site

- The live homepage rendered without captured JavaScript console errors or failed network requests in the initial pass. Its axe scan at 659 × 711 found serious `color-contrast` violations on 15 small gray/orange text nodes (including `#777a80` on `#14161a`, measured 4.2:1 against 4.5:1 required, and orange `#ff5a1f` on `#2a2d35`, measured 4.41:1), plus one moderate `region` issue.
- At a 390 px mobile viewport, the live document had no horizontal overflow (375 px document/client width). The menu opens and updates `aria-expanded`, but pressing Escape leaves it open and does not return focus to the toggle. This contradicts the earlier local-only keyboard check and must be fixed in the deployed variant.
- The live contact route's axe scan at 659 × 711 reported zero violations, but it is the stale contact page and is not evidence that the current form is deployed. Empty-submit validation showed the old generic required-fields error. The site advertised an unconfigured Google Form; no real submission was sent.
- The `/privacy-policy` browser route displayed the deployment's 404 page. That 404 had zero axe findings; this does not count as an accessibility pass for the missing policy content.
- With site storage cleared, the production consent banner appeared and GA was absent. “Necessary only” kept the Google Tag Manager script absent. “Allow analytics” loaded `gtag.js`; reopening settings and withdrawing changed the preference to `necessary`, removed the script, and set the GA disable flag. However, the legacy homepage also requested Tailwind's browser runtime from unpkg and Anime.js modules from esm.sh before any analytics choice. Analytics consent therefore does not gate all non-essential third-party requests.

### Current workspace candidate — local-only spot check

- A fresh load of `http://127.0.0.1:8080/?qa-fresh=20260927-1139` served the workspace homepage with a non-empty title and the intended 120 kW / dual CCS2 / Tumakuru messaging. The desktop axe scan at 1038 × 711 reported zero violations. This remains a local static-server check, not an assertion about Cloudflare's response headers or clean-route rules.
- The isolated local browser reported failed requests for Google Fonts and the generated hero image CDN in one fresh-load capture; the rendered screenshot showed a cached/previously available hero image. The page payload was approximately 1.15 MB. Treat those remote assets as a reliability/performance dependency until verified or self-hosted.

### Follow-up candidate accessibility and asset checks — 27 September 2026, 12:08–12:43 UTC

- These are **workspace/local checks only**; no production deployment or production endpoint recheck was performed. Production is still the older release described above until the engineer deploys this candidate.
- The local static preview returned 200 for `/`, `/contact`, all four clean policy routes, `site-theme.js`, local Tabler CSS/WOFF2, `v7.css`, and `v7.js`. This custom preview maps pages directly and does not test Cloudflare `_redirects` or response headers.
- Current candidate homepage was checked at 390 × 844 in light and dark themes with axe-core 4.11.1: **0 reported violations in each theme**. The contact route was checked at 659 × 711: **0 reported violations**. Earlier larger-screen candidate snapshot also reported 0 findings; automated results are not a manual conformance claim.
- Candidate hero image is now the Pexels stock photograph by Reinhard Bruckner (`https://images.pexels.com/photos/4678065/pexels-photo-4678065.jpeg`), with explicit alt text and visible link credit. The copy states that it is illustrative and not a verified SURGE location. Pexels’ published license allows free online use and does not require attribution; credit is provided voluntarily. Latest local browser state showed the 1600 px-wide image loaded. External font/photo availability still depends on their hosts.
- Candidate menu manual mobile test at 390 px: click sets `aria-expanded="true"`; Escape closes it, resets `aria-expanded="false"` and returns focus to `#menu-toggle`. No horizontal overflow was measured (375 px document/client width).
- The obsolete `index-legacy-20260927.html` source also received the contrast and keyboard fixes that match the live findings: muted text `#9B9FA6` reaches 6.82:1 on `#14161A`; orange text `#FF7043` reaches 5.02:1 on `#2A2D35`. The legacy page’s mobile menu now closes on Escape, resets its label/state and returns focus. Local axe reported no contrast violation for this file but retained one moderate `region` finding on the old standalone description. The legacy page remains noindex/archive material and must remain redirected in production.

### Click-to-load map verification — 27 September 2026, 12:43 UTC

- The authorized user confirmed the supplied Google Maps pin at `13.312764, 77.115488` (Google label `8478+455 Tumakur, Karnataka, India`). The site embeds this coordinate only; it does not display an alleged charger-specific listing name.
- At 390 × 844, the local browser showed zero map frames and zero Google Maps resource entries before activation. Clicking “Load interactive Google Map” inserted one iframe with an accessible title; the frame resolved to Google Maps and displayed the supplied coordinate. Focus moved to the frame and the page had no horizontal overflow.
- Axe-core 4.11.1 reported **zero violations** on the mobile homepage after map activation. The candidate CSP now permits `maps.google.com` and `www.google.com` frames; local static preview does not deliver or validate Cloudflare response headers.
- `map-embed.js` has been added to the workflow’s explicit public asset allowlist. The allowlist now contains 24 checked public files; the internal audit and archive remain excluded.
- Local route check at `http://127.0.0.1:8080/` returned 200 for `/`, `/contact`, all four clean policy routes, `/map-embed.js`, `/site-theme.js`, and the local Tabler CSS/WOFF2. This does not exercise Cloudflare headers or redirects.
- This local test does not prove production Maps loading/CSP, public-file exclusions, or Cloudflare Pages deployment success. Recheck all three after push-triggered deployment.

## Remaining technical debt and release actions

### P0 — resolve before release

1. **Deploy/release mismatch:** the authorized engineer explicitly attested that they may approve release and that counsel/owner sign-offs and required P0 gates are complete. This records their attestation; it is not an independent legal determination. Push/deploy the approved commits, record the resulting Git SHA and Cloudflare deployment ID, and confirm production HTML matches the workspace before interpreting candidate checks as live.
2. **Critical route and content drift:** make all four clean policy routes return their intended policy page, verify legacy redirects point to the correct canonical destinations, and remove or redirect reachable preview pages. Re-test each response status and final URL on Cloudflare.
3. **Incorrect live claims and contact identity:** replace stale 180 kW claims, live availability, rates, coverage, testimonials/app claims and old contact details with the approved candidate. The authorized user attested counsel/owner approval is complete; this audit did not independently verify source documents or re-review counsel's final legal copy. The policy pages still contain draft/review wording and must be reconciled with the counsel-approved version before public use.
4. **Apex DNS:** repair or explicitly retire `surgecharging.com` apex DNS; confirm HTTP/HTTPS canonical redirects to `www` after propagation.
5. **Internal document publishing risk:** addressed in the follow-up release workflow by staging only an explicit allowlist of public files under the runner temp directory before deployment; internal `PRE-PUBLISH-AUDIT.md`, `audits/`, README and legacy design previews are omitted. Cloudflare Pages direct upload has no documented `.pagesignore` support. Latest production probes return 404 for `/PRE-PUBLISH-AUDIT.md`, `/audits/accessibility-audit.md`, `/README.md`, and the legacy page alias. Continue checking these after releases.

### P1 — security, privacy, and accessibility

6. **Production CSP missing:** reconcile the live Cloudflare response with `_headers`; test the final CSP in report-only or equivalent before enforcement, because third-party font/analytics/animation and click-to-load Google Maps frame origins differ by page. Recheck CSP violations after the authorized deployment.
7. **Unconsented external resources in the deployed version:** remove the Tailwind browser runtime and either self-host Anime.js or document/assess its request; consider self-hosting approved fonts and hero media. Ensure non-essential requests align with final consent/legal advice and do not assume analytics consent alone covers them.
8. **Live-page contrast and keyboard behavior:** the 15 contrast findings and missing Escape/focus behavior were traced to the older production page, not the current v7 candidate. The archived legacy source now has higher-contrast text tokens and Escape-close/focus restoration; the v7 candidate already had Escape-close/focus restoration. This does not fix the still-live production version. Deploy the candidate and re-run live axe plus manual keyboard checks before marking this item resolved.
9. **Contact delivery and support address cache:** contact-page form remains a mail-app draft only and cannot confirm delivery. Production `site-config.js` contains the approved `support@surgecharging.com`; a long-lived browser had previously shown the old cached email. Public HTML pages now reference `site-config.js?v=20260927-5` to bypass that stale version. Verify contact/email behavior after the cache-bust deployment; do not claim form delivery.
10. **Accessibility validation scope:** automated axe snapshots do not cover screen-reader use, 200%/400% zoom, reduced-motion behavior in the live legacy script, or every route/state. Complete manual assistive-tech and zoom checks on the deployed release.

### P2 — deployment and maintenance

11. **Release workflow checks:** `.github/workflows/deploy.yml` assembles an explicit public asset allowlist under the GitHub runner temp directory and deploys that directory rather than the repository root. The previous `continue-on-error` project-create step was removed. Pages automatically serves matching `.html` files at clean routes and redirects `.html` URLs to those clean paths; avoid self-referential clean-route rewrites. A production smoke test found 308-to-self responses from the earlier explicit 200 rewrites; a routing/cache hotfix is now being prepared. Add route/header preflight and post-deploy smoke tests.
12. **Historical source remains in the repository:** legacy design/preview HTML and scripts contain unsupported claims, old contact data, remote embeds and older interactions. Current `_redirects` intends to keep them out of the public route tree, but production evidence shows those rules are not live yet. Keep their content clearly marked and validate the redirects before relying on it; consider moving archival artifacts outside the publish root once policy/retention needs are resolved.
13. **Asset weight / external availability:** current candidate still requests Google Fonts, Anime.js, and the Pexels hero photograph externally. Check transfer size and availability from a clean browser cache; consider self-hosting where license permits and optimizing images/fonts. A Pexels source review confirmed its published free web-use license; keep the attribution and non-SURGE-site caveat, and recheck current terms before release.
14. **Legal, operational and provenance approvals remain outstanding:** company registration/address, technical station specifications and location, actual service/payment/refund model, provider terms, asset usage rights, retention schedule, grievance process, and qualified Indian counsel approval have not been verified.

**Release state:** **Owner-authorized deployment pending live verification.** The authorized SURGE user attested that counsel/owner approvals and P0 release gates are complete and requested a push to `main`. At the last recorded production check, the old release was live; the latest push-triggered deployment status and live result must be recorded below after the workflow runs. After deployment, update this section with the deployed commit/Cloudflare deployment ID, routes, response headers, internal-document exposure checks, Maps/CSP results and accessibility findings. No independent legal opinion or penetration test is provided by this audit.
