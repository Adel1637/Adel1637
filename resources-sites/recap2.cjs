const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 1000 }, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36', locale: 'en-US' });
  for (const [id, url] of [['tabler', 'https://tabler.io/icons'], ['nngroup', 'https://www.nngroup.com/articles/'], ['phosphor', 'https://phosphoricons.com']]) {
    const p = await ctx.newPage(); await p.goto(url, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4500);
    for (const name of ['Not now', 'Close', 'Accept', 'Accept all', 'OK', 'Dismiss']) { const bt = p.getByRole('button', { name, exact: true }); if (await bt.count()) await bt.first().click({ timeout: 1500 }).catch(() => {}); const l = p.getByText(name, { exact: true }); if (await l.count()) await l.first().click({ timeout: 1000 }).catch(() => {}); }
    await p.keyboard.press('Escape'); await p.waitForTimeout(800);
    await p.evaluate(() => { document.querySelectorAll('[role=dialog], [aria-modal=true], .modal, [class*=cookie], [id*=cookie], [class*=popup], [class*=toast]').forEach((e) => { const r = e.getBoundingClientRect(); if (r.width < 900) e.remove(); }); });
    await p.waitForTimeout(400);
    await p.screenshot({ path: `resources-sites/shots/${id}.jpg`, type: 'jpeg', quality: 86 }); await p.close();
  }
  await b.close();
})();
