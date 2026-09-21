import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(process.cwd(), 'dist');
const preview = process.env.CONTEXT ? process.env.CONTEXT !== 'production' : process.argv.includes('--preview');
const htmlFiles = readdirSync(root).filter((file) => file.endsWith('.html'));
const errors = [];

for (const file of htmlFiles) {
  const source = readFileSync(join(root, file), 'utf8');
  for (const match of source.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const reference = match[1];
    if (/^(https?:|mailto:|#)/.test(reference)) continue;
    const localPath = join(root, reference.split(/[?#]/)[0].replace(/^\//, ''));
    if (!existsSync(localPath)) errors.push(`${file}: missing local reference ${reference}`);
  }
  if (!source.includes('lang="en-AU"')) errors.push(`${file}: missing Australian language tag`);
  if ((source.match(/<h1\b/g) || []).length !== 1) errors.push(`${file}: expected exactly one h1`);
  if (preview && !source.includes('noindex, nofollow')) errors.push(`${file}: preview must not be indexed`);
  for (const form of source.matchAll(/<form\b[\s\S]*?<\/form>/g)) {
    if (!form[0].includes('name="form-name"')) errors.push(`${file}: form name missing`);
    if (!form[0].includes('name="bot-field"')) errors.push(`${file}: spam honeypot missing`);
    if (preview && (!form[0].includes('<fieldset disabled>') || form[0].includes('data-netlify="true"'))) errors.push(`${file}: preview form not isolated`);
    if (!preview && !form[0].includes('data-netlify="true"')) errors.push(`${file}: production form not registered`);
  }
}

if (htmlFiles.length !== 12) errors.push(`Expected 12 pages, found ${htmlFiles.length}`);
for (const required of ['design.css', 'script.js', 'favicon.svg', '_headers', 'robots.txt', 'sitemap.xml']) {
  if (!existsSync(join(root, required))) errors.push(`Missing publish file ${required}`);
}
const headers = readFileSync(join(root, '_headers'), 'utf8');
for (const required of ['Content-Security-Policy:', "form-action 'self'", "frame-ancestors 'none'", 'X-Frame-Options: DENY', 'X-Content-Type-Options: nosniff', 'Permissions-Policy:', 'Strict-Transport-Security: max-age=31536000']) {
  if (!headers.includes(required)) errors.push(`Missing security policy: ${required}`);
}
if (preview !== headers.includes('X-Robots-Tag: noindex, nofollow')) errors.push('Incorrect environment indexing policy');
for (const forbidden of ['.git', '.github', 'scripts', 'README.md', 'netlify.toml', 'OLIR-LINKS.md']) {
  if (existsSync(join(root, forbidden))) errors.push(`Internal file exposed: ${forbidden}`);
}

for (const formName of ['olir-waitlist', 'olir-contact']) {
  const found = htmlFiles.some((file) => readFileSync(join(root, file), 'utf8').includes(`name="${formName}"`));
  if (!found) errors.push(`Missing ${formName} Netlify form`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Validated ${htmlFiles.length} HTML pages and their local references.`);
