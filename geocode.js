// Looks up a birthplace through OpenStreetMap Nominatim so visitors' browsers never contact it directly.
// Sends only the place text. Results are cached for 30 days. Optional variable: CONTACT_EMAIL (identifies this site to Nominatim).
const json = (d, s = 200, h = {}) => new Response(JSON.stringify(d), { status: s, headers: { 'content-type': 'application/json', 'x-content-type-options': 'nosniff', ...h } });
export async function onRequestGet({ request, env }) {
  const site = request.headers.get('sec-fetch-site');
  if (site && site !== 'same-origin') return json({ error: 'Forbidden' }, 403);
  const q = (new URL(request.url).searchParams.get('q') || '').trim().slice(0, 80);
  if (q.length < 2) return json({ error: 'Enter a place name.' }, 400);
  if (env.FEEDBACK) { const k = 'rl:geo:' + (request.headers.get('CF-Connecting-IP') || 'x'), n = Number((await env.FEEDBACK.get(k)) || 0); if (n >= 30) return json({ error: 'Too many lookups. Please wait a few minutes.' }, 429); await env.FEEDBACK.put(k, String(n + 1), { expirationTtl: 600 }); }
  const key = new Request('https://geocode.cache/' + encodeURIComponent(q.toLowerCase()));
  const hit = await caches.default.match(key);
  if (hit) return hit;
  const r = await fetch('https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + encodeURIComponent(q), { headers: { 'User-Agent': 'PersonalCode/1.0 (' + (env.CONTACT_EMAIL || 'website contact') + ')', 'Accept-Language': 'en' } });
  if (!r.ok) return json({ error: 'Lookup unavailable.' }, 502);
  const a = await r.json();
  const out = a[0] ? { lat: +a[0].lat, lon: +a[0].lon, n: String(a[0].display_name).slice(0, 160) } : null;
  const res = json(out, 200, { 'cache-control': 'public, max-age=2592000' });
  await caches.default.put(key, res.clone());
  return res;
}
