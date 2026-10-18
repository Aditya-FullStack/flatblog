import { spawn, execSync } from 'node:child_process';
import { mkdirSync, rmSync, symlinkSync } from 'node:fs';
import puppeteer from 'puppeteer-core';

const PORT = 4330;
const root = '/scratch/work/serve';
rmSync(root, { recursive: true, force: true });
mkdirSync(root, { recursive: true });
symlinkSync('/scratch/work/flatblog/out', `${root}/flatblog`);

const srv = spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1', '--directory', root], { stdio: 'ignore' });
const exe = execSync('which chromium').toString().trim();
const base = `http://127.0.0.1:${PORT}/flatblog`;

const shots = [
  { path: '/', name: 'p-home', full: false },
  { path: '/post/supabase-auth-in-fifteen-minutes/', name: 'p-post', full: false },
  { path: '/login/', name: 'p-login', full: false },
  { path: '/dashboard/', name: 'p-dash', full: false }
];

let b;
try {
  await new Promise(r => setTimeout(r, 1500));
  b = await puppeteer.launch({ executablePath: exe, headless: true, args: ['--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--single-process'] });
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 960 });
  const errs = [];
  p.on('requestfailed', r => errs.push(r.url()));
  for (const s of shots) {
    await p.goto(base + s.path, { waitUntil: 'networkidle2', timeout: 20000 });
    await new Promise(r => setTimeout(r, 600));
    const title = await p.title();
    const hasCss = await p.evaluate(() => {
      const el = document.querySelector('.brand__mark');
      if (!el) return 'NO-BRAND';
      return getComputedStyle(el).backgroundColor;
    });
    await p.screenshot({ path: `/scratch/work/shots/${s.name}.png`, fullPage: s.full });
    console.log(`${s.path}  title="${title}"  brand-bg=${hasCss}`);
  }
  console.log('FAILED REQUESTS:', errs.length ? errs.slice(0,5).join(', ') : 'none');
} catch (e) { console.log('ERROR', e.message); }
finally { if (b) await b.close(); srv.kill('SIGKILL'); }
process.exit(0);
