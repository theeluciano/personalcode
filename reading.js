const $=s=>document.querySelector(s),A=Astronomy;
const NAMES={core:'Core Code',signature:'Signature Code',deep:'Deep Code',gift:'Master Code'},RANK={core:1,signature:2,deep:3,gift:0};
const SGN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const ST=['starts boldly and leads from the front','builds steadily and values what lasts','thinks fast and connects ideas','protects and feels deeply','creates warmly and wants to be seen','refines with care and serves with skill','seeks balance and fair dealing','goes deep and transforms','explores and searches for meaning','climbs patiently toward goals','innovates and thinks for the group','imagines and feels everything'];
const EL=['fire (action and spark)','earth (structure and practicality)','air (ideas and connection)','water (feeling and intuition)'];
const PL=['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune','Pluto'];
const PF={Sun:'your core identity',Moon:'your feelings and needs',Mercury:'how you think and speak',Venus:'what you love and value',Mars:'how you act and push',Jupiter:'where you grow',Saturn:'where you learn discipline',Uranus:'where you break the pattern',Neptune:'where you dream and blur',Pluto:'where you transform',Rising:'how you come across'};
const HF=['self','money and values','communication','home and roots','creativity and romance','work and health','partnership','shared resources and depth','beliefs and travel','career and public life','community and hopes','the hidden self'];
const AS=[['conjunction',0,8,'fuse, so they act as one force'],['sextile',60,5,'support each other, an easy opening'],['square',90,7,'pull against each other, which creates tension and growth'],['trine',120,7,'flow together with natural ease'],['opposition',180,8,'sit across from each other, asking you to balance both']];
const N={1:'initiative and independence',2:'cooperation, sensitivity and balance',3:'expression and creativity',4:'structure, discipline and building',5:'change, freedom and curiosity',6:'care, responsibility and harmony',7:'study, depth and inner truth',8:'ambition, authority and material mastery',9:'compassion, completion and wide vision',11:'intuition and inspiration, with pressure to match',22:'large-scale building that turns vision into form',33:'devoted teaching and service'};
const SE={1:['self-starting drive','going it alone'],2:['tact and partnership','losing yourself in others'],3:['expressive charm','scattered energy'],4:['reliable structure','rigidity'],5:['adaptability','restlessness'],6:['care and responsibility','over-giving'],7:['depth and analysis','withdrawing'],8:['ambition and authority','overwork and control'],9:['compassion and vision','letting go late']};
const M=n=>n==11||n==22||n==33,ds=n=>[...String(n)].reduce((a,b)=>a+ +b,0);
const red=n=>{while(n>9&&!M(n))n=ds(n);return n},r9=n=>{while(n>9)n=ds(n);return n};
const nm=x=>((x%360)+360)%360,deg=l=>Math.floor(l%30)+'° '+SGN[Math.floor(l/30)];
const lab=n=>{const t=[n];while(n>9&&!M(n)){n=ds(n);t.push(n)}return t.join('/')};
const lonOf=(b,d)=>nm(b=='Sun'?A.SunPosition(d).elon:b=='Moon'?A.EclipticGeoMoon(d).lon:A.Ecliptic(A.GeoVector(A.Body[b],d,true)).elon);
const rx=(b,d)=>!['Sun','Moon'].includes(b)&&((lonOf(b,new Date(+d+864e5))-lonOf(b,d)+540)%360)-180<0;
function ascOf(d,lat,lon){const T=(d-Date.UTC(2000,0,1,12))/864e5/36525,e=(23.4392911-0.0130042*T)*Math.PI/180,r=nm(A.SiderealTime(d)*15+lon)*Math.PI/180,p=lat*Math.PI/180;return nm(Math.atan2(Math.cos(r),-(Math.sin(r)*Math.cos(e)+Math.tan(p)*Math.sin(e)))*180/Math.PI)}
const V=(w,vow)=>[...w.normalize('NFD').toLowerCase().replace(/[^a-z]/g,'')].filter(c=>vow===undefined||('aeiou'.includes(c)===vow)).reduce((s,c)=>s+(c.charCodeAt(0)-97)%9+1,0);
async function geo(q){try{const r=await fetch('/api/geocode?q='+encodeURIComponent(q));return r.ok?await r.json():null}catch(e){return null}}

