#!/usr/bin/env python3
"""Builds the SEO head for index.html (English) and generates ka/index.html (Georgian).

index.html is the source of truth for page content. Every translatable element
carries data-en and data-ka; this script writes the Georgian text into ka/index.html
so search engines can index the Georgian page without running JavaScript.

Run after editing index.html:  python3 tools/build.py
"""
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://anorik.com"
PHONE = "+995 574 24 02 86"
LINKEDIN = "https://www.linkedin.com/in/anri-guliashvili-5b4673323/"

META = {
    "en": {
        "url": f"{SITE}/",
        "title": "ANORIK Studio | Websites That Bring Customers, Tbilisi",
        "description": "Websites, online stores and business systems built to bring calls, messages, visits and orders. For businesses of every type. Get a free website review. Tbilisi, working worldwide.",
        "og_title": "ANORIK Studio | Websites that bring customers to your business",
        "og_description": "Websites and marketing that bring customers, for businesses of every type. Get a free review of your website.",
        "locale": "en_US",
        "alt_locale": "ka_GE",
    },
    "ka": {
        "url": f"{SITE}/ka/",
        "title": "ვებსაიტის დამზადება თბილისში | ANORIK Studio",
        "description": "ვებსაიტები, ონლაინ მაღაზიები და ბიზნესსისტემები, რომლებიც ზარებს, მესიჯებს, ვიზიტებსა და შეკვეთებს მოიტანს, ყველა ტიპის ბიზნესისთვის. მიიღე საიტის უფასო აუდიტი.",
        "og_title": "ANORIK Studio | საიტები, რომლებიც ბიზნესს მომხმარებლებს მოუყვანს",
        "og_description": "საიტები და მარკეტინგი, რომლებიც მომხმარებელს მოიყვანს, ყველა ტიპის ბიზნესისთვის. მიიღე საიტის უფასო აუდიტი.",
        "locale": "ka_GE",
        "alt_locale": "en_US",
    },
}

SERVICES = {
    "en": ["Website design and development", "Online stores", "Launch and marketing setup", "Business systems and admin panels", "AI agents and business automation", "Website maintenance and improvements"],
    "ka": ["ვებსაიტის დიზაინი და დეველოპმენტი", "ონლაინ მაღაზიები", "გაშვება და მარკეტინგი", "ბიზნესსისტემები და ადმინპანელები", "AI აგენტები და ბიზნესის ავტომატიზაცია", "ვებსაიტის მოვლა და გაუმჯობესება"],
}

FONTS = ("https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700"
         "&family=Hanken+Grotesk:wght@400;500;600&family=Inter:wght@500;600&family=Cinzel+Decorative:wght@700"
         "&family=Marcellus&family=Cormorant+SC:wght@600&family=Forum&family=Prata&family=Cinzel:wght@500&display=swap")


def schema(lang):
    m = META[lang]
    data = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "ProfessionalService",
                "@id": f"{SITE}/#studio",
                "name": "ANORIK Studio",
                "url": m["url"],
                "logo": f"{SITE}/assets/favicon-180.png",
                "image": f"{SITE}/assets/og-image.png",
                "description": m["description"],
                "email": "contact@anorik.com",
                "telephone": PHONE,
                "address": {"@type": "PostalAddress", "addressLocality": "Tbilisi", "addressCountry": "GE"},
                "areaServed": [{"@type": "Country", "name": "Georgia"}, "Worldwide"],
                "knowsLanguage": ["en", "ka"],
                "founder": {"@type": "Person", "name": "Anri Guliashvili", "sameAs": LINKEDIN},
                "sameAs": [LINKEDIN],
                "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": "Services" if lang == "en" else "სერვისები",
                    "itemListElement": [{"@type": "Offer", "itemOffered": {"@type": "Service", "name": s}} for s in SERVICES[lang]],
                },
            },
            {
                "@type": "WebSite",
                "@id": f"{SITE}/#website",
                "url": f"{SITE}/",
                "name": "ANORIK Studio",
                "inLanguage": ["en", "ka"],
                "publisher": {"@id": f"{SITE}/#studio"},
            },
        ],
    }
    return json.dumps(data, ensure_ascii=False, separators=(",", ":"))


def head(lang, prefix):
    m = META[lang]
    e = lambda s: html.escape(s, quote=True)
    return f"""<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#f2f1ee">
<title>{e(m['title'])}</title>
<meta name="description" content="{e(m['description'])}">
<link rel="canonical" href="{m['url']}">
<link rel="alternate" hreflang="en" href="{SITE}/"><link rel="alternate" hreflang="ka" href="{SITE}/ka/"><link rel="alternate" hreflang="x-default" href="{SITE}/">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta property="og:type" content="website"><meta property="og:site_name" content="ANORIK Studio"><meta property="og:url" content="{m['url']}"><meta property="og:title" content="{e(m['og_title'])}"><meta property="og:description" content="{e(m['og_description'])}"><meta property="og:image" content="{SITE}/assets/og-image.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="ANORIK Studio"><meta property="og:locale" content="{m['locale']}"><meta property="og:locale:alternate" content="{m['alt_locale']}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{e(m['og_title'])}"><meta name="twitter:description" content="{e(m['og_description'])}"><meta name="twitter:image" content="{SITE}/assets/og-image.png">
<script type="application/ld+json">{schema(lang)}</script>
<link rel="icon" href="{prefix}assets/favicon.svg?v=3" type="image/svg+xml"><link rel="apple-touch-icon" href="{prefix}assets/favicon-180.png?v=3">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="{FONTS}"><link rel="stylesheet" href="{prefix}style.css"></head>"""


LEAF = re.compile(r'<(\w+)([^<>]*?)\sdata-en="([^"]*)" data-ka="([^"]*)"([^<>]*)>(.*?)</\1>', re.S)


def to_georgian(page):
    def swap(m):
        tag, before, en, ka, after, _inner = m.groups()
        return f'<{tag}{before} data-en="{en}" data-ka="{ka}"{after}>{html.unescape(ka)}</{tag}>'
    page = LEAF.sub(swap, page)
    page = re.sub(r'data-placeholder-ka="([^"]*)"', lambda m: m.group(0) + f' placeholder="{m.group(1)}"', page)
    return page


def main():
    src = (ROOT / "index.html").read_text(encoding="utf-8")
    body = src[src.index("</head>") + len("</head>"):]
    body = re.sub(r'\splaceholder="[^"]*"(?=[^<>]*data-placeholder-ka)', "", body)

    body = body.replace(' aria-current="true"', '')
    en_body = re.sub(r'data-placeholder-en="([^"]*)"', lambda m: m.group(0) + f' placeholder="{m.group(1)}"', body)
    en_body = en_body.replace('data-language-button="en"', 'data-language-button="en" aria-current="true"')
    (ROOT / "index.html").write_text('<!doctype html>\n<html lang="en">' + head("en", "") + en_body, encoding="utf-8")

    ka_body = to_georgian(body)
    ka_body = ka_body.replace('data-language="en" lang="en"', 'data-language="ka" lang="ka"', 1)
    ka_body = re.sub(r'(src|href)="assets/', r'\1="/assets/', ka_body)
    ka_body = ka_body.replace('src="app.js"', 'src="/app.js"')
    ka_body = ka_body.replace('data-language-button="ka"', 'data-language-button="ka" aria-current="true"')
    (ROOT / "ka").mkdir(exist_ok=True)
    (ROOT / "ka" / "index.html").write_text('<!doctype html>\n<html lang="ka">' + head("ka", "/") + ka_body, encoding="utf-8")
    print("built index.html and ka/index.html")


if __name__ == "__main__":
    main()
