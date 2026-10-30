# ANORIK Studio — anorik.com

Static site (HTML/CSS/JS) on Cloudflare Workers (static assets), with a small Worker for the contact form.

## Structure
- `index.html`, `style.css`, `app.js` — the site. `index.html` is the English source; every text has `data-en`/`data-ka`
- `ka/index.html` — Georgian page, generated. After editing `index.html`, run `python3 tools/build.py` (updates SEO tags in both pages and rebuilds `/ka/`)
- `src/worker.js` + `src/contact.js` — `POST /api/contact`, sends form inquiries by email via Resend; everything else is served from static assets (`wrangler.jsonc`, `.assetsignore`)
- `_headers` — security and cache headers
- `robots.txt`, `sitemap.xml`, `assets/og-image.png` — search and link previews

## Contact form setup
1. Create an account at resend.com, add the domain `anorik.com` and add the DNS records it shows in Cloudflare DNS (they don't affect Email Routing).
2. Create an API key in Resend.
3. Cloudflare → Workers & Pages → anorik → Settings → Variables and Secrets (Production): add `RESEND_API_KEY` as a **Secret**. Plain-text variables set in the dashboard are overwritten by each deploy from Git, so `CONTACT_TO` lives in `wrangler.jsonc` under `vars`.
4. Deploy. Replying to an inquiry email goes straight to the client (reply-to is set).

If the function isn't configured, the form shows an error with the contact email, so no inquiry is silently lost.
