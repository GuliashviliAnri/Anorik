# ANORIK Studio — anorik.com

Static site (HTML/CSS/JS) on Cloudflare Pages, with one Pages Function for the contact form.

## Structure
- `index.html`, `style.css`, `app.js` — the site (EN/KA)
- `functions/api/contact.js` — `POST /api/contact`, sends form inquiries by email via Resend
- `_headers` — security and cache headers
- `robots.txt`, `sitemap.xml`, `assets/og-image.png` — search and link previews

## Contact form setup
1. Create an account at resend.com, add the domain `anorik.com` and add the DNS records it shows in Cloudflare DNS (they don't affect Email Routing).
2. Create an API key in Resend.
3. Cloudflare → Workers & Pages → the anorik project → Settings → Variables and Secrets (Production):
   - `RESEND_API_KEY` — the key (type: Secret)
   - `CONTACT_TO` — inbox that receives inquiries, e.g. `contact@anorik.com`
4. Redeploy. Replying to an inquiry email goes straight to the client (reply-to is set).

If the function isn't configured, the form shows an error with the contact email, so no inquiry is silently lost.
