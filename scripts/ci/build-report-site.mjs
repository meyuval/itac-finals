// Builds the public GitHub Pages site from the Playwright HTML report of the current run.
// Usage (CI): node scripts/ci/build-report-site.mjs <site-dir>
// - copies playwright-report/ to <site>/runs/<run_number>/ and stamps it with run metadata
// - writes <site>/runs/<run_number>/run.json
// - regenerates <site>/index.html listing every published run (newest first)
// Infrastructure-only: no test or product knowledge lives here.
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const siteDir = path.resolve(process.argv[2] ?? 'site');
const reportDir = path.resolve('playwright-report');
const env = process.env;

const runNumber = env.GITHUB_RUN_NUMBER ?? 'local';
const sha = env.GITHUB_SHA ?? 'unknown';
const repository = env.GITHUB_REPOSITORY ?? 'local/repo';
const runUrl = env.RUN_URL ?? '';
const conclusion = env.RUN_CONCLUSION ?? 'unknown';
const finishedAt = new Date().toISOString();

const stats = readStats(path.resolve('test-results', 'results.json'));
const runDir = path.join(siteDir, 'runs', String(runNumber));

rmSync(runDir, { recursive: true, force: true });
mkdirSync(runDir, { recursive: true });
cpSync(reportDir, runDir, { recursive: true });
if (conclusion !== 'success') {
  // Failed runs keep traces/screenshots only in the login-protected Actions artifact.
  rmSync(path.join(runDir, 'data'), { recursive: true, force: true });
}

const meta = { runNumber, sha, repository, runUrl, conclusion, finishedAt, ...stats };
writeFileSync(path.join(runDir, 'run.json'), JSON.stringify(meta, null, 2));
stampReport(path.join(runDir, 'index.html'), meta);

const runs = readdirSync(path.join(siteDir, 'runs'), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => readJson(path.join(siteDir, 'runs', entry.name, 'run.json')))
  .filter(Boolean)
  .sort((a, b) => Number(b.runNumber) - Number(a.runNumber));

writeFileSync(path.join(siteDir, 'index.html'), renderIndex(runs));
writeFileSync(path.join(siteDir, '.nojekyll'), '');
console.log(`Published run ${runNumber} (${conclusion}); ${runs.length} run(s) listed.`);

function readStats(file) {
  if (!existsSync(file)) return {};
  try {
    const json = JSON.parse(readFileSync(file, 'utf8'));
    const s = json.stats ?? {};
    return {
      expected: s.expected ?? 0,
      unexpected: s.unexpected ?? 0,
      flaky: s.flaky ?? 0,
      skipped: s.skipped ?? 0,
      durationMs: Math.round(s.duration ?? 0),
      startTime: s.startTime ?? null,
    };
  } catch {
    return {};
  }
}

function readJson(file) {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
}

function stampReport(indexHtml, m) {
  if (!existsSync(indexHtml)) return;
  const banner =
    `<div id="run-stamp" style="position:sticky;top:0;z-index:9999;background:#111;color:#eee;font:13px/1.4 system-ui;padding:6px 12px">` +
    `${escapeHtml(m.repository)} · run #${escapeHtml(m.runNumber)} · commit <code>${escapeHtml(m.sha)}</code> · ` +
    `result: <strong>${escapeHtml(m.conclusion)}</strong> · finished ${escapeHtml(m.finishedAt)}` +
    (m.runUrl ? ` · <a style="color:#9cf" href="${escapeHtml(m.runUrl)}">GitHub Actions run</a>` : '') +
    ` · <a style="color:#9cf" href="../../">all runs</a></div>`;
  const html = readFileSync(indexHtml, 'utf8').replace(/<body[^>]*>/i, (tag) => `${tag}${banner}`);
  writeFileSync(indexHtml, html);
}

function renderIndex(list) {
  const rows = list
    .map(
      (r) =>
        `<tr><td><a href="runs/${escapeHtml(r.runNumber)}/">#${escapeHtml(r.runNumber)}</a></td>` +
        `<td class="${r.conclusion === 'success' ? 'ok' : 'bad'}">${escapeHtml(r.conclusion)}</td>` +
        `<td><code>${escapeHtml(String(r.sha).slice(0, 12))}</code></td>` +
        `<td>${r.expected ?? ''}</td><td>${r.unexpected ?? ''}</td><td>${r.flaky ?? ''}</td><td>${r.skipped ?? ''}</td>` +
        `<td>${r.durationMs ? (r.durationMs / 1000).toFixed(0) + ' s' : ''}</td>` +
        `<td>${escapeHtml(r.finishedAt ?? '')}</td>` +
        `<td>${r.runUrl ? `<a href="${escapeHtml(r.runUrl)}">run</a>` : ''}</td></tr>`,
    )
    .join('\n');
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><title>Stonewake Playwright reports</title>
<style>body{font:15px/1.5 system-ui;margin:2rem;max-width:1100px}table{border-collapse:collapse;width:100%}
td,th{border-bottom:1px solid #ddd;padding:6px 8px;text-align:left}.ok{color:#0a7d2c;font-weight:600}.bad{color:#b00020;font-weight:600}</style></head>
<body><h1>Stonewake Playwright reports</h1>
<p>Each row is one GitHub Actions run of the full suite with <strong>retries = 0</strong>. Columns: passed / failed / flaky / skipped.</p>
<table><thead><tr><th>Run</th><th>Result</th><th>Commit</th><th>Passed</th><th>Failed</th><th>Flaky</th><th>Skipped</th><th>Duration</th><th>Finished (UTC)</th><th>Actions</th></tr></thead>
<tbody>
${rows}
</tbody></table></body></html>
`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}