async function build(R,name,y,m,d,place,time,tz){
 const S=[],add=(h,...l)=>S.push({h,l});
 let g=place?await geo(place):null,when,conv,note=[];
 if(time&&!isNaN(tz)){const[hh,mi]=time.split(':').map(Number);when=new Date(Date.UTC(y,m-1,d,hh,mi)-tz*36e5);conv='the birth time you gave'}
 else if(g){const s=A.SearchRiseSet(A.Body.Sun,new A.Observer(g.lat,g.lon,0),1,new Date(Date.UTC(y,m-1,d)-g.lon/15*36e5),1);when=s?s.date:new Date(Date.UTC(y,m-1,d,12));conv='sunrise at your birthplace'}
 else{when=new Date(Date.UTC(y,m-1,d,12));conv='noon UT'}
 if(place&&!g)note.push('We could not find that place, so your Rising sign was left out.');
 const L={};PL.forEach(b=>L[b]=lonOf(b,when));
 const asc=(g&&conv!='noon UT')?ascOf(when,g.lat,g.lon):null;
 // Numbers
 const lpA=red(ds(d)+ds(m)+ds(y)),lpB=red(red(d)+red(m)+red(y)),lp=(lpA!==lpB&&M(lpA))?lpA+'/'+lpB:''+lpB,lpK=M(lpA)?lpA:lpB;
 const bd=red(d),ex=red(V(name)),so=red(V(name,true)),pe=red(V(name,false));
 const now=new Date(),py=r9(r9(m)+r9(d)+r9(now.getFullYear())),pm=r9(py+now.getMonth()+1);
 // Core
 const sunL=L.Sun;
 const T=(p,l,x)=>p+(x?' (retrograde)':'')+' in '+deg(l)+' ('+PF[p]+'): you tend to be someone who '+ST[Math.floor(l/30)]+'.';
 const c1=[T('Sun',sunL)+((sunL%30<1||sunL%30>29)?' You were born close to a sign boundary, so your birth time would settle this.':''),T('Moon',L.Moon)];
 let moonNote='';if(conv!='the birth time you gave'){const d0=Date.UTC(y,m-1,d)-(g?g.lon/15*36e5:0),ma=lonOf('Moon',new Date(d0)),mb=lonOf('Moon',new Date(d0+864e5-6e4));if(Math.floor(ma/30)!=Math.floor(mb/30)){moonNote='Your Moon changed sign on your birth date, so its sign depends on your birth time. We used '+(g?'sunrise at your birthplace':'midday UT')+'; add your birth time to confirm it.';note.push(moonNote)}}
 c1.push(asc!=null?T('Rising',asc)+' (Calculated for '+conv+'.)':'Your outward presence needs a birthplace. Add one to complete this.');
 add('Your Signature',...c1,...note);
 add('Your Code','Life Path '+lp+': '+N[lpK]+'.','Birthday Number '+lab(d)+': '+N[bd]+'.','Expression '+lab(V(name))+': '+N[ex]+'. This is your natural toolkit.','Soul Urge '+lab(V(name,true))+': '+N[so]+'. This is your inner drive.','Personality '+lab(V(name,false))+': '+N[pe]+'. This is your outer signal.');
 if(R>=1){const cs=Seal.colours({L,N,nums:{lp,lpK,lpR:r9(lpB)}});S.push({h:'Your Power Colours',sw:cs.items[0].c,l:cs.items.slice(1).map(i=>i.t=='b'?i.k+': '+i.x:i.x)})}
 add('Strengths and Growth Edges','Strengths: '+SE[r9(ex)][0]+' (Expression) and '+SE[r9(so)][0]+' (Soul Urge).','Growth edges: watch for '+SE[r9(lpB)][1]+' (Life Path) and '+SE[r9(pe)][1]+' (Personality).');
 add('This Year','Personal Year '+py+': a year of '+N[py]+'.');
 if(R>=2){
  const SX=f=>Math.floor(L[f]/30)%12,RR=b=>rx(b,when)?' (retrograde)':'',SLx=Seal.SL;
  add('Your Inner Voices','Mercury'+RR('Mercury')+' in '+deg(L.Mercury)+' (how you think and speak): you decide '+SLx[SX('Mercury')].t+'.','Venus'+RR('Venus')+' in '+deg(L.Venus)+' (what you love and value): you prize '+SLx[SX('Venus')].l+'.','Mars'+RR('Mars')+' in '+deg(L.Mars)+' (how you act and push): you work '+SLx[SX('Mars')].w+'.','Jupiter in '+deg(L.Jupiter)+' (where you grow): you expand fastest when you work '+SLx[SX('Jupiter')].w+'.','Saturn in '+deg(L.Saturn)+' (where you learn discipline): you are held to '+SLx[SX('Saturn')].l+'.','Uranus, Neptune and Pluto ('+deg(L.Uranus)+', '+deg(L.Neptune)+', '+deg(L.Pluto)+') are shared by everyone born in your window of years. They describe your generation, not your individual edge.');
  const P={...L};if(asc!=null)P.Rising=asc;const k=Object.keys(P),ap=[];
  for(let i=0;i<k.length;i++)for(let j=i+1;j<k.length;j++){const df=Math.min(nm(P[k[i]]-P[k[j]]),360-nm(P[k[i]]-P[k[j]]));for(const[n,a,o,t]of AS){const lim=(k[i]=='Rising'||k[j]=='Rising')?Math.min(o,5):o,e=Math.abs(df-a);if(e<=lim)ap.push([e,k[i],n,k[j],t])}}
  ap.sort((a,b)=>a[0]-b[0]);
  add('Your Strongest Currents',...ap.slice(0,10).map(([e,a,n,b,t])=>a+' in '+SGN[Math.floor(P[a]/30)%12]+' '+n+' '+b+' in '+SGN[Math.floor(P[b]/30)%12]+' ('+e.toFixed(1)+'° orb): With '+PF[a]+' on one side and '+PF[b]+' on the other, the two '+t+'.'));
  const cnt=[0,0,0,0];[...PL.slice(0,7),...(asc!=null?['Rising']:[])].forEach(b=>cnt[Math.floor((b=='Rising'?asc:L[b])/30)%4]++);
  const de=cnt.indexOf(Math.max(...cnt)),all=[lpB,bd,ex,so,pe,py].map(r9),fr={};all.forEach(x=>fr[x]=(fr[x]||0)+1);const top=Object.entries(fr).sort((a,b)=>b[1]-a[1])[0];
  add('How It All Fits Together','Your pattern leans toward '+EL[de]+', while your Life Path carries '+N[lpK]+'. Where the two agree, lean in. Where they differ, that is your growth work.',top[1]>1?'The number '+top[0]+' appears '+top[1]+' times in your code, so its theme, '+N[top[0]]+', is a loud one for you.':'No single number dominates your code, so your themes are varied.');
  add('This Month','Personal Month '+pm+': a month for '+N[pm]+', inside a '+py+' year.');
 }
 if(R>=3){
  const e1=36-r9(lpB),p=[r9(m)+r9(d),r9(d)+r9(y),0,r9(m)+r9(y)].map(r9);p[2]=r9(p[0]+p[1]);
  add('Your Life Seasons','Birth to about age '+e1+': '+p[0]+', '+N[p[0]]+'.','About '+e1+' to '+(e1+9)+': '+p[1]+', '+N[p[1]]+'.','About '+(e1+9)+' to '+(e1+18)+': '+p[2]+', '+N[p[2]]+'.','From about '+(e1+18)+': '+p[3]+', '+N[p[3]]+'.');
  const c=[Math.abs(r9(m)-r9(d)),Math.abs(r9(d)-r9(y))];c[2]=Math.abs(c[0]-c[1]);c[3]=Math.abs(r9(m)-r9(y));
  add('Your Growth Tests',...c.map((x,i)=>'Test '+(i+1)+': '+(x?x+', '+N[x]+'.':'0, choosing without a fixed rule.')));
  add('Where Your Life Plays Out',...(asc!=null?PL.map(b=>b+' in house '+(((Math.floor(L[b]/30)-Math.floor(asc/30)+12)%12)+1)+' ('+HF[((Math.floor(L[b]/30)-Math.floor(asc/30)+12)%12)]+'): '+PF[b]+', expressed through '+HF[((Math.floor(L[b]/30)-Math.floor(asc/30)+12)%12)]+'.'):['This needs a birthplace. Add one to see it.']));
  add('Reflection Prompts',...[['Life Path',lpK],['Expression',ex],['Soul Urge',so],['Personality',pe]].map(([a,x])=>a+': think about '+N[x]+'. Where does it show up in your week, and where is it missing?'));
 }
 if(R>=3||R==0){const rxF={Mercury:rx('Mercury',when),Venus:rx('Venus',when),Mars:rx('Mars',when)};
  S.gift=Seal.make({name,y,m,d,now,L,rx:rxF,conv,moonNote,N,nums:{lp,lpK,lpR:r9(lpB),bd,bdL:lab(d),ex,exL:lab(V(name)),so,soL:lab(V(name,true)),pe,peL:lab(V(name,false)),py,pm}})}
 return S}

