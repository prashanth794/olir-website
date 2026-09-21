# Olir website

The pre-launch website for Olir, a botanical hair oil being prepared for the Australian market. It presents the current sample and collects launch interest; it is not an operational checkout.

## Edit the source

- `scripts/site-pages.mjs` — page copy and content: home, hair oil, ingredients, ritual, story, FAQs, contact, shipping/returns, privacy and the two form confirmations.
- `scripts/build-site.mjs` — shared navigation, footer, metadata and production/preview build output.
- `design.css` — the shared responsive design; `script.js` — accessible menu behaviour.
- `assets/` — website images; `scripts/security-policy.mjs` — generated browser security policy.

Edit these sources rather than generated HTML. The build writes the page HTML and a publishable `dist/` directory. Only `dist/` should be deployed; do not publish repository tools, documentation or release archives.

## Build and check

Use Node.js 22. No package installation is needed for the static build.

```sh
node scripts/build-site.mjs
node scripts/validate-site.mjs
```

For preview output:

```sh
node scripts/build-site.mjs --preview
node scripts/validate-site.mjs --preview
```

On Netlify, `CONTEXT` selects production or preview behaviour. When testing locally, unset an inherited `CONTEXT` if it would override `--preview`. Preview builds disable form controls and include `noindex`; previews are not private. Rebuild for production before manually deploying a release artifact.

Check a desktop and phone-sized browser view after layout changes, including the mobile menu, full bottle image, keyboard focus and form labels. A normal local web server does not apply Netlify response headers. See [SECURITY.md](SECURITY.md) for deployed-header and form-delivery verification.

## Deployment and forms

Production is [olir.com.au](https://olir.com.au/). The existing Netlify project's Git integration determines deployment triggers: `main` is the production branch, and enabled staging/PR builds should remain previews. Check the project's current deployment status before claiming a push is live. Publish the generated `dist/` output.

The production form names remain `olir-waitlist` and `olir-contact`. They post directly to Netlify and use separate confirmation pages. Form detection, notification recipients, delivery and service limits must be checked in the existing Netlify project; HTML validation does not verify them.

Security headers and browser restrictions are documented in [SECURITY.md](SECURITY.md), together with rollback instructions and remaining account/service responsibilities. Preserve the owner's standing instruction: **no payments, credit-card use or chargeable upgrades**.
