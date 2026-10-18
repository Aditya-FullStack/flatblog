/**
 * Static preview build for GitHub Pages.
 *
 * A static export has no server, so two things that require one are moved out
 * of the tree for the duration of the build and restored afterwards:
 *   - src/middleware.js        (session refresh — server only)
 *   - src/app/auth/            (the OAuth callback route handler)
 *
 * Run with:  npm run build:preview
 * Output:    ./out   (served from a GitHub Pages /docs folder or gh-pages branch)
 */
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, renameSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const stash = resolve(root, '.preview-stash');
const moves = [
  ['src/middleware.js', '.preview-stash/middleware.js'],
  ['src/app/auth', '.preview-stash/auth']
];

rmSync(stash, { recursive: true, force: true });
mkdirSync(stash, { recursive: true });

const moved = [];
for (const [from, to] of moves) {
  if (existsSync(from)) {
    renameSync(from, to);
    moved.push([from, to]);
  }
}

try {
  console.log('Building static preview…');
  execSync('npx next build', {
    stdio: 'inherit',
    env: {
      ...process.env,
      STATIC_EXPORT: '1',
      PAGES_BASE_PATH: process.env.PAGES_BASE_PATH || ''
    }
  });
  console.log('\nStatic preview ready in ./out');
} finally {
  for (const [from, to] of moved) {
    if (existsSync(to)) renameSync(to, from);
  }
  rmSync(stash, { recursive: true, force: true });
}
