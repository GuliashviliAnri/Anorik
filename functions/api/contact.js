// Cloudflare Pages Function: POST /api/contact
// Sends the project inquiry from the website form to the studio inbox via Resend.
//
// Required environment variables (Cloudflare → Pages project → Settings → Variables and Secrets):
//   RESEND_API_KEY  — secret, from resend.com (domain anorik.com must be verified there)
//   CONTACT_TO      — where inquiries are delivered, e.g. contact@anorik.com
// Optional:
//   CONTACT_FROM    — defaults to "ANORIK Studio <contact@anorik.com>"

const ALLOWED_ORIGINS = ['https://anorik.com', 'https://www.anorik.com'];

const KINDS = new Set(['New website', 'Redesign', 'Business system', 'Automation', 'Maintenance & support']);
const FEATURES = new Set(['Product catalog', 'Admin panel', 'Integrations']);

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

const clean = (value, max) => String(value ?? '').replace(/\r/g, '').trim().slice(0, max);

const escapeHtml = (s) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function originAllowed(request) {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  // Cloudflare Pages preview deployments
  try {
    return new URL(origin).hostname.endsWith('.pages.dev');
  } catch {
    return false;
  }
}

export async function onRequestPost({ request, env }) {
  if (!originAllowed(request)) return json({ ok: false, error: 'forbidden' }, 403);
  if (!env.RESEND_API_KEY || !env.CONTACT_TO) return json({ ok: false, error: 'not_configured' }, 503);

  let data;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: 'bad_request' }, 400);
  }

  // Honeypot: real visitors never see or fill this field.
  if (clean(data.website, 200)) return json({ ok: true });

  const name = clean(data.name, 120);
  const email = clean(data.email, 200);
  const message = clean(data.message, 5000);
  const kind = KINDS.has(data.kind) ? data.kind : 'Not specified';
  const features = Array.isArray(data.features) ? data.features.filter((f) => FEATURES.has(f)) : [];
  const language = data.language === 'ka' ? 'Georgian' : 'English';

  if (!name || message.length < 10 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return json({ ok: false, error: 'invalid' }, 422);
  }

  const lines = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Project: ${kind}`,
    `Features: ${features.length ? features.join(', ') : '—'}`,
    `Site language: ${language}`,
    '',
    message,
  ];

  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#233026">
<h2 style="font-size:18px;margin:0 0 12px">New project inquiry</h2>
<table cellpadding="4" style="border-collapse:collapse">
<tr><td><b>Name</b></td><td>${escapeHtml(name)}</td></tr>
<tr><td><b>Email</b></td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
<tr><td><b>Project</b></td><td>${escapeHtml(kind)}</td></tr>
<tr><td><b>Features</b></td><td>${escapeHtml(features.join(', ') || '—')}</td></tr>
<tr><td><b>Site language</b></td><td>${language}</td></tr>
</table>
<p style="white-space:pre-wrap;border-top:1px solid #e0e7d9;padding-top:12px">${escapeHtml(message)}</p>
</div>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: env.CONTACT_FROM || 'ANORIK Studio <contact@anorik.com>',
      to: [env.CONTACT_TO],
      reply_to: email,
      subject: `New inquiry: ${kind} — ${name}`,
      text: lines.join('\n'),
      html,
    }),
  });

  if (!res.ok) {
    console.error('Resend error', res.status, await res.text());
    return json({ ok: false, error: 'send_failed' }, 502);
  }
  return json({ ok: true });
}

export function onRequest() {
  return json({ ok: false, error: 'method_not_allowed' }, 405);
}