const onCol=h=>{const c=[0,2,4].map(i=>parseInt(h.substr(i,2),16)/255).map(v=>v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4));return .2126*c[0]+.7152*c[1]+.0722*c[2]>.35?'#0B0B0B':'#FFFFFF'};
const hexRGB=h=>[0,2,4].map(i=>parseInt(h.substr(i,2),16)),onRgb=h=>onCol(h)=='#FFFFFF'?[255,255,255]:[11,11,11];
function render(S){const o=document.createElement('div');
 S.forEach(s=>{const c=document.createElement('section');c.className='card sec';const h=document.createElement('h3');h.textContent=s.h;c.appendChild(h);if(s.sw){const w=document.createElement('div');w.className='sws';s.sw.forEach(x=>{const k=document.createElement('span');k.className='swc';k.style.background='#'+x.h;k.style.color=onCol(x.h);k.textContent=x.n;w.appendChild(k)});c.appendChild(w)}s.l.forEach(t=>{const p=document.createElement('p');p.textContent=t;c.appendChild(p)});o.appendChild(c)});return o}
function pdf(S,name,tier,title){const{jsPDF}=window.jspdf,D=new jsPDF({unit:'pt',format:'a4'}),W=D.internal.pageSize.getWidth(),H=D.internal.pageSize.getHeight(),Mg=56;let y=Mg;
 const cl=t=>String(t).replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/[—–]/g,'-').replace(/[^\x00-\xFF]/g,'');
 const need=h=>{if(y+h>H-Mg){D.addPage();y=Mg}};
 D.setFont('helvetica','bold');D.setFontSize(26);D.setTextColor(25,18,32);D.text('Personal Code',Mg,y);y+=24;
 D.setFont('helvetica','italic');D.setFontSize(12);D.setTextColor(120,92,48);D.text(cl((title||NAMES[tier]+' reading')+' for '+name),Mg,y);y+=30;
 S.forEach(s=>{need(60);D.setFont('helvetica','bold');D.setFontSize(15);D.setTextColor(154,118,72);D.text(cl(s.h),Mg,y);y+=20;if(s.sw){need(50);s.sw.forEach((k,i)=>{const w=(W-2*Mg-10)/2;D.setFillColor(...hexRGB(k.h));D.rect(Mg+i*(w+10),y,w,34,'F');D.setFont('helvetica','bold');D.setFontSize(11);D.setTextColor(...onRgb(k.h));D.text(cl(k.n),Mg+i*(w+10)+w/2,y+21,{align:'center'})});y+=48}
  s.l.forEach(t=>{D.setFont('helvetica','normal');D.setFontSize(11);D.setTextColor(30,24,36);const ls=D.splitTextToSize(cl(t),W-2*Mg);need(ls.length*15+8);D.text(ls,Mg,y);y+=ls.length*15+6});y+=8});
 const n=D.getNumberOfPages();for(let i=1;i<=n;i++){D.setPage(i);D.setFont('helvetica','italic');D.setFontSize(9);D.setTextColor(130,120,130);D.text('Personal Code - for reflection and entertainment only. Page '+i+' of '+n,Mg,H-28)}
 D.save((title?'Master-Code-':'Personal-Code-')+(cl(name).replace(/[^\w]+/g,'-')||'reading')+'.pdf')}

