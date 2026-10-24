// Run with: node preflight.js   (from the site folder). Exits 1 if anything blocks launch.
const fs = require('fs'), path = require('path');
const rd = f => fs.readFileSync(f, 'utf8'), ex = f => fs.existsSync(f);
const out = []; const chk = (ok, name, why = '') => out.push([ok, name, ok ? '' : why]);
const html = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const own = [...html, 'app.js', 'reading.js', 'admin-ui.js', 'legal.js', 'site-config.js', 'theme.css', 'legal.css', 'fonts.css', '_headers', 'robots.txt', ...fs.readdirSync('functions/api').map(f => 'functions/api/' + f)];
const cfg = rd('site-config.js');
for (const k of ['operatorName', 'contactEmail', 'country']) chk(new RegExp(k + ":\\s*'[^']+'").test(cfg), 'Operator detail set: ' + k, 'Fill it in site-config.js');
chk(own.every(f => !/numerolog|astrolog/i.test(rd(f))), 'Banned words absent from site files', 'Found a banned word');
chk(html.every(f => !/<script>/.test(rd(f))), 'No inline scripts (strict CSP can apply)', 'Inline <script> found');
const missing = []; for (const f of html) for (const m of rd(f).matchAll(/(?:href|src)="([^"#?]+)"/g)) { const u = m[1]; if (/^(https?:|mailto:|data:|\/$)/.test(u)) continue; if (!ex(u)) missing.push(f + ' -> ' + u); }
chk(!missing.length, 'All local links and files exist', missing.join('; '));
const ext = new Set(); for (const f of [...html, 'app.js', 'reading.js', 'theme.css', 'fonts.css', 'legal.css']) for (const m of rd(f).matchAll(/https?:\/\/([a-z0-9.-]+)/gi)) ext.add(m[1]);
const okHosts = ['paystack.shop', 'www.w3.org'];
chk([...ext].every(h => okHosts.includes(h)), 'Only expected external hosts referenced', [...ext].filter(h => !okHosts.includes(h)).join(', '));
const app = rd('app.js'), terms = rd('terms.html'), unlock = rd('functions/api/unlock.js');
const tiers = [['Core Code', 20, 3, 2000], ['Signature Code', 40, 6, 4000], ['Deep Code', 80, 12, 8000]];
for (const [n, p, mo, c] of tiers) {
  const re = new RegExp("n:'" + n + "',p:'\\$" + p + "',d:'" + mo + " months'");
  chk(re.test(app), n + ' price and period in app.js', 'Mismatch with $' + p + '/' + mo + ' months');
  chk(terms.includes('$' + p) && terms.includes(mo + ' months'), n + ' matches Terms', 'Terms differ');
  chk(unlock.includes(c + ":"), n + ' amount in unlock.js (' + c + ')', 'unlock.js differs');
}
chk(/giftPrice:'\$15'/.test(app) && /\[GIFT_CENTS\]/.test(unlock) && /GIFT_CENTS = 1500/.test(unlock) && terms.includes('$15'), 'Gift price consistent ($15)', 'Gift price differs somewhere');
chk(/gift: 12/.test(unlock) && /deep: 12/.test(unlock) && /signature: 6/.test(unlock) && /core: 3/.test(unlock), 'Access months enforced in unlock.js', 'ACCESS_MONTHS differs');
for (const k of ['core', 'signature', 'deep']) chk(new RegExp(k + ":'https://paystack\\.shop/pay/[\\w-]+'").test(app), 'Paystack link set: ' + k, 'Missing');
if (!/gift:'https:\/\/paystack\.shop/.test(app)) console.log('NOTE  Gift add-on is hidden until CONFIG.pay.gift is set in app.js');
const hd = rd('_headers');
chk(/script-src 'self'/.test(hd) && !/unsafe-eval/.test(hd) && /frame-ancestors 'none'/.test(hd) && /Strict-Transport-Security/.test(hd), 'Security headers present, no unsafe-eval', 'Check _headers');
chk(!/unsafe-inline[^;]*script|script-src[^;]*unsafe-inline/.test(hd), 'Scripts not allowed inline', 'unsafe-inline on scripts');
chk(rd('legal.js') && /18/.test(rd('privacy.html')) && /18/.test(terms) && /id="age"/.test(app) && /class="age"/.test(app) && /id="ar"/.test(rd('reading.html')), '18+ confirmation exists in flow and in both policies', 'Age gate missing');
let fail = 0; for (const [ok, n, why] of out) { console.log((ok ? 'PASS  ' : 'FAIL  ') + n + (ok ? '' : '  <- ' + why)); if (!ok) fail++; }
console.log('\n' + (fail ? fail + ' blocking item(s)' : 'All checks passed')); process.exit(fail ? 1 : 0);
