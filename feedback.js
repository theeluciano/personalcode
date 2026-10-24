// Public feedback endpoint. Needs a KV binding named FEEDBACK (see setup steps).
const json = (d, s = 200, h = {}) => new Response(JSON.stringify(d), { status: s, headers: { 'content-type': 'application/json', 'x-content-type-options': 'nosniff', ...h } });
const clean = (v, n) => String(v || '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, n);

// GET: the (max 3) stories you have chosen to feature.
export async function onRequestGet({ env }) {
  const raw = await env.FEEDBACK.get('showcase');
  return json(raw ? JSON.parse(raw) : [], 200, { 'cache-control': 'public, max-age=60' });
}

// POST: a new suggestion or story. Stored privately until you review it.
export async function onRequestPost({ request, env }) {
  const o = request.headers.get('origin');
  if (o && o !== new URL(request.url).origin) return json({ error: 'Forbidden' }, 403);
  const rk = 'rl:' + (request.headers.get('CF-Connecting-IP') || 'x');
  if (await env.FEEDBACK.get(rk)) return json({ error: 'Please wait a minute before sending another message.' }, 429);
  let b;
  try { b = await request.json(); } catch { return json({ error: 'Bad request.' }, 400); }
  if (b.website) return json({ ok: true }); // hidden spam trap
  const message = clean(b.message, 1000);
  if (message.length < 10) return json({ error: 'Please write a little more (at least 10 characters).' }, 400);
  const type = b.type === 'story' ? 'story' : 'suggestion';
  const id = String(9999999999999 - Date.now()).padStart(13, '0') + '-' + crypto.randomUUID().slice(0, 6); // newest first
  const entry = { id, at: new Date().toISOString(), type, name: clean(b.name, 40), email: clean(b.email, 120), message, consent: type === 'story' && !!b.consent, featured: false };
  await env.FEEDBACK.put('fb:' + id, JSON.stringify(entry));
  await env.FEEDBACK.put(rk, '1', { expirationTtl: 60 });
  return json({ ok: true });
}