function renderGift(G){const e=(t,c,x)=>{const n=document.createElement(t);if(c)n.className=c;if(x!=null)n.textContent=x;return n},p=e('div','paper');p.style.borderTopColor='#'+G.pc[0];
 p.append(e('div','gk',G.kicker),e('h2','gt',G.title),e('div','gs',G.sub),e('div','gs2',G.sub2));
 const it=x=>{let n;
  if(x.t=='p')n=e('p',null,x.x);
  else if(x.t=='b'){n=e('p');n.append(e('span','d','\u2666 '),e('b',null,x.k+': '),document.createTextNode(x.x))}
  else if(x.t=='s')n=e('div','gsub',x.x);
  else if(x.t=='d'){n=e('div','gd');n.append(e('b',null,x.k),e('i',null,'\u201c'+x.x+'\u201d'))}
  else if(x.t=='q'||x.t=='box'){n=e('div','gq');if(x.k)n.append(e('small',null,x.k));n.append(document.createTextNode(x.x))}
  else if(x.t=='aff'){n=e('div','ga');n.append(e('small',null,x.k),document.createTextNode(x.x))}
  else if(x.t=='sw'){n=e('div','sws');x.c.forEach(k=>{const s=e('span','swc',k.n);s.style.background='#'+k.h;s.style.color=onCol(k.h);n.append(s)})}
  else if(x.t=='wk'){n=e('div','wk');x.hz.forEach(h=>{const b=e('div','wkb');b.append(e('b',null,h.title),e('small',null,h.range),e('i',null,h.theme));const ol=e('ol');h.q.forEach(q=>ol.append(e('li',null,q)));b.append(ol,e('p','pr','Proof to look for: '+h.proof));for(let i=0;i<4;i++)b.append(e('div','wl'));n.append(b)})}
  else{n=e('div','gr'+(x.th?' th':''));n.append(e('span',null,x.a),e('span',null,x.b))}
  return n};
 G.intro.forEach(x=>p.append(it(x)));G.sec.forEach(s=>{p.append(e('h4','gh',s.h));s.i.forEach(x=>p.append(it(x)))});return p}
