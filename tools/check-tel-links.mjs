// Checks every tel: link in the repo: (1) is it a valid +36 E.164 number,
// and (2) if the link's own visible text also looks like a phone number,
// does it match the number in the href? This is exactly the class of bug
// that shipped to production once (tel:+30... vs the displayed +36 number).
import { readFileSync, globSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const E164_HU = /^\+36[1-9]\d{7,8}$/;

function normalizeDigits(s) {
  const d = (s || '').replace(/[^\d+]/g, '');
  if (d.startsWith('0036')) return '+36' + d.slice(4);
  if (d.startsWith('+36')) return d;
  if (d.startsWith('06')) return '+36' + d.slice(2);
  if (d.startsWith('36')) return '+' + d;
  return d;
}

function main() {
  const files = [
    ...globSync('*.html', { cwd: root }),
    ...globSync('demo-*/index.html', { cwd: root }),
  ].map((f) => path.join(root, f));
  let problems = 0;

  for (const file of files) {
    const html = readFileSync(file, 'utf-8');
    const anchorRe = /<a\b[^>]*href="tel:([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
    let m;
    while ((m = anchorRe.exec(html))) {
      const hrefNum = m[1];
      const text = m[2].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
      const rel = path.relative(root, file);

      if (!E164_HU.test(hrefNum)) {
        console.error(`✖ ${rel}: tel: href "${hrefNum}" is not a valid +36 E.164 number`);
        problems++;
        continue;
      }

      // Only compare against the visible text if it actually looks like a
      // phone number (digits make up most of it) — CTA labels like
      // "Hívjon most" are not phone numbers and shouldn't be compared.
      const digitCount = (text.match(/\d/g) || []).length;
      if (digitCount >= 7) {
        const shown = normalizeDigits(text);
        if (shown !== hrefNum) {
          console.error(
            `✖ ${rel}: tel:${hrefNum} but the link text reads "${text}" (normalizes to ${shown})`
          );
          problems++;
        }
      }
    }
  }

  if (problems > 0) {
    console.error(`\n${problems} tel: link problem(s) found.`);
    process.exit(1);
  }
  console.log('All tel: links are valid +36 numbers and match their displayed text.');
}

main();
