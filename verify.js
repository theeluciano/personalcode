// Environment variable required: PAYSTACK_SECRET_KEY (Secret)
// KV binding required: PERSONAL_CODE_KV

const TIER_AMOUNTS = {
  report: 1600,
  plus: 3200,
  deep: 4800
};

const TIER_MONTHS = { report: 3, plus: 6, deep: 12 };

const CURRENCY = 'USD';

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });
}

function addMonths(timestampMs, months) {
  const d = new Date(timestampMs);
  d.setMonth(d.getMonth() + months);
  return d.getTime();
}

async function verifyWithPaystack(reference, tier, secretKey) {
  let paystackRes;
  try {
    paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      { headers: { Authorization: `Bearer ${secretKey}` } }
    );
  } catch (err) {
    return { ok: false, reason: 'paystack_unreachable' };
  }
  if (!paystackRes.ok) return { ok: false, reason: 'paystack_error' };

  const body = await paystackRes.json();
  const tx = body && body.data;
  const confirmed = Boolean(
    body &&
    body.status === true &&
    tx &&
    tx.status === 'success' &&
    tx.currency === CURRENCY &&
    tx.amount === TIER_AMOUNTS[tier]
  );
  return confirmed ? { ok: true } : { ok: false, reason: 'transaction_not_confirmed' };
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const reference = url.searchParams.get('reference');
  const tier = url.searchParams.get('tier');

  if (!reference || !tier || !(tier in TIER_AMOUNTS)) {
    return json({ verified: false, reason: 'missing_or_invalid_params' }, 400);
  }
  if (!env.PAYSTACK_SECRET_KEY) {
    return json({ verified: false, reason: 'server_not_configured' }, 500);
  }

  const kv = env.PERSONAL_CODE_KV;
  const kvKey = `ref:${reference}`;

  if (kv) {
    const existingRaw = await kv.get(kvKey);
    if (existingRaw) {
      let existing;
      try { existing = JSON.parse(existingRaw); } catch { existing = null; }
      if (existing && existing.tier) {
        if (existing.tier !== tier) {
          return json({ verified: false, reason: 'tier_mismatch' });
        }
        const accessUntil = addMonths(existing.firstVerifiedAt, TIER_MONTHS[tier]);
        if (Date.now() > accessUntil) {
          return json({ verified: false, reason: 'access_expired', accessUntil });
        }
        return json({ verified: true, reason: null, firstVerifiedAt: existing.firstVerifiedAt, accessUntil });
      }
    }
  }

  const result = await verifyWithPaystack(reference, tier, env.PAYSTACK_SECRET_KEY);
  if (!result.ok) {
    return json({ verified: false, reason: result.reason });
  }

  const firstVerifiedAt = Date.now();
  const accessUntil = addMonths(firstVerifiedAt, TIER_MONTHS[tier]);

  if (kv) {
    try {
      await kv.put(kvKey, JSON.stringify({ tier, firstVerifiedAt }));
    } catch (err) {}
  }

  return json({ verified: true, reason: null, firstVerifiedAt, accessUntil });
}
