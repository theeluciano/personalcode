// Confirms a Paystack payment on the server and tells the page which tier was bought.
// Needs a secret variable PAYSTACK_SECRET_KEY. Optional: PAYSTACK_CURRENCY (default USD).
// Amounts are in the smallest currency unit (cents): $20 = 2000, $40 = 4000, $80 = 8000.
const GIFT_CENTS = 1500; // The Black & Gold Seal add-on. Must match the price of your Paystack gift page ($15 = 1500).
const TIERS = { 2000: 'core', 4000: 'signature', 8000: 'deep', [GIFT_CENTS]: 'gift' };
const ACCESS_MONTHS = { core: 3, signature: 6, deep: 12, gift: 12 }; // change here if your access periods change
const json = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { 'content-type': 'application/json', 'x-content-type-options': 'nosniff', 'cache-control': 'no-store' } });

export async function onRequestPost({ request, env }) {
  const o = request.headers.get('origin');
  if (o && o !== new URL(request.url).origin) return json({ error: 'Forbidden' }, 403);
  if (!env.PAYSTACK_SECRET_KEY) return json({ error: 'Service not configured.' }, 500);
  if (env.FEEDBACK) { const k = 'rl:unlock:' + (request.headers.get('CF-Connecting-IP') || 'x'), n = Number((await env.FEEDBACK.get(k)) || 0); if (n >= 30) return json({ error: 'Too many requests. Please wait a few minutes.' }, 429); await env.FEEDBACK.put(k, String(n + 1), { expirationTtl: 600 }); }
  let b; try { b = await request.json(); } catch { b = {}; }
  const ref = String(b.reference || '');
  if (!/^[\w.-]{6,100}$/.test(ref)) return json({ error: 'Missing payment reference.' }, 400);
  const r = await fetch('https://api.paystack.co/transaction/verify/' + encodeURIComponent(ref), { headers: { Authorization: 'Bearer ' + env.PAYSTACK_SECRET_KEY } });
  const d = await r.json().catch(() => ({}));
  if (!r.ok || !d.status || !d.data || d.data.status !== 'success') return json({ error: 'We could not confirm this payment.' }, 402);
  if (d.data.currency !== (env.PAYSTACK_CURRENCY || 'USD')) return json({ error: 'Unexpected payment currency.' }, 402);
  const tier = TIERS[d.data.amount];
  if (!tier) return json({ error: 'Unexpected payment amount.' }, 402);
  const paid = new Date(d.data.paid_at || d.data.paidAt);
  if (isNaN(paid)) return json({ error: 'Could not read the payment date.' }, 402);
  const end = new Date(paid); end.setMonth(end.getMonth() + ACCESS_MONTHS[tier]);
  if (Date.now() > end) return json({ error: 'Your access period has ended.' }, 403);
  return json({ tier, until: end.toISOString() });
}
