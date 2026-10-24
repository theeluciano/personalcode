# Launch checklist

Run `node preflight.js` in this folder. It must print "All checks passed" before you go live.

1. Fill in `site-config.js` (operator name, contact email, country). Until then the legal pages show red "[not set]" labels on purpose.
2. Apply the Paystack changes in `PAYSTACK_COPY.md`. Create the gift page and paste its link into `CONFIG.pay.gift` in `app.js` if you want to sell it.
3. Cloudflare Pages: add secrets `PAYSTACK_SECRET_KEY` and `ADMIN_KEY`; bind KV namespace `FEEDBACK`; optional `CONTACT_EMAIL` (shown to the map service as the site contact). Redeploy.
4. Put Cloudflare Access (Zero Trust, free tier) in front of `/admin.html` and `/api/admin` so the inbox needs a login as well as the admin key.
5. In Cloudflare: turn on Always Use HTTPS, redirect the bare domain to `www` (or the reverse), and add a rate-limiting rule for `/api/*`.
6. Make one real test purchase of each package, confirm the reading and PDF work, and refund them.
7. Open the site in a real browser (phone and laptop) and confirm the PDF download works under the security policy.
8. Have the privacy policy, terms and refund wording reviewed by someone qualified in your country.
