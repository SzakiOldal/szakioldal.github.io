// Checks that every internal href/src (relative paths and #fragments)
// in the repo actually resolves to a real file or a real element id.
// Skips external links (http/https/mailto/tel/sms) entirely.
import { readFileSync, existsSync, globSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function isExternal(url) {
  return /^(https?:)?\/\//.test(url) || /^(mailto|tel|sms|data|javascript):/.test(url);
}

function getIds(html) {
  const ids = new Set();
  const re = /\bid="([^"]+)"/g;
  let m;
  while ((m = re.exec(html))) ids.add(m[1]);
  return ids;
}

function main() {
  const files = [
    ...globSync('*.html', { cwd: root }),
    ...globSync('demo-*/index.html', { cwd: root }),
  ];
  let problems = 0;

  for (const rel of files) {
    const file = path.join(root, rel);
    const html = readFileSync(file, 'utf-8');
    const ids = getIds(html);
    const dir = path.dirname(file);

    const attrRe = /\b(?:href|src)="([^"]+)"/g;
    let m;
    while ((m = attrRe.exec(html))) {
      const raw = m[1];
      if (!raw || raw === '#' || isExternal(raw)) continue;

      const [pathPart, fragment] = raw.split('#');

      if (pathPart) {
        const target = pathPart.startsWith('/')
          ? path.join(root, pathPart.slice(1))
          : path.join(dir, pathPart);
        if (!existsSync(target)) {
          console.error(`✖ ${rel}: "${raw}" -> missing file ${path.relative(root, target)}`);
          problems++;
          continue;
        }
      }

      // Only verify the fragment against THIS document's own ids when the
      // link points at the current page (no path part, or same file).
      if (fragment && !pathPart) {
        if (!ids.has(fragment)) {
          console.error(`✖ ${rel}: "${raw}" -> no element with id="${fragment}" on this page`);
          problems++;
        }
      }
    }
  }

  if (problems > 0) {
    console.error(`\n${problems} broken internal link(s) found.`);
    process.exit(1);
  }
  console.log('All internal links resolve to a real file and/or a real element id.');
}

main();
