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

The production site is published on Netlify at [olir.com.au](https://olir.com.au). The current site is manually deployed from the release zip. Once this repository is connected to Netlify, pushes to `main` can be configured to deploy automatically.
