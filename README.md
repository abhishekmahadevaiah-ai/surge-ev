# SURGE — Your Electric Pit Stop

Static responsive site for **SURGE Energy Pvt. Ltd.** The public homepage is `index.html`; brand and support data is centralized in `site-config.js`.

## Public routes

- `/` — homepage
- `/contact` — contact/support enquiry handoff
- `/privacy-policy` — privacy policy draft
- `/terms-and-conditions` — terms draft
- `/cookie-policy` — cookie and consent information draft
- `/refund-cancellation-policy` — refund/cancellation policy draft

All policy pages remain visible in the shared site footer. They are draft content and must be reviewed and approved by qualified Indian counsel before production publication.

## Brand facts supplied for the current release

- Legal/business name: **SURGE Energy Pvt. Ltd.** (operator should confirm against corporate records)
- Brand/tagline: **SURGE / YOUR ELECTRIC PIT STOP**
- Official support: **support@surgecharging.com / +91 9110605621**
- Site: **https://www.surgecharging.com/**
- Current product facts supplied for the public site: **120 kW DC fast charging / dual CCS2 / Tumakuru, Karnataka**
- No registered office address was supplied. Do not invent one or present the service location as the registered office.

## Local preview

Run a static file server from the repository root, for example:

```powershell
py -m http.server 8080
```

Then visit <http://localhost:8080/>. This only previews the static files; it does not configure the production form backend.

## Consent, form and third parties

- Google Analytics 4 is injected by `site-enhancements.js` only after the visitor chooses “Allow analytics”. The consent selection is held in browser local storage; it is not a cookie.
- Google Fonts remain loaded from Google’s stylesheet; Tabler Icons Webfont 3.35.0 and its MIT license are vendored at `assets/vendor/tabler-icons/`, so icon glyphs do not depend on a third-party CDN at runtime. The homepage hero uses a Pexels-hosted stock charging-station photo by Reinhard Bruckner; its visible attribution and alt text state that it is illustrative, not a verified SURGE site. The homepage also requests Anime.js from esm.sh for decorative SVG motion; these image/font/motion requests are separate from analytics consent. The confirmed Tumakuru Google Maps destination opens only after the visitor chooses its outbound link or “Load interactive Google Map”; the iframe is created on click and makes no map request on initial page view.
- The contact form performs browser-side validation and opens a prefilled email draft to the official support inbox. It cannot confirm delivery. It is not backed by a server endpoint and does not provide server-side validation, rate limiting, abuse monitoring or duplicate-submission protection.
- Google Forms configuration remains unused. Do not say that the static form is connected to Google Forms.
- The full data-flow register, field-level form map, unresolved decisions and pre-launch checks are in [PRE-PUBLISH-AUDIT.md](./PRE-PUBLISH-AUDIT.md). Public pages version the support config URL so returning browsers fetch the current contact address after deployment.

## Deployment safeguard

The GitHub Actions workflow at `.github/workflows/deploy.yml` deploys on pushes to `main` and stages an explicit allowlist of public assets instead of uploading repository root documentation and archived previews. A SURGE-authorized user attested that counsel/owner approval and release gates are complete; that attestation is not independently verified by this repository. Future pushes to `main` trigger production deployment.

Before any release, test the production response headers, clean URLs, form experience, consent accept/reject/withdraw behavior and third-party network requests. Confirm HTTPS and the CSP against the final live deployment. Perform desktop, tablet, mobile, keyboard and screen-reader QA. No legal review or external security penetration test is claimed in this repository.
