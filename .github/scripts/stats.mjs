// Builds the profile stats card (dist/stats.svg) from the GitHub API. No dependencies.
// Usage: GITHUB_TOKEN=... GH_USER=name node stats.mjs
import fs from 'node:fs';

const user = process.env.GH_USER;
const query = `query($login: String!) {
  user(login: $login) {
    contributionsCollection { totalCommitContributions totalPullRequestContributions contributionCalendar { totalContributions } }
    repositories(ownerAffiliations: OWNER, isFork: false, privacy: PUBLIC, first: 100) {
      totalCount
      nodes { languages(first: 10, orderBy: { field: SIZE, direction: DESC }) { edges { size node { name color } } } }
    }
  }
}`;
const res = await fetch('https://api.github.com/graphql', {
  method: 'POST',
  headers: { authorization: `bearer ${process.env.GITHUB_TOKEN}`, 'content-type': 'application/json', 'user-agent': 'profile-stats' },
  body: JSON.stringify({ query, variables: { login: user } }),
});
const { data, errors } = await res.json();
if (errors || !data?.user) throw new Error(JSON.stringify(errors ?? data));
const u = data.user, c = u.contributionsCollection;

const langs = new Map();
for (const r of u.repositories.nodes) for (const e of r.languages.edges) {
  const l = langs.get(e.node.name) ?? { size: 0, color: e.node.color ?? '#8a8a96' };
  l.size += e.size; langs.set(e.node.name, l);
}
const total = [...langs.values()].reduce((a, l) => a + l.size, 0) || 1;
const top = [...langs].sort((a, b) => b[1].size - a[1].size).slice(0, 6).map(([name, l]) => ({ name, color: l.color, pct: (100 * l.size) / total }));

const esc = (s) => String(s).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch]);
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";
// The 6px margin matches the project cards, so their edges line up on the page.
const CORAL = '#E88866', W = 900, H = 200;
const tiles = [
  ['Contributions', c.contributionCalendar.totalContributions, 'last year'],
  ['Commits', c.totalCommitContributions, 'last year'],
  ['Pull requests', c.totalPullRequestContributions, 'last year'],
  ['Public repos', u.repositories.totalCount, 'original'],
];
const tileSvg = tiles.map(([label, n, note], i) => {
  const x = 28 + (i % 2) * 190, y = 28 + Math.floor(i / 2) * 76;
  return `<rect x="${x}" y="${y}" width="176" height="64" rx="10" fill="#1d1d22" stroke="#2c2c33"/>
<text x="${x + 16}" y="${y + 36}" class="n">${esc(n.toLocaleString('en-US'))}</text>
<text x="${x + 16}" y="${y + 54}" class="lb">${esc(label)} · ${esc(note)}</text>`;
}).join('');
let bx = 440; const BW = 432;
const bar = top.map((l) => { const w = (l.pct / top.reduce((a, t) => a + t.pct, 0)) * BW; const s = `<rect x="${bx.toFixed(1)}" y="64" width="${w.toFixed(1)}" height="10" fill="${l.color}"/>`; bx += w; return s; }).join('');
const legend = top.map((l, i) => {
  const x = 440 + (i % 2) * 216, y = 104 + Math.floor(i / 2) * 26;
  return `<circle cx="${x + 5}" cy="${y - 4}" r="5" fill="${l.color}"/><text x="${x + 18}" y="${y}" class="lg">${esc(l.name)} <tspan class="pc">${l.pct.toFixed(1)}%</tspan></text>`;
}).join('');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W + 12}" height="${H + 12}" viewBox="-6 -6 ${W + 12} ${H + 12}" role="img" aria-label="GitHub activity: ${tiles.map(([l, n]) => `${n} ${l}`).join(', ')}. Top languages: ${top.map((l) => `${l.name} ${l.pct.toFixed(0)}%`).join(', ')}">
<style>
.n{font:800 24px ${FONT};fill:#ffffff} .lb{font:500 11.5px ${FONT};fill:#8a8a96}
.h{font:700 15px ${FONT};fill:${CORAL}} .lg{font:500 13px ${FONT};fill:#c9c9d1} .pc{fill:#8a8a96}
</style>
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="14" fill="#16161a" stroke="#2c2c33"/>
<rect x="0" y="0" width="5" height="${H}" rx="2.5" fill="${CORAL}"/>
${tileSvg}
<path d="M412 28V172" stroke="#2c2c33"/>
<text x="440" y="46" class="h">Most used languages</text>
<clipPath id="bar"><rect x="440" y="64" width="${BW}" height="10" rx="5"/></clipPath>
<g clip-path="url(#bar)">${bar}</g>
${legend}
</svg>`;
fs.mkdirSync('dist', { recursive: true });
fs.writeFileSync('dist/stats.svg', svg);
console.log('stats.svg', tiles.map(([l, n]) => `${l}=${n}`).join(' '), top.map((l) => l.name).join(','));
