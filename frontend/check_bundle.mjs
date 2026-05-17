// Full end-to-end check of pmddproject.vercel.app
async function check(label, url, opts = {}) {
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(15000), ...opts });
    const text = await r.text();
    console.log(`[${r.status}] ${label}`);
    console.log(`  → ${text.substring(0, 140)}\n`);
    return { status: r.status, text };
  } catch(e) {
    console.log(`[ERR] ${label}: ${e.message}\n`);
    return null;
  }
}

(async () => {
  // Frontend check
  const idx = await check('Frontend index.html', 'https://pmddproject.vercel.app');
  if (idx) {
    const bundle = idx.text.match(/src="\.\/assets\/(index-[^"]+\.js)"/)?.[1];
    console.log(`  Bundle: ${bundle || 'NOT FOUND in HTML'}\n`);
  }

  // API health
  await check('API /api/health', 'https://pmddproject.vercel.app/api/health');

  // API analyze (short test)
  await check('API /api/analyze', 'https://pmddproject.vercel.app/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: 'The directive must be followed immediately.' })
  });
})();