function pdfGift(G,name){const{jsPDF}=window.jspdf,D=new jsPDF({unit:'pt',format:'a4'}),W=D.internal.pageSize.getWidth(),H=D.internal.pageSize.getHeight(),Mg=58,CW=W-2*Mg,GD=hexRGB(G.pc[0]),DG=[107,104,99],DK=[11,11,11],GR=[107,104,99],CR=[237,232,219];let y=0;
 const cl=t=>String(t).replace(/[\u201c\u201d]/g,'"').replace(/[\u2018\u2019]/g,"'").replace(/[\u2014\u2013]/g,'-').replace(/\u2666/g,'').replace(/[^\x00-\xFF]/g,'').trim();
 const wr=(t,w)=>D.splitTextToSize(cl(t),w),ft=(st,sz,c)=>{D.setFont('helvetica',st);D.setFontSize(sz);D.setTextColor(...c)};
 const pg=()=>{D.addPage();D.setFillColor(...GD);D.rect(0,0,W,6,'F');y=Mg},need=h=>{if(y+h>H-50)pg()};
 const dia=(x,yy)=>{D.setFillColor(...GD);D.triangle(x,yy-3.5,x+3.2,yy,x-3.2,yy,'F');D.triangle(x-3.2,yy,x+3.2,yy,x,yy+3.5,'F')};
 D.setFillColor(...GD);D.rect(0,0,W,14,'F');D.setFillColor(...hexRGB(G.pc[1]));D.rect(W*.66,0,W*.34,14,'F');y=62;
 ft('bold',10,DG);D.text(cl(G.kicker),W/2,y,{align:'center',charSpace:3});y+=28;
 ft('bold',24,DK);const tl=wr(G.title,CW);D.text(tl,W/2,y,{align:'center'});y+=tl.length*28;
 ft('bold',11,DG);D.text(cl(G.sub),W/2,y,{align:'center'});y+=18;
 ft('italic',10.5,GR);const s2=wr(G.sub2,CW-40);D.text(s2,W/2,y,{align:'center'});y+=s2.length*14+10;
 D.setDrawColor(...GD);D.setLineWidth(1);D.line(Mg,y,W-Mg,y);y+=22;
 const item=x=>{
  if(x.t=='p'){ft('normal',11,DK);const l=wr(x.x,CW);need(l.length*15+8);D.text(l,Mg,y);y+=l.length*15+8}
  else if(x.t=='b'){const l=wr(x.x,CW-18),k=wr(x.k,CW-18);need((k.length+l.length)*15+12);dia(Mg+4,y-3.5);ft('bold',11,DK);D.text(k,Mg+18,y);y+=k.length*15;ft('normal',11,DK);D.text(l,Mg+18,y);y+=l.length*15+8}
  else if(x.t=='s'){need(44);y+=4;ft('bold',10.5,DG);D.text(cl(x.x),Mg,y);y+=18}
  else if(x.t=='d'){const l=wr('"'+x.x+'"',CW-30);need(l.length*15+24);ft('bold',9.5,DG);D.text(cl(x.k.toUpperCase()),Mg+14,y);y+=13;ft('italic',11,DK);D.text(l,Mg+14,y);y+=l.length*15+8}
  else if(x.t=='q'||x.t=='box'){const l=wr(x.x,CW-40),h=l.length*15+(x.k?36:26);need(h+10);D.setFillColor(...CR);D.rect(Mg,y,CW,h,'F');D.setFillColor(...GD);D.rect(Mg,y,4,h,'F');let yy=y+19;if(x.k){ft('bold',9.5,DG);D.text(cl(x.k),Mg+18,yy,{charSpace:1.5});yy+=16}ft('italic',11.5,DK);D.text(l,Mg+18,yy);y+=h+14}
  else if(x.t=='aff'){const l=wr(x.x,CW-60),h=l.length*16+54;need(h+10);D.setFillColor(...DK);D.rect(Mg,y,CW,h,'F');ft('bold',9.5,[245,240,228]);D.text(cl(x.k),W/2,y+24,{align:'center',charSpace:2});ft('italic',12,[245,240,228]);D.text(l,W/2,y+44,{align:'center'});y+=h+14}
  else if(x.t=='sw'){need(52);x.c.forEach((k,i)=>{const w=(CW-10)/2;D.setFillColor(...hexRGB(k.h));D.rect(Mg+i*(w+10),y,w,36,'F');ft('bold',11,onRgb(k.h));D.text(cl(k.n),Mg+i*(w+10)+w/2,y+22,{align:'center'})});y+=50}
  else if(x.t=='wk'){x.hz.forEach(h=>{ft('bold',11,DK);D.text(cl(h.title),Mg,y);ft('italic',9,GR);D.text(cl(h.range),W-Mg,y,{align:'right'});y+=13;ft('italic',9.5,DG);const th=wr(h.theme,CW);D.text(th,Mg,y);y+=th.length*12+3;ft('normal',9.5,DK);h.q.forEach((q,i)=>{const l=wr((i+1)+'. '+q,CW-8);D.text(l,Mg+8,y);y+=l.length*12+2});ft('bold',9,DG);const pr=wr('Proof to look for: '+h.proof,CW);D.text(pr,Mg,y);y+=pr.length*11+5;D.setDrawColor(150,150,150);D.setLineWidth(.4);for(let i=0;i<5;i++){D.line(Mg,y+10,W-Mg,y+10);y+=17}y+=10})}
  else{const a=wr(x.a,140),b=wr(x.b,CW-182),h=Math.max(a.length,b.length)*14+16;need(h);D.setFillColor(...(x.th?DK:CR));D.rect(Mg,y,CW,h,'F');ft('bold',x.th?9:10.5,x.th?[245,240,228]:DK);D.text(a,Mg+10,y+17);ft(x.th?'bold':'normal',x.th?9:10.5,x.th?[245,240,228]:DK);D.text(b,Mg+160,y+17);D.setDrawColor(...GD);D.setLineWidth(.4);D.line(Mg,y+h,W-Mg,y+h);y+=h}};
 G.intro.forEach(item);
 G.sec.forEach(s=>{if(s.pageBreak)pg();else{need(90);y+=10}ft('bold',12.5,DK);D.text(cl(s.h),Mg,y);y+=7;D.setDrawColor(...GD);D.setLineWidth(.9);D.line(Mg,y,W-Mg,y);y+=20;s.i.forEach(item)});
 const n=D.getNumberOfPages();for(let i=1;i<=n;i++){D.setPage(i);ft('italic',8.5,[130,120,130]);D.text('Personal Code - for reflection and entertainment only. Page '+i+' of '+n,W/2,H-26,{align:'center'})}
 D.save('Master-Code-'+(cl(name).replace(/[^\w]+/g,'-')||'reading')+'.pdf')}

