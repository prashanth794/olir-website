# Security and operations

Olir is a static, pre-launch website. Its public forms collect waitlist email addresses and contact enquiries through Netlify. It does not take orders, collect card details, authenticate customers or process payments. These controls reduce specific browser risks; they are not a security certification or a guarantee against compromise.

## Browser policy

`scripts/security-policy.mjs` provides the global rule for the generated `dist/_headers` file. An **enforced baseline CSP** blocks base-URL overrides, plugins, framing of Olir and cross-origin form destinations, and upgrades insecure resource requests. A separate, stricter resource policy is initially **report-only**: its violations appear in the browser console and do not block resources. No external report collector is configured.

The stricter policy allows local scripts, images, frames and form destinations, with Google Fonts as the only external stylesheet/font origins. It would also disallow inline scripts, inline style attributes, `eval`, workers and media when enforced. The menu's direct CSS property updates do not require an inline-style exception.

The hosting platform injects a required free-site badge from a same-origin script and may create frame content with inline resources. Preserve that badge. Inspect it in a deployed preview before calling `securityHeaders(preview, { enforceCsp: true })` to enable enforcement. Do not suppress required branding or add a broad inline-script exception just to clear console reports. If compatibility needs a policy adjustment, review the specific generated content and provider requirements first.

Framing is denied, MIME sniffing is disabled, referrers are restricted, and unused device capabilities are disabled where the browser supports Permissions Policy. HSTS requests HTTPS for one year on the responding hostname only: there is no `includeSubDomains` or preload opt-in. Browser support varies. Netlify applies custom headers to files it serves; future proxy, function or third-party responses need their own review. See [Netlify's custom-header documentation](https://docs.netlify.com/manage/routing/headers/) and [MDN's stylesheet policy reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/style-src).

The proposed policy has no allowance for analytics, chat widgets, external embeds or payment SDKs. Adding a feature requires reviewing its data handling and exact resource origins rather than adding a wildcard or `unsafe-inline` exception. Report-only CSP does not currently prevent those resources from loading; the site's own code includes none of them.

## Verify each release

1. Build and validate production and preview output using the commands in `README.md`.
2. Inspect the deployed document response headers, not only `dist/_headers`. Confirm both the enforced baseline `Content-Security-Policy` and the stricter `Content-Security-Policy-Report-Only` are present initially, along with `X-Frame-Options: DENY`, HSTS and the preview-only `X-Robots-Tag`. A basic local static server will not automatically apply Netlify's `_headers` rules.
3. In a real browser, check that images and fonts load, the menu opens/closes with keyboard and touch, and the required hosting badge remains functional. Inspect CSP console reports before enabling enforcement. Confirm preview fields are disabled and production fields remain usable.
4. Check that Netlify detects `olir-waitlist` and `olir-contact`. Source checks alone cannot verify accepted submissions or delivery to the owner's inbox. If sending an agreed test submission, use an address controlled by the owner and remove the test entry afterwards; never submit customer data for testing.

## Operational limits

- Staging and deploy previews can be publicly accessible. Disabled form controls and `noindex` reduce accidental submissions and indexing; they are not access controls. Do not publish secrets, private business data or real customer submissions in preview content.
- Netlify manages form processing and abuse controls. Honeypots and browser validation do not prevent every unwanted submission, and static-site code cannot provide server-side rate limits or guarantee delivery. Monitor the existing form inbox and provider usage limits.
- GitHub, Netlify, the domain registrar, DNS and the notification mailbox remain separate trust boundaries. Protect their existing accounts and recovery methods; keep credentials and form exports out of this repository. The code change does not enable account MFA, audit account permissions, change DNS or protect a compromised provider account.
- The waitlist is not an email campaign service. Update/removal requests currently use the contact form. Any future campaign needs a verified delivery and unsubscribe process. Google Fonts and hosting requests also disclose technical request information to those providers, as described in the site's privacy notice.
- There is no stock, fulfilment, customer-account or payment backend. Review those services separately before opening sales. Disabling the browser Payment Request API is not a replacement for the owner's payment restriction.
- The owner's standing instruction is **no payments and no credit-card use**. Do not purchase a plan, upgrade hosting, add billing details, activate chargeable features or buy services. Review existing quotas without changing billing settings; do not assume traffic, builds or submissions are unlimited or permanently free.

## Rollback

If a release breaks navigation, forms or asset loading, use the existing Netlify project's Deploys view to select a still-available previous known-good production deployment and publish that deployment. Record the reverted release/commit and fix the source before the next production push so automatic deployment does not reintroduce the fault. A deployment rollback does not undo received form submissions, account changes or DNS changes. See [Netlify's rollback documentation](https://docs.netlify.com/deploy/manage-deploys/manage-deploys-overview/#rollbacks).

HSTS can remain cached in visitors' browsers after a rollback; keep HTTPS valid. If HSTS itself must be withdrawn, the hostname needs to serve `Strict-Transport-Security: max-age=0` over working HTTPS. Do not remove HTTPS as a rollback measure.

## Reporting a problem

Report a suspected vulnerability privately to the repository owner through an existing verified channel. Do not include credentials, personal information or exploit details in a public issue or ordinary marketing form. No dedicated security inbox or response-time guarantee is configured by this repository.
