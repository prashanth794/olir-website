import { mkdirSync, writeFileSync, copyFileSync, existsSync, lstatSync, rmSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pages } from './site-pages.mjs';
import { securityHeaders } from './security-policy.mjs';

// A single shared shell keeps every page consistent. No runtime dependencies.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(root, 'dist');
const preview = process.env.CONTEXT ? process.env.CONTEXT !== 'production' : process.argv.includes('--preview');
const version = 'olir-20260920-04';
const primary = [['product', 'Hair oil'], ['ingredients', 'Ingredients'], ['about', 'Our story']];
const support = [['ritual', 'The ritual'], ['faq', 'FAQs'], ['contact', 'Contact'], ['shipping-returns', 'Shipping & returns'], ['privacy', 'Privacy']];
const link = ([slug, label], current) => `<a href="${slug}.html"${slug === current ? ' aria-current="page"' : ''}>${label}</a>`;
const arrow = '<span aria-hidden="true">↗</span>';
function header(current) {
  return `<a class="skip-link" href="#main">Skip to content</a>
  <div class="announcement"><span>A new chapter in botanical hair care.</span><a href="product.html#waitlist">Coming soon ${arrow}</a></div>
  <header class="site-header">
    <nav class="desktop-nav" aria-label="Primary navigation">${primary.map(item => link(item, current)).join('')}</nav>
    <a class="wordmark" href="index.html" aria-label="Olir home">olir<span class="wordmark-dot" aria-hidden="true">.</span></a>
    <div class="header-end"><nav class="desktop-nav" aria-label="More from Olir">${support.slice(0,1).map(item=>link(item,current)).join('')}${support.slice(2,3).map(item=>link(item,current)).join('')}</nav><a class="header-invite" href="product.html#waitlist">Join the list ${arrow}</a><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-menu" aria-label="Open menu"><span></span><span></span></button></div>
  </header>
  <dialog id="site-menu" class="site-menu" aria-labelledby="menu-title">
    <div class="menu-head"><span id="menu-title" class="eyebrow">The world of Olir</span><button type="button" class="icon-button" data-close-menu aria-label="Close menu">×</button></div>
    <nav class="menu-primary" aria-label="Mobile navigation"><a href="index.html">Home</a>${primary.map(item=>link(item,current)).join('')}${link(support[0],current)}</nav>
    <nav class="menu-support" aria-label="Customer care">${support.slice(1).map(item=>link(item,current)).join('')}</nav><a href="product.html#waitlist" class="button">Join the first release ${arrow}</a>
  </dialog>`;
}
function footer(current) {
  return `<footer class="site-footer"><div class="footer-top"><div class="footer-intro"><a class="wordmark" href="index.html" aria-label="Olir home">olir<span class="wordmark-dot" aria-hidden="true">.</span></a><p>A little space for care.<br>From scalp to strands.</p></div><div><h2 class="eyebrow">Discover</h2>${primary.map(item=>link(item,current)).join('')}${link(support[0],current)}</div><div><h2 class="eyebrow">Here to help</h2>${support.slice(1,4).map(item=>link(item,current)).join('')}<a href="privacy.html">Privacy</a></div><div class="footer-note"><h2 class="eyebrow">Our first chapter</h2><p>Meet the hair oil.<br>Follow its beginning.</p><a class="text-link" href="product.html#waitlist">Join the first release ${arrow}</a></div></div><div class="footer-bottom"><span>© 2026 Olir · Botanical hair care</span><span>Made for your everyday.</span><a href="privacy.html">Your privacy matters</a></div></footer>`;
}
function document(page, isPreview) {
  const slug = page.slug;
  const canonical = `https://olir.com.au/${slug === 'index' ? '' : slug}`;
  let content = page.body;
  if (isPreview) {
    // Preview forms cannot add test entries to the live waitlist/contact inbox.
    content = content.replace(/ data-netlify="true"/g, '').replace(/<form\b([^>]*)>/g, '<form$1 data-preview-form="true"><p class="preview-form-note">Preview mode — submissions are disabled. <a href="https://olir.com.au/">Visit the live site</a>.</p><fieldset disabled>').replace(/<\/form>/g, '</fieldset></form>');
  }
  const html = `<!doctype html>
<html lang="en-AU">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${page.title}</title>
  <meta name="description" content="${page.description}">
  <meta name="theme-color" content="#233b30">
  <meta name="google-site-verification" content="YOUR_SEARCH_CONSOLE_VERIFICATION_CODE_HERE">
  <link rel="canonical" href="${canonical}">
  <meta property="og:title" content="${page.title}">
  <meta property="og:description" content="${page.description}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="https://olir.com.au/assets/olir-bottle.webp">
  <meta property="og:image:alt" content="The Olir sample hair oil bottle, styled with botanicals">
  <meta name="twitter:card" content="summary_large_image">
  ${isPreview || page.noindex ? '<meta name="robots" content="noindex, nofollow">' : ''}
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="design.css?v=${version}">
  <script src="script.js?v=${version}" defer></script>
</head>
<body class="page-${slug}${isPreview ? ' is-preview' : ''}">
${isPreview ? '<div class="preview-banner">Olir design preview · Forms are disabled</div>' : ''}
${header(slug)}
<main id="main" tabindex="-1">${content}</main>
${footer(slug)}
</body>
</html>
`;
  // A 404 can be served at any nested URL; its local links must resolve from root.
  return slug === '404' ? html.replace(/\b(href|src|srcset)="(?!https?:|#|\/)([^"]+)"/g, '$1="/$2"') : html;
}

// dist is disposable build output. Never publish stale cache files or metadata.
// Refuse a symlink so cleaning this exact generated directory cannot follow one.
if (existsSync(out) && lstatSync(out).isSymbolicLink()) throw new Error('Publish directory must not be a symlink');
rmSync(out, { recursive: true, force: true });
mkdirSync(resolve(out, 'assets'), { recursive: true });
for (const page of pages) {
  writeFileSync(resolve(root, `${page.slug}.html`), document(page, false));
  writeFileSync(resolve(out, `${page.slug}.html`), document(page, preview));
}
for (const file of ['design.css', 'script.js', 'favicon.svg', 'assets/olir-hair.webp', 'assets/olir-hair-mobile.webp', 'assets/olir-bottle.webp', 'assets/olir-mortar-ritual.webp', 'assets/olir-mortar-ritual-mobile.webp', 'assets/olir-botanical-nature.webp', 'assets/olir-botanical-nature-mobile.webp']) {
  if (!existsSync(resolve(root, file))) throw new Error(`Missing publish asset: ${file}`);
  copyFileSync(resolve(root, file), resolve(out, file));
}
writeFileSync(resolve(out, '_headers'), securityHeaders(preview) + '\n/assets/*\n  Cache-Control: public, max-age=86400\n');
writeFileSync(resolve(out, 'robots.txt'), preview ? 'User-agent: *\nDisallow: /\n' : 'User-agent: *\nAllow: /\nSitemap: https://olir.com.au/sitemap.xml\n');
writeFileSync(resolve(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.filter(p=>!p.noindex).map(p=>`<url><loc>https://olir.com.au/${p.slug==='index'?'':p.slug}</loc></url>`).join('')}</urlset>`);
console.log(`Built ${pages.length} pages for ${preview ? 'preview (forms disabled, noindex)' : 'production'}. Publish directory: dist/`);
