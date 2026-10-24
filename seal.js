/* Master Code builder. Every statement is derived from the buyer's own computed values (stated in the text),
   so any rule can be checked. Deterministic: the same inputs always give the same document.
   Client-facing wording uses the buyer's own Power Colours. No brand names appear inside a client report. */
(function (root) {
  'use strict';
  const SGN = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  const EL4 = ['fire', 'earth', 'air', 'water'];
  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  // d drive, s shadow, a action, p proof, v environment to avoid, w early-warning sign
  const NL = {
    1: { d: 'taking the first step', s: 'going it alone', a: 'start the hardest task before you check messages', p: 'a task begun without waiting for approval', v: 'environments that need permission for every move', w: 'impatience with anyone who asks a question' },
    2: { d: 'holding steady partnerships', s: "absorbing other people's moods", a: 'name your own priority before you answer anyone else', p: 'a decision made before consulting anyone', v: 'rooms where you are expected to absorb conflict', w: 'agreeing to things you do not want' },
    3: { d: 'giving ideas a clear voice', s: 'scattering effort across too many outlets', a: 'finish and share one piece of work before opening another', p: 'one finished piece shared, not five started', v: 'settings that reward noise over finished work', w: 'starting new projects to avoid finishing old ones' },
    4: { d: 'building routines that last', s: 'rigid control of the plan', a: 'set the order of the day the night before, and leave one hour open', p: 'a plan that survived one disruption without collapsing', v: 'arrangements with no stated owner', w: 'refusing small changes to the plan' },
    5: { d: 'adapting without losing direction', s: 'restless switching', a: 'choose one direction for the day and write down what you are deliberately ignoring', p: 'a change you chose rather than reacted to', v: 'routines that allow no variation at all', w: 'checking your phone while doing something else' },
    6: { d: 'carrying responsibility with care', s: 'over-giving', a: 'decide in advance how much you will give today and stop at that line', p: 'a request refused without guilt', v: 'situations where you are the unpaid default fixer', w: 'resentment after helping' },
    7: { d: 'studying a problem to the root', s: 'withdrawing from people', a: 'protect one block for study, then tell one person what you found', p: 'a conclusion tested with another person', v: 'places that demand instant answers', w: 'leaving messages unanswered for days' },
    8: { d: 'turning effort into lasting value', s: 'overwork and control', a: 'stop work at a set hour and review results, not hours spent', p: 'a result delivered without extra hours', v: 'arrangements where effort goes unmeasured and unrewarded', w: 'working past the hour you set' },
    9: { d: 'finishing and releasing what is done', s: 'holding on past completion', a: 'close one open loop each day before you start anything new', p: 'an old commitment formally closed', v: 'obligations with no end date', w: 're-reading old matters instead of acting' }
  };
  // w work, r recharge, t decide, l values
  const SL = [
    { w: 'in short, decisive bursts', r: 'physical movement and a clear win', t: 'quickly, from a first principle', l: 'courage and directness' },
    { w: 'steadily, one thing at a time', r: 'comfort, good food and quiet routine', t: 'slowly, after checking the facts', l: 'reliability and quality' },
    { w: 'across several threads at once', r: 'conversation and new information', t: 'by comparing options aloud', l: 'curiosity and wit' },
    { w: 'best in a protected, familiar setting', r: 'home, family and early nights', t: 'by feel, then by checking the record', l: 'loyalty and care' },
    { w: 'with full presence when you are seen', r: 'creative play and warm company', t: 'with conviction, after hearing the room', l: 'generosity and sincerity' },
    { w: 'precisely, refining as you go', r: 'order, a walk and closed lists', t: 'by analysis and checking details', l: 'usefulness and honest effort' },
    { w: 'best with a partner or a clear standard', r: 'beauty, balance and fair company', t: 'by weighing both sides', l: 'fairness and grace' },
    { w: 'intensely, with total focus', r: 'solitude and private depth', t: 'by testing what is hidden', l: 'honesty and depth' },
    { w: 'with momentum and a wide view', r: 'open space, travel and learning', t: 'by principle and the big picture', l: 'freedom and truth' },
    { w: 'methodically toward a long target', r: 'earned rest after a finished task', t: 'by results and track record', l: 'responsibility and mastery' },
    { w: 'independently, with original methods', r: 'time alone with ideas, then friends', t: 'by detached, systematic reasoning', l: 'independence and fresh thinking' },
    { w: 'intuitively, in flowing sessions', r: 'stillness, water and sleep', t: 'by sensing the whole picture before the parts', l: 'compassion and imagination' }
  ];
  const NC = { 1: ['Ruby', '9B1C2E', 'courage and first moves'], 2: ['Moonstone', '4A6FA5', 'calm and connection'], 3: ['Coral', 'D9534F', 'warmth and voice'], 4: ['Emerald', '1F7A4D', 'stability and steady growth'], 5: ['Turquoise', '1B998B', 'freedom and clear thinking'], 6: ['Rose', 'C2185B', 'care and harmony'], 7: ['Amethyst', '6A4C93', 'depth and insight'], 8: ['Bronze', '8C5A2B', 'authority and earned reward'], 9: ['Indigo', '2E3A87', 'vision and completion'], 11: ['Silver', 'A9B0B8', 'intuition and illumination'], 22: ['Platinum', 'C9CED6', 'building on a large scale'], 33: ['Pearl', 'E6E1D6', 'devotion and teaching'] };
  const EC = [['Scarlet', 'C8372D', 'action and spark'], ['Umber', '7A5C3E', 'structure and grounding'], ['Sky', '4A90C2', 'ideas and connection'], ['Deep Sea', '1F5F8B', 'feeling and intuition']];
  const TT = { 1: 'pioneer', 2: 'peacemaker', 3: 'storyteller', 4: 'master builder', 5: 'explorer', 6: 'guardian', 7: 'seeker', 8: 'executive', 9: 'visionary', 11: 'illuminator', 22: 'master architect', 33: 'master teacher' };
  const PYA = { 1: 'starting five things at once', 2: 'forcing outcomes before other people are ready', 3: 'promising more than you will finish', 4: 'building without a system or a rest day', 5: 'changing course without a stated reason', 6: "taking on other people's responsibilities", 7: 'making major moves without enough information', 8: 'scaling spending ahead of income', 9: 'beginning long commitments before old ones are closed' };
  const WIN = ['within 90 minutes of waking', 'in mid-morning, after your first meal', 'late in the morning, once you have exchanged a few words with someone', 'in a quiet window before the household wakes or after dusk'];
  const ELV = ['rooms that reward noise over substance', 'plans that never reach a decision', 'long isolation without conversation', 'harsh, unstructured pressure'];
  const RS = ['sit in the same sign, so they reinforce each other', 'sit in neighbouring signs, so they often feel slightly out of step', 'form a sextile, so they support each other when you use them deliberately', 'form a square, so they pull against each other and force a choice', 'form a trine, so they flow together with little effort', 'form a quincunx, so they rarely understand each other and need a go-between rule', 'sit in opposite signs, so you swing between them and must balance both'];
  const r9 = n => { while (n > 9) n = [...String(n)].reduce((a, b) => a + +b, 0); return n; };
  const cap = t => t[0].toUpperCase() + t.slice(1);
  const J = a => a.length < 2 ? a[0] : a.length == 2 ? a[0] + ', along with ' + a[1] : a.slice(0, -1).join(', ') + ', and ' + a[a.length - 1];
  const U = a => [...new Set(a)];
  const relSign = (i, j) => { const k = Math.abs(i - j) % 12; return RS[Math.min(k, 12 - k)]; };
  const fam = n => n % 3;
  const relNum = (a, b) => a == b ? 'carry the same root number, so they reinforce each other' : a + b == 9 ? 'total 9 together, so each supplies what the other lacks' : Math.abs(a - b) == 1 ? 'sit next to each other in the sequence, so they work in steps' : fam(a) == fam(b) ? 'share a rhythm, so they cooperate with little translation' : 'differ widely, so each needs deliberate translation for the other';
  const hash = s => { let h = 2166136261; for (const ch of s) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0; } return h >>> 0; };
  const dm = l => Math.floor(l % 30) + '\u00b0' + String(Math.floor((l % 1) * 60)).padStart(2, '0') + "'";

  function colours(c) {
    const n = c.nums, C1 = NC[n.lpK] || NC[n.lpR], sn = Math.floor(c.L.Sun / 30) % 12, sunEl = sn % 4, C2 = EC[sunEl], NLp = NL[n.lpR];
    return { C1, C2, sn, sunEl, items: [
      { t: 'sw', c: [{ n: C1[0], h: C1[1] }, { n: C2[0], h: C2[1] }] },
      { t: 'b', k: C1[0] + ' (#' + C1[1] + '): your Life Path colour', x: `Linked to Life Path ${n.lp}, ${c.N[n.lpK]}. Performance dynamic: reach for it when you need to ${NLp.a}. Evidence it is working: ${NLp.p}.` },
      { t: 'b', k: C2[0] + ' (#' + C2[1] + '): your ' + SGN[sn] + ' Sun colour', x: `Linked to your Sun in ${SGN[sn]} (${EL4[sunEl]}), which signals ${C2[2]}. Performance dynamic: it marks the way you work best, ${SL[sn].w}. Use it wherever you need that mode to hold.` },
      { t: 'b', k: 'Used together', x: `${C1[0]} marks the moment you begin (${NLp.a}). ${C2[0]} marks how you carry on (${SL[sn].w}).` },
      { t: 'p', x: 'These colours are working symbols. Their link to your numbers and placements is symbolic, not measured, so test it against your own results over several weeks.' }] };
  }

  function make(c) {
    const n = c.nums, L = c.L, N = c.N, H = hash(c.name.toLowerCase().normalize('NFD').replace(/[^a-z]/g, '') + '|' + c.y + '-' + c.m + '-' + c.d);
    const hv = (a, i = 0) => a[Math.floor(H / Math.pow(7, i + 1)) % a.length];
    const first = c.name.trim().split(/\s+/)[0], S = f => Math.floor(L[f] / 30) % 12, sn = S('Sun'), mi = S('Moon'), me = S('Mercury'), ve = S('Venus'), ma = S('Mars'), sa = S('Saturn');
    const soR = r9(n.so), exR = r9(n.ex), peR = r9(n.pe), lpR = n.lpR, bdR = r9(n.bd);
    const co = colours(c), C1 = co.C1, C2 = co.C2, sunEl = co.sunEl, moonEl = mi % 4;
    const born = new Date(Date.UTC(c.y, c.m - 1, c.d)), wd = DAYS[born.getUTCDay()], bornLong = `${c.d} ${MONTHS[c.m - 1]} ${c.y}`;
    const rxs = f => c.rx[f] ? ', retrograde' : '';
    // letter signature of the name
    const cnt = Array(10).fill(0); for (const ch of c.name.toLowerCase().normalize('NFD').replace(/[^a-z]/g, '')) cnt[(ch.charCodeAt(0) - 97) % 9 + 1]++;
    const tot = cnt.reduce((a, b) => a + b, 0), order = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort((a, b) => cnt[b] - cnt[a] || a - b), top = order.filter(k => cnt[k] == cnt[order[0]]).slice(0, 2), miss = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(k => !cnt[k]);
    const focus = 20 + 5 * soR, rec = 5 * lpR, close = 5 + peR;
    const pyFor = Y => r9(r9(c.m) + r9(c.d) + r9(Y)), now = c.now, ny = now.getFullYear(), nm0 = now.getMonth();
    const fmt = d => d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear();
    const addM = k => { const d = new Date(now); d.setMonth(d.getMonth() + k); return d; };
    const pmAt = k => { const d = new Date(ny, nm0 + k, 1); return { m: MONTHS[d.getMonth()], v: r9(pyFor(d.getFullYear()) + d.getMonth() + 1) }; };
    const p3 = [1, 2, 3].map(pmAt), hard = p3.reduce((a, b) => Math.abs(b.v - soR) > Math.abs(a.v - soR) ? b : a);
    const e = { sh: U([NL[lpR].s, NL[peR].s, NL[exR].s]), wr: U([NL[lpR].w, NL[peR].w, NL[exR].w]) };
    const pb = (k, x) => ({ t: 'b', k, x }), pp = x => ({ t: 'p', x }), sb = x => ({ t: 's', x }), dd = (k, x) => ({ t: 'd', k, x });

    const same = (a, b) => a == b;
    const polar = (num, ttl, a, b, rel, rule) => [sb(num + '. ' + ttl), dd(a[0], a[1]), dd(b[0], b[1]), pb('How they relate', rel), pb('Working rule', rule)];
    const sec = [
      { h: '1. YOUR POWER COLOURS', i: co.items },
      { h: '2. CORE PATTERN AND NAME SIGNATURE', i: [
        pp(`Prepared for ${c.name}, born ${bornLong} (${wd}). Calculation basis: ${c.conv}.`),
        pp(`Placements used: Sun ${dm(L.Sun)} ${SGN[sn]}, Moon ${dm(L.Moon)} ${SGN[mi]}, Mercury ${dm(L.Mercury)} ${SGN[me]}${rxs('Mercury')}, Venus ${dm(L.Venus)} ${SGN[ve]}${rxs('Venus')}, Mars ${dm(L.Mars)} ${SGN[ma]}${rxs('Mars')}, Saturn ${dm(L.Saturn)} ${SGN[sa]}.`),
        pp(`Numbers used: Life Path ${n.lp}, Birthday ${n.bdL}, Expression ${n.exL}, Soul Urge ${n.soL}, Personality ${n.peL}, Personal Year ${n.py}, Personal Month ${n.pm}.`),
        ...(c.moonNote ? [pp(c.moonNote)] : []),
        pb('Name signature', `${first}'s full name carries ${tot} letters. The most frequent letter-number${top.length > 1 ? 's are ' + top.join(' and ') + ' (' + cnt[top[0]] + ' each)' : ' is ' + top[0] + ' (' + cnt[top[0]] + ' times)'}; ${miss.length ? 'absent: ' + miss.join(', ') : 'every number from 1 to 9 is present'}.`),
        pb(miss.length ? 'What the absent numbers ask of you' : 'What full coverage means', miss.length ? `Build these on purpose: ${miss.slice(0, 3).map(k => NL[k].d).join('; ')}.` : 'No single skill is missing from the name, so your work is balance rather than gaps.')] },
      { h: '3. DAILY PROTOCOLS', i: [
        pp(`Seven rules for ${first}, each derived from a stated value: Soul Urge ${n.soL}, Life Path ${n.lp}, Moon ${dm(L.Moon)} ${SGN[mi]}, Mercury ${SGN[me]}, Mars ${SGN[ma]}, Saturn ${SGN[sa]}, Personal Month ${n.pm}. Change a value and the rule changes.`),
        pb(`Focus block: ${focus} minutes`, `Start ${WIN[moonEl]}. Rule: 20 + 5 \u00d7 Soul Urge root ${soR} (from ${n.soL}) = ${focus}. Use the block to ${NL[soR].a}. Your Moon at ${dm(L.Moon)} ${SGN[mi]} favours working ${SL[mi].w}.`),
        pb(`Recovery: ${rec} minutes after each block`, `Spend it on ${SL[mi].r}. Rule: 5 \u00d7 Life Path root ${lpR} (from ${n.lp}) = ${rec}.`),
        pb(`Decision window: Mercury at ${dm(L.Mercury)} ${SGN[me]}${rxs('Mercury')}`, `Decide ${SL[me].t}. ` + (c.rx.Mercury ? 'Mercury was retrograde at your birth, so re-read every figure, name and date once more before you send or sign.' : 'Mercury was direct at your birth, so a clear first draft is usually reliable; one read-through is enough before you send it.')),
        pb(`Effort pacing: Mars at ${dm(L.Mars)} ${SGN[ma]}${rxs('Mars')}`, `Push ${SL[ma].w}. ` + (c.rx.Mars ? 'With Mars retrograde, spend the first 15 minutes of any hard task planning before you act.' : 'With Mars direct, begin hard tasks promptly and plan while moving.')),
        pb(`Weekly review: every ${wd}`, `Rule: the weekday of ${bornLong}. Check one measurable item: ${NL[exR].p}. Move or drop one commitment that fails the check.`),
        pb(`Evening close-out: ${close} minutes`, `Rule: 5 + Personality root ${peR} (from ${n.peL}) = ${close}. Write tomorrow's single priority, then stop. Saturn at ${dm(L.Saturn)} ${SGN[sa]} holds you to ${SL[sa].l}, so close the day by checking it.`),
        pb(`This month: Personal Month ${n.pm}`, `${cap(N[n.pm])}, in ${MONTHS[now.getMonth()]} ${ny}. Month protocol: ${NL[n.pm].a}.`)] },
      { h: '4. AVOIDANCE BLUEPRINT', i: [
        pp(`Avoidances for ${first}, drawn from Life Path ${n.lp}, Personality ${n.peL}, Expression ${n.exL}, Soul Urge ${n.soL}, a ${SGN[sn]} Sun, Mercury${rxs('Mercury')}, Venus${rxs('Venus')} and Personal Year ${n.py}.`),
        pb('Patterns to avoid', `${cap(J(e.sh))}. They come from Life Path ${n.lp}, Personality ${n.peL} and Expression ${n.exL}.`),
        pb('Environments to avoid', `${cap(J(U([NL[soR].v, NL[peR].v])))}. The first starves ${NL[soR].d}. Your ${EL4[sunEl]} Sun at ${dm(L.Sun)} ${SGN[sn]} is drained further by ${ELV[sunEl]}.`),
        pb('Decisions to delay', (c.rx.Mercury ? 'Hold first drafts of contracts, offers and important messages for one night, then re-read them. ' : 'Do not decide in the first 24 hours of strong emotion, even though your thinking is direct. ') + (c.rx.Venus ? `With Venus retrograde at ${dm(L.Venus)} ${SGN[ve]} at birth, delay purchases and commitments above your usual size by seven days.` : `Write down the price you will pay before you negotiate, so urgency cannot set it (Venus at ${dm(L.Venus)} ${SGN[ve]}, direct).`)),
        pb(`Season rule: Personal Year ${n.py}`, `Avoid ${PYA[n.py]}. Derived from ${c.d} ${MONTHS[c.m - 1]} and ${ny}.`),
        pb('Early-warning signs', `You are drifting when you notice ${J(e.wr)}. These trace to Life Path ${n.lp}, Personality ${n.peL} and Expression ${n.exL}.`)] },
      { h: '5. POLARITY DYNAMICS', i: [
        pp(`Five pairs of ${first}'s own values that pull in different directions: Sun ${SGN[sn]} and Moon ${SGN[mi]}; Life Path ${n.lp} and Expression ${n.exL}; Soul Urge ${n.soL} and Personality ${n.peL}; Mars ${SGN[ma]} and Saturn ${SGN[sa]}; Mercury ${SGN[me]} and Venus ${SGN[ve]}. Each pair has a rule for working with both.`),
        ...polar(1, 'Outer drive and inner need', ['Outer drive: Sun at ' + dm(L.Sun) + ' ' + SGN[sn], `You work ${SL[sn].w}.`], ['Inner need: Moon at ' + dm(L.Moon) + ' ' + SGN[mi], `You recharge through ${SL[mi].r}.`], `Sun at ${dm(L.Sun)} ${SGN[sn]} and Moon at ${dm(L.Moon)} ${SGN[mi]} ${relSign(sn, mi)}.`, `After each stretch of working ${SL[sn].w}, give the Moon ${rec} minutes of ${SL[mi].r}.`),
        ...polar(2, 'Direction and instrument', ['Direction: Life Path ' + n.lp, cap(N[n.lpK]) + '.'], ['Instrument: Expression ' + n.exL, same(lpR, exR) ? 'The same root number, here working as your skill rather than your direction.' : cap(N[n.ex]) + '.'], `Life Path ${n.lp} and Expression ${n.exL} ${relNum(lpR, exR)}.` + (same(lpR, exR) ? ' Nothing in this pair opposes it, so the risk is the shadow, not a conflict: ' + NL[lpR].s + '.' : ''), same(lpR, exR) ? `Keep one fixed commitment outside this theme, and ${NL[lpR].a}.` : `Use ${NL[exR].d} in service of ${NL[lpR].d}: ${NL[exR].a}.`),
        ...polar(3, 'Inner want and outer signal', ['Inner want: Soul Urge ' + n.soL, cap(N[n.so]) + '.'], ['Outer signal: Personality ' + n.peL, same(soR, peR) ? 'The same root number, shown outwardly.' : cap(N[n.pe]) + '.'], `Soul Urge ${n.soL} and Personality ${n.peL} ${relNum(soR, peR)}.` + (same(soR, peR) ? ' What you want and what you show match, so others read you accurately; the shadow to watch is ' + NL[soR].s + '.' : ''), same(soR, peR) ? `Show ${NL[soR].d} openly, and keep one private hour for yourself. Evidence to look for: ${NL[soR].p}.` : `Let others see ${NL[peR].d}, and protect ${NL[soR].d} privately. Evidence to look for: ${NL[soR].p}.`),
        ...polar(4, 'Push and restraint', ['Push: Mars at ' + dm(L.Mars) + ' ' + SGN[ma] + rxs('Mars'), `You spend effort ${SL[ma].w}.`], ['Restraint: Saturn at ' + dm(L.Saturn) + ' ' + SGN[sa], `You are held to ${SL[sa].l}.`], `Mars at ${dm(L.Mars)} ${SGN[ma]} and Saturn at ${dm(L.Saturn)} ${SGN[sa]} ${relSign(ma, sa)}.`, `Set the limit first (${SL[sa].l}), then spend effort ${SL[ma].w}.`),
        ...polar(5, 'Decision and value', ['Decision: Mercury at ' + dm(L.Mercury) + ' ' + SGN[me] + rxs('Mercury'), `You decide ${SL[me].t}.`], ['Value: Venus at ' + dm(L.Venus) + ' ' + SGN[ve] + rxs('Venus'), `You prize ${SL[ve].l}.`], `Mercury at ${dm(L.Mercury)} ${SGN[me]} and Venus at ${dm(L.Venus)} ${SGN[ve]} ${relSign(me, ve)}.`, `Before you agree to anything, test it against ${SL[ve].l}; then decide ${SL[me].t}.`)] },
      { h: '6. CLOSING STATEMENT', i: [{ t: 'aff', k: 'YOUR CLOSING STATEMENT', x: `\u201cI am the ${TT[n.lpK]}. ${C1[0]} sets my direction and ${C2[0]} steadies my work. ${cap(NL[soR].d)} is my engine, and my results are mine to measure.\u201d` }] }
    ];
    // one-page reflection workbook
    const end3 = addM(3), end6 = addM(6), end12 = addM(12), pyN = pyFor(ny + 1);
    const hz = [
      { n: 3, title: 'THE NEXT 3 MONTHS', range: `${fmt(now)} to ${fmt(end3)}`, theme: `Inner drive: Soul Urge ${n.soL}, ${NL[soR].d}. Personal Months ahead: ${p3.map(p => p.m + ' ' + p.v).join(', ')}.`,
        q: [`Which month asks most of me, ${hard.m} (${hard.v}: ${N[hard.v]}), and what will I stop doing to make room for it?`, `Where did I practise ${NL[soR].d} this month, and what did it cost me?`, `What is the earliest sign that ${NL[lpR].s} is returning, and what do I do when I see it?`], proof: NL[soR].p },
      { n: 6, title: 'THE NEXT 6 MONTHS', range: `${fmt(now)} to ${fmt(end6)}`, theme: `Toolkit: Expression ${n.exL}, ${NL[exR].d}.`,
        q: [`Which skill of mine has had no outlet since ${MONTHS[now.getMonth()]}, and where can I use it before ${fmt(end6)}?`, `When did my ${SGN[sn]} Sun (working ${SL[sn].w}) and my ${SGN[mi]} Moon (needing ${SL[mi].r}) pull apart, and what did I choose?`, `Which commitment shows my outer signal (${NL[peR].d}) without draining my inner drive?`], proof: NL[exR].p },
      { n: 12, title: 'THE NEXT 12 MONTHS', range: `${fmt(now)} to ${fmt(end12)}`, theme: `Direction: Life Path ${n.lp}, ${NL[lpR].d}. Personal Year ${n.py} now; ${pyN} from 1 January ${ny + 1}.`,
        q: [`What has moved measurably closer to ${NL[lpR].d} (dates, amounts, finished work)?`, `Which pattern from my avoidance list (${NL[peR].s}) has weakened, and what replaced it?`, `Personal Year ${n.py} becomes ${pyN} on 1 January ${ny + 1}: what must be finished before then, and what begins after?`], proof: NL[lpR].p }
    ];
    sec.push({ h: 'YOUR MAIN POINTS OF REFLECTION ACROSS THE NEXT 3, 6, AND 12 MONTHS', pageBreak: true, i: [{ t: 'wk', hz }] });
    return { pc: [C1[1], C2[1]], kicker: `YOUR POWER COLOURS: ${C1[0].toUpperCase()} & ${C2[0].toUpperCase()}`, title: `THE ${first.toUpperCase()} MASTER CODE`, sub: 'A PRECISION BLUEPRINT FROM YOUR NAME AND BIRTHDATE', sub2: 'Derived rules, stated values and a three-horizon reflection framework',
      intro: [{ t: 'box', k: 'YOUR PATTERN IN ONE LINE', x: '\u201c' + (soR == exR && exR == lpR ? `${cap(NL[lpR].d)} is your engine, your instrument and your direction.` : exR == lpR ? `${cap(NL[soR].d)} is your engine; ${NL[lpR].d} is both your instrument and your direction.` : soR == lpR ? `${cap(NL[lpR].d)} is both your engine and your direction; ${NL[exR].d} is your instrument.` : soR == exR ? `${cap(NL[soR].d)} is both your engine and your instrument; ${NL[lpR].d} is your direction.` : `${cap(NL[soR].d)} is your engine, ${NL[exR].d} is your instrument, and ${NL[lpR].d} is your direction.`) + '\u201d' }], sec };
  }
  const api = { make, colours, NL, SL, SGN, r9 };
  root.Seal = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
