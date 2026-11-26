// Captures the public home pages of the resource sites (real examples). Output: resources-sites/shots/<id>.jpg
const { chromium } = require('playwright');
(async () => {
const SITES = {
  figma: 'https://www.figma.com/community', untitled: 'https://www.untitledui.com', material: 'https://m3.material.io', mobbin: 'https://mobbin.com', collectui: 'https://collectui.com',
  lucide: 'https://lucide.dev/icons/', phosphor: 'https://phosphoricons.com', heroicons: 'https://heroicons.com', tabler: 'https://tabler.io/icons', undraw: 'https://undraw.co/illustrations',
  unsplash: 'https://unsplash.com', pexels: 'https://www.pexels.com', gfonts: 'https://fonts.google.com', fontshare: 'https://www.fontshare.com', nngroup: 'https://www.nngroup.com/articles/',
  penpot: 'https://penpot.app', lunacy: 'https://icons8.com/lunacy', figmalearn: 'https://help.figma.com/hc/en-us/sections/30880632542743-Figma-Design-for-beginners',
};
const only = process.argv.slice(2);
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36', locale: 'en-US' });
for (const [id, url] of Object.entries(SITES)) {
  if (only.length && !only.includes(id)) continue;
  const p = await ctx.newPage();
  try {
    const r = await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await p.waitForTimeout(4500);
    for (const t of ['Accept all', 'Accept', 'Allow all', 'I agree', 'Got it', 'Accept All Cookies', 'Agree']) { const btn = p.getByRole('button', { name: t, exact: true }); if (await btn.count()) { await btn.first().click({ timeout: 1500 }).catch(() => {}); await p.waitForTimeout(600); break; } }
    await p.screenshot({ path: `resources-sites/shots/${id}.jpg`, type: 'jpeg', quality: 86 });
    console.log(id, r && r.status());
  } catch (e) { console.log(id, 'FAIL', e.message.slice(0, 80)); }
  await p.close();
}
await b.close();
})();
