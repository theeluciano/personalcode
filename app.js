/* SITE CONFIG: edit here only.
   siteUrl: leave '' to use whatever domain the page is served from, or set your final domain.
   pay: paste each one-time Paystack payment link here (Core $20, Signature $40, Deep $80). */
const CONFIG={siteUrl:'',giftPrice:'$15',pay:{core:'https://paystack.shop/pay/core-code',signature:'https://paystack.shop/pay/signature-code',deep:'https://paystack.shop/pay/deep-code',gift:'https://paystack.shop/pay/tdp49dlj-j'}};
const PK={
free:{n:'Personal Code',p:'$0',t:'Enter your name and your birthdate. That is all it takes.',inc:['Three of your core signatures','A first glimpse of your inner pattern','One insight to sit with']},
core:{n:'Core Code',p:'$20',d:'3 months',u:CONFIG.pay.core,t:'Your complete blueprint, read from your name and birthdate.',inc:['Your core signature, in full','Your strengths and growth edges','Where you stand this year','Download your reading as a PDF'],s:['Overview','You start fast and build slowly. This reading shows where each habit serves you, and where it costs you.']},
signature:{n:'Signature Code',p:'$40',d:'6 months',u:CONFIG.pay.signature,t:'How the pieces of you move together, and where you stand right now.',inc:['Everything in Core Code','Your strongest currents, ranked','How it all fits together','Where you stand this month'],s:['Interaction','Part of you wants to cooperate while another part wants to lead. This section shows where those two instructions collide, and a simple way to sequence them.']},
deep:{n:'Deep Code',p:'$80',d:'12 months',g:'Gift inside',u:CONFIG.pay.deep,t:'The full architecture of you: seasons, tensions and what is ahead.',inc:['Everything in Signature Code','Your life seasons and growth tests','Where your life plays out','Reflection prompts for your four core signatures','A surprise gift, The Black & Gold Seal, revealed after you pay'],s:['Life seasons','Your first season runs to about age 34 under a creative theme, then turns toward study. Here is what each season asks of you, and when the shift begins.']}
};
const GA='Gift available';PK.free.g=PK.core.g=PK.signature.g=GA;
const N={1:'initiative and independence',2:'cooperation, sensitivity and balance',3:'expression and creativity',4:'structure, discipline and building',5:'change, freedom and curiosity',6:'care, responsibility and harmony',7:'study, depth and inner truth',8:'ambition, authority and material mastery',9:'compassion, completion and wide vision',11:'intuition and inspiration, with pressure to match',22:'large-scale building that turns vision into form',33:'devoted teaching and service'};
const SG=[['Aries','starts boldly and leads from the front'],['Taurus','builds steadily and values what lasts'],['Gemini','thinks fast and connects ideas'],['Cancer','protects and feels deeply'],['Leo','creates warmly and wants to be seen'],['Virgo','refines with care and serves with skill'],['Libra','seeks balance and fair dealing'],['Scorpio','goes deep and transforms'],['Sagittarius','explores and searches for meaning'],['Capricorn','climbs patiently toward goals'],['Aquarius','innovates and thinks for the group'],['Pisces','imagines and feels everything']];
const M=n=>n==11||n==22||n==33,ds=n=>[...String(n)].reduce((a,b)=>a+ +b,0);
const red=n=>{while(n>9&&!M(n))n=ds(n);return n};
const $=s=>document.querySelector(s);
const DAYS=Array.from({length:31},(_,i)=>[i+1,i+1]),MON=['January','February','March','April','May','June','July','August','September','October','November','December'].map((t,i)=>[i+1,t]),YRS=Array.from({length:new Date().getFullYear()-1899},(_,i)=>{const y=new Date().getFullYear()-i;return[y,y]});
const OP=(ph,a)=>`<option value="" disabled selected hidden>${ph}</option>`+a.map(([v,t])=>`<option value="${v}">${t}</option>`).join('');
function tiles(){return Object.entries(PK).map(([k,v])=>`<a class="tile${k=='signature'?' on':''}" href="#/${k}"><div class="tt"><div><h3>${v.n}</h3><small>${v.d?v.p+' · '+v.d+' access':'$0 · free sample reading'}</small></div><i>→</i></div>${v.g?'<span class="pill"><small>'+v.g+'</small><span>The Black &amp; Gold Seal</span></span>':''}</a>`).join('')}
function home(){return `<section class="hero"><h1>Your name and your birthdate already hold a pattern.</h1><p>All it takes is your name and your birthdate. Personal Code reads what they hold and reads it back to you. Not as fate, but as a starting point for reflection.</p></section><div id="lv"></div><section class="tiles" aria-label="Packages">${tiles()}</section><p class="fine">One-time payments. No subscriptions or recurring charges.</p>`}
function addon(k){if(k=='deep')return '';const u=CONFIG.pay.gift;if(!u)return '';
 return `<div class="addon"><small>\u2726 A GIFT FOR YOU</small><h3>The Black &amp; Gold Seal</h3><p>Your personal Master Code, written from your name and birthdate: your Power Colours, daily protocols, an avoidance blueprint, polarity dynamics, and a one-page reflection framework for the next 3, 6 and 12 months. Comes with a PDF to keep.</p><label class="chk"><input type="checkbox" class="age"> <span>I am 18 or older, and I accept the <a href="terms.html">Terms</a> and <a href="privacy.html">Privacy Policy</a>.</span></label><a class="btn ghost buy" data-u="${u}" aria-disabled="true">Get Your Black &amp; Gold Seal Gift \u2014 ${CONFIG.giftPrice}</a><p class="note">One-time payment \u00b7 no recurring charges \u00b7 12-month access</p></div>`}