// Page setup
const OP=(ph,a)=>`<option value="" disabled selected hidden>${ph}</option>`+a.map(([v,t])=>`<option value="${v}">${t}</option>`).join('');
$('#dd').innerHTML=OP('Day',Array.from({length:31},(_,i)=>[i+1,i+1]));
$('#mm').innerHTML=OP('Month',['January','February','March','April','May','June','July','August','September','October','November','December'].map((t,i)=>[i+1,t]));
$('#yy').innerHTML=OP('Year',Array.from({length:new Date().getFullYear()-1899},(_,i)=>{const y=new Date().getFullYear()-i;return[y,y]}));
$('#tz').value=-new Date().getTimezoneOffset()/60;
const q=new URLSearchParams(location.search),ref=q.get('reference')||q.get('trxref');let tier=null;
(async()=>{if(!ref){$('#st').textContent='Please open this page from your payment confirmation.';return}
 try{const r=await fetch('/api/unlock',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({reference:ref})}),d=await r.json();if(!r.ok)throw d;tier=d.tier;
  if(tier=='deep'){const u=d.until?new Date(d.until).toLocaleDateString(undefined,{year:'numeric',month:'long',day:'numeric'}):'';$('#bt').textContent='A surprise gift is waiting for you below.'+(u?' Your access runs until '+u+'.':'');$('#bn').hidden=false}
  $('#h').textContent=tier=='gift'?'Your Master Code':'Your '+NAMES[tier]+' reading';$('#st').textContent=tier=='gift'?'Payment confirmed. Enter your details to open your gift, then download it as a PDF. Bookmark this page: it is your way back within your access period.':'Payment confirmed. Enter your details to build your reading, then download it as a PDF. Bookmark this page: it is your way back within your access period.';if(tier=='gift')$('#placeBox').hidden=true;$('#f').hidden=false}
 catch(e){$('#st').textContent=(e&&e.error)||'We could not confirm your payment. Please contact us with your payment reference.';$('#st').className='lead err'}})();
