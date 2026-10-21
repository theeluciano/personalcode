// Confirms a Paystack payment on the server and tells the page which tier was bought.
// Needs a secret variable PAYSTACK_SECRET_KEY. Optional: PAYSTACK_CURRENCY (default USD).
// Amounts are in the smallest currency unit (cents): $20 = 2000, $40 = 4000, $80 = 8000.
const TIERS = { 2000: 'core', 4000: 'signature', 8000: 'deep' };
const json = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });

export async function onRequestPost({ request, env }) {
  let b; try { b = await request.json(); } catch { b = {}; }
  const ref = String(b.reference || '');
  if (!/^[\w.-]{6,100}$/.test(ref)) return json({ error: 'Missing payment reference.' }, 400);
  const r = await fetch('https://api.paystack.co/transaction/verify/' + encodeURIComponent(ref), { headers: { Authorization: 'Bearer ' + env.PAYSTACK_SECRET_KEY } });
  const d = await r.json().catch(() => ({}));
  if (!r.ok || !d.status || !d.data || d.data.status !== 'success') return json({ error: 'We could not confirm this payment.' }, 402);
  if (d.data.currency !== (env.PAYSTACK_CURRENCY || 'USD')) return json({ error: 'Unexpected payment currency.' }, 402);
  const tier = TIERS[d.data.amount];
  if (!tier) return json({ error: 'Unexpected payment amount.' }, 402);
  return json({ tier });
}
