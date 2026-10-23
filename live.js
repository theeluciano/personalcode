// Public endpoint for the hidden Live Sessions module. Shows nothing until you switch it on in admin.html.
const json = (d, s = 200, h = {}) => new Response(JSON.stringify(d), { status: s, headers: { 'content-type': 'application/json', ...h } });
export async function onRequestGet({ env }) {
  const raw = await env.FEEDBACK.get('live'), l = raw ? JSON.parse(raw) : null;
  if (!l || !l.enabled) return json({ enabled: false });
  const start = new Date(l.startsAt).getTime(), now = Date.now();
  if (isNaN(start) || now > start + 3 * 36e5) return json({ enabled: false });
  // The join link is only released 15 minutes before the start.
  return json({ enabled: true, title: l.title, startsAt: l.startsAt, joinUrl: now >= start - 15 * 6e4 ? l.joinUrl : '' }, 200, { 'cache-control': 'public, max-age=30' });
}
