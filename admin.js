// Admin endpoint. Needs KV binding FEEDBACK and a secret variable ADMIN_KEY.
const json = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { 'content-type': 'application/json', 'x-content-type-options': 'nosniff', 'cache-control': 'no-store' } });
const enc = new TextEncoder();
async function same(a, b) { const [x, y] = await Promise.all([crypto.subtle.digest('SHA-256', enc.encode(a)), crypto.subtle.digest('SHA-256', enc.encode(b))]); const u = new Uint8Array(x), v = new Uint8Array(y); let d = 0; for (let i = 0; i < 32; i++) d |= u[i] ^ v[i]; return d === 0; }
// Returns a Response if the request must be refused, otherwise null. Checks origin, locks out repeated bad keys, compares keys in constant time.
async function gate(request, env) {
  const o = request.headers.get('origin');
  if (o && o !== new URL(request.url).origin) return json({ error: 'Forbidden' }, 403);
  if (!env.ADMIN_KEY) return json({ error: 'Unauthorized' }, 401);
  const k = 'rl:auth:' + (request.headers.get('CF-Connecting-IP') || 'x'), n = Number((await env.FEEDBACK.get(k)) || 0);
  if (n >= 10) return json({ error: 'Too many attempts. Try again in 10 minutes.' }, 429);
  if (await same(request.headers.get('x-admin-key') || '', env.ADMIN_KEY)) return null;
  await env.FEEDBACK.put(k, String(n + 1), { expirationTtl: 600 });
  return json({ error: 'Unauthorized' }, 401);
}

async function all(env) {
  const out = []; let cursor;
  do {
    const l = await env.FEEDBACK.list({ prefix: 'fb:', cursor });
    for (const k of l.keys) { const v = await env.FEEDBACK.get(k.name); if (v) out.push(JSON.parse(v)); }
    cursor = l.list_complete ? undefined : l.cursor;
  } while (cursor && out.length < 1000);
  return out;
}

export async function onRequestGet({ request, env }) {
  { const g = await gate(request, env); if (g) return g; }
  if (new URL(request.url).searchParams.get('live')) return json(JSON.parse((await env.FEEDBACK.get('live')) || '{}'));
  return json(await all(env));
}

export async function onRequestPost({ request, env }) {
  { const g = await gate(request, env); if (g) return g; }
  let b; try { b = await request.json(); } catch { return json({ error: 'Bad request' }, 400); }
  if (b.action === 'setLive') { // hidden live-session module
    const url = String(b.joinUrl || ''), at = new Date(b.startsAt);
    const live = { enabled: !!b.enabled, title: String(b.title || '').slice(0, 80), startsAt: isNaN(at) ? '' : at.toISOString(), joinUrl: /^https:\/\//.test(url) ? url.slice(0, 300) : '' };
    if (live.enabled && (!live.title || !live.startsAt)) return json({ error: 'Add a title and a date and time first.' }, 400);
    await env.FEEDBACK.put('live', JSON.stringify(live));
    return json({ ok: true });
  }
  const key = 'fb:' + b.id, raw = await env.FEEDBACK.get(key);
  if (!raw) return json({ error: 'Not found' }, 404);
  const e = JSON.parse(raw);
  if (b.action === 'delete') await env.FEEDBACK.delete(key);
  else if (b.action === 'feature') {
    if (!e.consent) return json({ error: 'This person did not allow public display.' }, 400);
    if (!e.featured && (await all(env)).filter(x => x.featured).length >= 3) return json({ error: 'Three stories are already featured. Unfeature one first.' }, 400);
    e.featured = true; await env.FEEDBACK.put(key, JSON.stringify(e));
  } else if (b.action === 'unfeature') { e.featured = false; await env.FEEDBACK.put(key, JSON.stringify(e)); }
  else return json({ error: 'Unknown action' }, 400);
  const show = (await all(env)).filter(x => x.featured).slice(0, 3).map(x => ({ name: x.name, message: x.message }));
  await env.FEEDBACK.put('showcase', JSON.stringify(show));
  return json({ ok: true });
}