function page(k){const v=PK[k];
 return `<section class="page"><a class="back" href="#/">← All readings</a><h2>${v.n}</h2><p class="lead">${v.t}</p>
 <div class="price">${v.p}</div>${v.d?'<div class="terms"><span>One-time payment</span><span>No recurring charges</span><span>'+v.d.replace(' months','-month')+' access</span></div>':''}
 <ul class="inc">${v.inc.map(i=>`<li>${i}</li>`).join('')}</ul>`+
 (k=='free'?`<form id="f"><label for="nm">Your full name (as given at birth)</label><input id="nm" required autocomplete="name" placeholder="e.g. Amara Grace Whitfield"><label>Your date of birth</label><div class="dob"><select id="dd" aria-label="Day" required>${OP('Day',DAYS)}</select><select id="mm" aria-label="Month" required>${OP('Month',MON)}</select><select id="yy" aria-label="Year" required>${OP('Year',YRS)}</select></div><p class="err" id="er" hidden></p><label class="chk"><input id="age" type="checkbox" required> <span>I confirm I am 18 or older.</span></label><button class="btn">Get My Personal Code</button><p class="note">Free preview. For reflection and entertainment, not a substitute for professional advice.</p></form><div id="out"></div>`
 :`<div class="sample"><span>Sample excerpt · ${v.s[0]}</span><p>“${v.s[1]}”</p></div>${v.u?`<label class="chk"><input type="checkbox" class="age"> <span>I am 18 or older, and I accept the <a href="terms.html">Terms</a> and <a href="privacy.html">Privacy Policy</a>.</span></label><a class="btn buy" data-u="${v.u}" aria-disabled="true">Get My ${v.n} — ${v.p}</a>`:`<span class="btn" style="opacity:.55;cursor:default">Opening soon</span>`}<p class="note" style="text-align:center">Birth time and place are optional; if the time is unknown, sunrise at your birthplace is used.</p>`)+addon(k)+`</section>`}
function reading(e){e.preventDefault();
 const y=+$('#yy').value,m=+$('#mm').value,d=+$('#dd').value,name=$('#nm').value.trim(),er=$('#er');
 if(new Date(Date.UTC(y,m-1,d)).getUTCDate()!==d){er.textContent='That date does not exist. Please check the day and month.';er.hidden=false;return}
 er.hidden=true;
 const a=red(ds(d)+ds(m)+ds(y)),b=red(red(d)+red(m)+red(y)),lpL=(a!==b&&M(a))?a+'/'+b:''+b,lpK=M(a)?a:b;
 const bd=red(d),bdL=(M(d)||d<10)?''+d:d+'/'+bd;
 let sun='',sk='';
 try{const lon=Astronomy.SunPosition(new Date(Date.UTC(y,m-1,d,12))).elon,i=Math.floor(lon/30)%12,r=lon%30;
  sun=`<p>Your Sun was in <b>${SG[i][0]}</b>: you are someone who ${SG[i][1]}.${(r<1||r>29)?' You were born close to a sign boundary, so your birth time would settle this.':''}</p>`;sk=SG[i][1]}catch(x){}
 const o=document.createElement('div');o.className='res';
 const h=document.createElement('h3');h.textContent='A reading for '+name;o.appendChild(h);
 o.insertAdjacentHTML('beforeend',`<p>Your Life Path is <b>${lpL}</b>: ${N[lpK]}.</p><p>Your Birthday Number is <b>${bdL}</b>: ${N[bd]}.</p>${sun}<p style="color:var(--mute)">Sit with this: where does your pull toward ${N[lpK]} help the side of you that ${sk||'values '+N[bd]}, and where does it pull against it?</p>`);
 const n=document.createElement('a');n.className='btn';n.href='#/core';n.textContent='Go deeper with Core Code';
 $('#out').replaceChildren(o,n);o.scrollIntoView({behavior:'smooth',block:'start'})}
