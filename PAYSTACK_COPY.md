# Paystack settings to match the website

Do these in your Paystack dashboard. Paystack pages are yours to edit; the website cannot change them.

## Business and branding (all pages)
- **Public business name:** the checkout currently shows "By Personal Code Report". Change it to **Personal Code** (or your registered trading name, then use the same name in `site-config.js`).
- **Logo:** use the Personal Code logo. Remove any "Report" wording.
- **Support email and phone:** set the same email you put in `site-config.js` as `contactEmail`.
- **Redirect after payment (every page):** `https://www.personalcode.org/reading.html`
- **Amount:** make sure each page has a **fixed** amount. Check the checkout shows the price as fixed, not an editable box. The site only unlocks exact amounts.
- **Currency:** USD. **Type:** one-time payment, not a subscription.
- **Collect only what you need:** first name, last name, email. Remove optional extra fields you do not use.

## Page text to paste (replaces the current descriptions, which promised things the site does not deliver)

**Core Code ($20, name `Core Code`, slug `core-code`)**
Your complete Personal Code blueprint, read from your name and birthdate: your core signature in full, your strengths and growth edges, and where you stand this year. Includes a PDF download. One-time payment of $20, no recurring charges, 3-month access. For reflection and entertainment only. You must be 18 or older.

**Signature Code ($40, name `Signature Code`, slug `signature-code`)**
Everything in Core Code, plus your strongest currents ranked, how the pieces of you fit together, and where you stand this month. Includes a PDF download. One-time payment of $40, no recurring charges, 6-month access. For reflection and entertainment only. You must be 18 or older.

**Deep Code ($80, name `Deep Code`, slug `deep-code`)**
Everything in Signature Code, plus your life seasons, growth tests, where your life plays out, reflection prompts for your four core signatures, and a gift: The Black & Gold Seal, a private letter built from your name and birthdate. Includes PDF downloads. One-time payment of $80, no recurring charges, 12-month access. For reflection and entertainment only. You must be 18 or older.

**The Black & Gold Seal ($15, name `The Black & Gold Seal`, slug `black-gold-seal`)**
A private letter of your power, your desires and your blueprint, written from your name and birthdate, with a PDF to keep. Included free with Deep Code. One-time payment of $15, no recurring charges, 12-month access. For reflection and entertainment only. You must be 18 or older.

After creating the gift page, paste its link into `CONFIG.pay.gift` in `app.js`. The gift card stays hidden until you do.
