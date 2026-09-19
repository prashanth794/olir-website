# Olir website

The pre-launch website for Olir, an Australian natural hair oil ritual.

## Pages

- `index.html` — home and waitlist
- `product.html` — first product release
- `ingredients.html` — botanical ingredient story
- `ritual.html` — ritual guide
- `about.html` — brand story
- `faq.html`, `contact.html`, `shipping-returns.html`, `privacy.html` — customer care

## Local checks

Run `node scripts/validate-site.mjs` to ensure internal HTML links and local assets resolve, and that Netlify forms are configured.

## Deployment

The production site is published on [olir.com.au](https://olir.com.au). GitHub Actions checks every pull request and push to `main`.
