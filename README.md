# SURGE — EV charging network

Static landing page variants for SURGE, a Tumkur-based EV charge point operator in Karnataka.

## Pages

- [`index.html`](./index.html) — Industrial Grid, the primary landing page
- [`editorial-voltage.html`](./editorial-voltage.html) — Editorial Voltage variation
- [`terminal-ops.html`](./terminal-ops.html) — Terminal Ops variation
- [`contact.html`](./contact.html) — Validated partnership and support enquiry form
- [`privacy.html`](./privacy.html) — Privacy notice
- [`terms.html`](./terms.html) — Website terms
- [`404.html`](./404.html) — Custom not-found page

The pages are standalone HTML and load Tailwind CSS, Big Shoulders Display, IBM Plex Sans, IBM Plex Mono, Tabler Icons, and Anime.js from their CDNs. No build step is required. Shared legal-page styling, consent behavior, SEO assets, and accessibility helpers live in [`legal.css`](./legal.css), [`site-enhancements.css`](./site-enhancements.css), and [`site-enhancements.js`](./site-enhancements.js).

## Preview locally

From the repository root, run any static file server. For example, with Python installed:

```powershell
py -m http.server 8080
```

Then open <http://localhost:8080>.

## Cloudflare Pages deployment

The workflow at [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) deploys the repository root to the Cloudflare Pages project `surge-ev` on every push to `main`. It can also be started manually from the GitHub Actions tab.

Before the first deployment:

1. Create a Cloudflare Pages project named `surge-ev`, or run `npx wrangler pages project create surge-ev --production-branch main` while authenticated with Wrangler.
2. Create a Cloudflare API token with permission to edit Pages projects.
3. In GitHub, open **Settings → Secrets and variables → Actions** and add:
   - `CLOUDFLARE_API_TOKEN` — the Cloudflare API token
   - `CLOUDFLARE_ACCOUNT_ID` — the Cloudflare account ID
4. Push to `main` or run **Deploy SURGE to Cloudflare Pages** manually.

The workflow intentionally keeps credentials out of the repository. Cloudflare will provide the deployed `*.pages.dev` URL after the first successful run.

## Launch checklist support

- `robots.txt` points crawlers to [`sitemap.xml`](./sitemap.xml).
- Submit `https://www.surgecharging.com/sitemap.xml` under **Google Search Console → Sitemaps** after verifying the `surgecharging.com` domain.
- Keep **Always Use HTTPS** enabled in Cloudflare; [`_headers`](./_headers) adds HSTS and browser security headers.
- Optional analytics are consent-gated. Add the production GA4 measurement ID to [`analytics-config.js`](./analytics-config.js) only after the analytics property is created.
- App-store and social links intentionally route to [`contact.html`](./contact.html) until real production URLs are available.
- The legal pages are launch templates and should be reviewed against the final operating entity, contact details, and applicable legal advice before public launch.
