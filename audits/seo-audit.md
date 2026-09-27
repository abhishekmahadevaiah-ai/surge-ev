# SURGE SEO and route audit

**Audit date:** 27 September 2026  
**Scope:** Source inspection plus local route/content checks. No production crawl or search-engine validation was performed.

## Checks completed

- Homepage has a non-empty title, description, canonical URL, Open Graph and Twitter metadata.
- Homepage JSON-LD is limited to `Organization` and `WebSite`; it names the supplied entity **SURGE Energy Pvt. Ltd.** and the supplied support email/phone. No unverified `LocalBusiness`, station coordinates, ratings or review markup is included.
- Privacy, terms, cookie and refund/cancellation pages each have a title, description, canonical URL, Open Graph metadata and `robots=index,follow` in source. Contact has corresponding metadata and canonical route.
- Sitemap includes `/`, `/contact`, `/privacy-policy`, `/terms-and-conditions`, `/cookie-policy`, `/refund-cancellation-policy`. `robots.txt` points to the sitemap.
- Local preview checks returned page content for `/`, `/contact`, all four policy URLs and old `/privacy` and `/terms` paths. The temporary local server manually mapped route aliases; it did **not** execute or verify Cloudflare Pages `_redirects` handling.
- Preview/history routes were added to `_redirects` to redirect to the production homepage. Direct `.html` policy file URLs and `/index.html` now redirect to their clean canonical routes. Confirm actual Cloudflare behavior/status codes before launch.
- Legacy paths `/privacy`, `/privacy.html`, `/terms`, and `/terms.html` remain mapped to their clean policy routes; they are retained only as redirects, not as separate canonical content.

## Outstanding

- Verify public domain, canonical host, redirect chains, sitemap fetch, robots policy and status codes against Cloudflare Pages after an approved deployment.
- Recheck all page claims and structured data against corporate/service-owner evidence before indexing.
- Current SEO output must not be treated as production or Search Console validation; no site was deployed as part of this audit. Local links to external map/email providers are user-initiated; only the canonical public routes belong in the sitemap.