async function voices(){let d=[];try{d=await (await fetch('/api/feedback')).json()}catch(x){}
 if(!Array.isArray(d)||!d.length||!$('#lv'))return;
 const s=document.createElement('section');s.className='voices';s.innerHTML='<h2>Voices</h2><p>Words from people who have used their Personal Code.</p>';const g=document.createElement('div');g.className='vc';
 d.slice(0,3).forEach(v=>{const c=document.createElement('div'),p=document.createElement('p'),m=document.createElement('small');c.className='plac';p.textContent='\u201c'+v.message+'\u201d';m.textContent='\u2014 '+(v.name||'A reader');c.append(p,m);g.append(c)});
 s.append(g);$('#app').append(s)}
async function live(){const b=$('#lv');if(!b)return;try{const d=await (await fetch('/api/live')).json();if(!d.enabled||!$('#lv'))return;const t0=new Date(d.startsAt),on=Date.now()>=t0.getTime(),w=document.createElement('div');w.className='live';
 const a=document.createElement('small');a.textContent=on?'LIVE NOW':'LIVE SESSION';if(on)a.className='on';
 const h=document.createElement('strong');h.textContent=d.title;const p=document.createElement('span');p.textContent=t0.toLocaleString(undefined,{dateStyle:'full',timeStyle:'short'});w.append(a,h,p);
 if(d.joinUrl){const j=document.createElement('a');j.className='btn mini';j.href=d.joinUrl;j.target='_blank';j.rel='noopener';j.textContent='Join the live session';w.append(j)}
 b.append(w)}catch(e){}}
function route(){const k=location.hash.replace('#/','');
 $('#app').innerHTML=PK[k]?page(k):home();scrollTo(0,0);$('#fab').hidden=!!PK[k];$('#panel').hidden=true;if(!PK[k]){voices();live()}
 if(k=='free'){$('#f').addEventListener('submit',reading);const ids=['dd','mm','yy'];ids.forEach((id,i)=>$('#'+id).addEventListener('change',()=>{const n=$('#'+ids[i+1]);if(n&&!n.value)n.focus()}))}
 const cn=document.querySelector('link[rel=canonical]')||document.head.appendChild(Object.assign(document.createElement('link'),{rel:'canonical'}));cn.href=(CONFIG.siteUrl||location.origin)+location.pathname+(PK[k]?'#/'+k:'');
 document.querySelectorAll('input.age').forEach(c=>c.addEventListener('change',()=>{const a=c.closest('label').nextElementSibling;if(c.checked){a.href=a.dataset.u;a.removeAttribute('aria-disabled')}else{a.removeAttribute('href');a.setAttribute('aria-disabled','true')}}));
 document.title=PK[k]?(k=='free'?'Free Sample Reading':PK[k].n)+' — Personal Code':'Personal Code — a reading of your name and birthdate'}
$('#fab').onclick=()=>{$('#panel').hidden=!$('#panel').hidden;if(!$('#panel').hidden)$('#ms').focus()};$('#x').onclick=()=>$('#panel').hidden=true;
addEventListener('keydown',e=>{if(e.key=='Escape')$('#panel').hidden=true});
$('#fb').addEventListener('submit',async e=>{e.preventDefault();if(!$('#fa').checked){$('#fs').textContent='Please confirm you are 18 or older.';return}const s=$('#fs');s.textContent='Sending…';
 try{const r=await fetch('/api/feedback',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({type:$('#ty').value,message:$('#ms').value,name:$('#fn').value,email:$('#fe').value,consent:$('#fc').checked,website:$('#hp').value})});
 const d=await r.json();s.textContent=r.ok?'Thank you for sharing.':(d.error||'Something went wrong.');if(r.ok)e.target.reset()}catch(x){s.textContent='Could not send. Please try again.'}});
addEventListener('hashchange',route);route();

const SI=window.SITE||{};if(SI.operatorName&&SI.contactEmail){const o=$('#op');o.append('Operated by '+SI.operatorName+' \u00b7 ');const a=document.createElement('a');a.href='mailto:'+SI.contactEmail;a.textContent=SI.contactEmail;o.append(a,' \u00b7 ')}
