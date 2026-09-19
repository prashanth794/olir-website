import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const htmlFiles = readdirSync(root).filter((file) => file.endsWith('.html'));
const errors = [];

for (const file of htmlFiles) {
  const source = readFileSync(join(root, file), 'utf8');
  for (const match of source.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const reference = match[1];
    if (/^(https?:|mailto:|#|\/)/.test(reference)) continue;
    const localPath = join(root, reference.split('#')[0]);
    if (!existsSync(localPath)) errors.push(`${file}: missing local reference ${reference}`);
  }
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
