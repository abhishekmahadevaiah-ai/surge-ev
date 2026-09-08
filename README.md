# SURGE — EV charging network

Static landing page variants for SURGE, a Bengaluru-based EV charge point operator in Karnataka.

## Pages

- [`index.html`](./index.html) — Industrial Grid, the primary landing page
- [`editorial-voltage.html`](./editorial-voltage.html) — Editorial Voltage variation
- [`terminal-ops.html`](./terminal-ops.html) — Terminal Ops variation

The pages are standalone HTML and load Tailwind CSS, Big Shoulders Display, IBM Plex Sans, IBM Plex Mono, Tabler Icons, and Anime.js from their CDNs. No build step is required.

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