$('#f').addEventListener('submit',async e=>{e.preventDefault();const er=$('#er'),y=+$('#yy').value,m=+$('#mm').value,d=+$('#dd').value,name=$('#nm').value.trim();
 if(new Date(Date.UTC(y,m-1,d)).getUTCDate()!==d){er.textContent='That date does not exist. Please check the day and month.';er.hidden=false;return}er.hidden=true;
 const b=$('#go');b.disabled=true;b.textContent='Building…';
 try{const S=await build(RANK[tier],name,y,m,d,$('#pl').value.trim(),$('#tm').value,parseFloat($('#tz').value));
  if(tier=='gift'){const gb=document.createElement('button');gb.className='btn';gb.textContent='Download my Master Code (PDF)';gb.onclick=()=>pdfGift(S.gift,name);const gp=renderGift(S.gift);$('#out').replaceChildren(gp,gb);gp.scrollIntoView({behavior:'smooth'});b.disabled=false;b.textContent=tier=='gift'?'Open my gift':'Build my reading';return}
  const o=render(S),dl=document.createElement('button');dl.className='btn';dl.textContent='Download PDF';dl.onclick=()=>pdf(S,name,tier);
  const nodes=[o,dl];
  if(S.gift){const g=document.createElement('div');g.className='card';g.style.borderColor='var(--violet)';g.innerHTML='<h3 style="font-size:1.8rem;color:var(--gold);margin-bottom:6px">A gift for you: your Master Code</h3><p class="note">Because you chose Deep Code, there is one more thing waiting for you.</p>';
   const rb=document.createElement('button');rb.className='btn ghost';rb.textContent='Reveal my gift';
   rb.onclick=()=>{rb.remove();g.appendChild(renderGift(S.gift));const gb=document.createElement('button');gb.className='btn';gb.textContent='Download my Master Code (PDF)';gb.onclick=()=>pdfGift(S.gift,name);g.appendChild(gb)};g.appendChild(rb);nodes.push(g)}
  $('#out').replaceChildren(...nodes);dl.scrollIntoView({block:'nearest'});o.scrollIntoView({behavior:'smooth'})}
 catch(x){er.textContent='Something went wrong building your reading. Please check your details and try again.';er.hidden=false}
 b.disabled=false;b.textContent=tier=='gift'?'Open my gift':'Build my reading'});
