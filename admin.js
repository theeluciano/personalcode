// Admin endpoint. Needs KV binding FEEDBACK and a secret variable ADMIN_KEY.
const json = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
const authed = (r, env) => { const k = r.headers.get('x-admin-key') || ''; return !!env.ADMIN_KEY && k.length === env.ADMIN_KEY.length && k === env.ADMIN_KEY; };

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
  if (!authed(request, env)) return json({ error: 'Unauthorized' }, 401);
  return json(await all(env));
}

export async function onRequestPost({ request, env }) {
  if (!authed(request, env)) return json({ error: 'Unauthorized' }, 401);
  let b; try { b = await request.json(); } catch { return json({ error: 'Bad request' }, 400); }
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
