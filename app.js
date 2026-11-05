(function(){
const root=document.getElementById('anorik-refined-studio');
const language=root.dataset.language==='ka'?'ka':'en';
// First visit from a Georgian-language browser: open the Georgian page.
(function(){let saved=null;try{saved=localStorage.getItem('anorik-language')}catch(e){}
 if(!saved&&language==='en'&&location.pathname==='/'&&(navigator.language||'').toLowerCase().startsWith('ka')){location.replace('/ka/'+location.hash);}})();
root.querySelectorAll('[data-language-button]').forEach(a=>a.addEventListener('click',e=>{
 try{localStorage.setItem('anorik-language',a.dataset.languageButton)}catch(err){}
 e.preventDefault();
 // Keep the visitor on the section they are actually looking at, not a stale #hash from an earlier click.
 let target='';
 if(window.scrollY>300){const mark=window.innerHeight*.3;document.querySelectorAll('main section[id]').forEach(s=>{if(s.getBoundingClientRect().top<=mark)target='#'+s.id;});}
 location.href=a.getAttribute('href')+target;}));

const formText={
 en:{sending:'Sending…',sent:'Thank you, it’s on its way. We’ll reply to your email within one business day.',failed:'Your message couldn’t be sent. Please email us at <a href="mailto:contact@anorik.com">contact@anorik.com</a> or write on <a href="https://wa.me/995574240286" target="_blank" rel="noopener noreferrer">WhatsApp</a>.',invalid:'Please add your name, a valid email and a few words about your website or project.',review:'Please review my website: '},
 ka:{sending:'იგზავნება…',sent:'გმადლობთ, გაიგზავნა. ერთ სამუშაო დღეში გიპასუხებთ ელფოსტაზე.',failed:'შეტყობინება ვერ გაიგზავნა. მოგვწერე პირდაპირ: <a href="mailto:contact@anorik.com">contact@anorik.com</a> ან <a href="https://wa.me/995574240286" target="_blank" rel="noopener noreferrer">WhatsApp-ში</a>.',invalid:'მიუთითე სახელი, სწორი ელფოსტა და რამდენიმე სიტყვა შენს საიტზე ან პროექტზე.',review:'გთხოვთ, შეამოწმოთ ჩემი საიტი: '}
};

const form=document.getElementById('al-inquiry-form');
const status=document.getElementById('al-inquiry-status');
const message=document.getElementById('al-message');
function pickKind(kind){const input=form.querySelector('input[name=kind][value="'+kind.replace(/"/g,'\\"')+'"]');if(input)input.checked=true;}
root.querySelectorAll('[data-pick-kind]').forEach(a=>a.addEventListener('click',()=>pickKind(a.dataset.pickKind)));

// Hero review card: carry the website address into the contact form.
const review=document.getElementById('x-review');
if(review){review.addEventListener('submit',e=>{
 e.preventDefault();
 const url=document.getElementById('x-review-url').value.trim();
 pickKind('Free website review');
 if(url&&!message.value.includes(url))message.value=formText[language].review+url+(message.value?'\n'+message.value:'');
 document.getElementById('contact').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
 setTimeout(()=>document.getElementById('al-name').focus({preventScroll:true}),400);
});}

// highlight the section in view
const navLinks=[...root.querySelectorAll('.x-nav a,.x-nav-mobile a')];
const sections=[...new Set(navLinks.map(a=>a.hash))].map(h=>document.querySelector(h));
let frame=0;
function updateNav(){frame=0;let current=null;const mark=window.innerHeight*.3;sections.forEach(s=>{if(s&&s.getBoundingClientRect().top<=mark)current=s.id;});navLinks.forEach(a=>{if(a.hash==='#'+current)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}
window.addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(updateNav)},{passive:true});

let sending=false;
function show(key,state){status.hidden=false;status.dataset.state=state;status.dataset.key=key;status.innerHTML=formText[language][key];}
form.addEventListener('submit',async e=>{
 e.preventDefault();
 if(sending)return;
 if(!form.checkValidity()){show('invalid','error');form.querySelector(':invalid').focus();return;}
 const data=new FormData(form);
 const button=form.querySelector('button[type=submit]');
 sending=true;button.disabled=true;show('sending','pending');
 try{
  const res=await fetch('/api/contact',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({
   name:data.get('name'),email:data.get('email'),message:data.get('message'),website:data.get('website'),language,kind:data.get('kind'),features:[]
  })});
  if(res.ok){show('sent','success');form.reset();}
  else show(res.status===422?'invalid':'failed','error');
 }catch(err){show('failed','error');}
 finally{sending=false;button.disabled=false;}
});

updateNav();
})();

// Customer journey diagram: visitors flow through four steps; a typical site loses many at each step.
(function(){
const sec=document.querySelector('.x-journey');
if(!sec)return;
const flow=sec.querySelector('.x-jr-flow'),canvas=sec.querySelector('.x-jr-canvas'),ctx=canvas.getContext('2d');
const cards=[...sec.querySelectorAll('.x-jr-stage')],endDot=sec.querySelector('.x-jr-end-dot');
const buttons=[...sec.querySelectorAll('[data-mode-btn]')];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const C={wine:'#782f40',ok:'#2f6b4f',line:'#d8d3d1',white:'#ffffff'};
const DROP={before:[.42,.4,.33,.38],after:[.08,.06,.05,.05]};
let mode='before',W=0,H=0,dpr=1,horiz=true,pts=[],cum=[],total=0,anchorsAt=[];
let parts=[],last=0,spawnAcc=0,running=false,raf=0,touched=false;

function setMode(m){mode=m;sec.dataset.mode=m;buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.modeBtn===m)));if(reduce)drawStatic();}
buttons.forEach(b=>b.addEventListener('click',()=>{touched=true;sec.classList.remove('x-jr-hint');setMode(b.dataset.modeBtn);}));

function geometry(){
 const r=flow.getBoundingClientRect();W=r.width;H=r.height;dpr=Math.min(window.devicePixelRatio||1,2);
 canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
 horiz=window.innerWidth>900;
 const e=endDot.getBoundingClientRect(),ex=e.left+e.width/2-r.left,ey=e.top+e.height/2-r.top;
 const anchors=cards.map(c=>{const b=c.getBoundingClientRect();return horiz?{x:b.left+b.width/2-r.left,y:48,cardEdge:b.top-r.top}:{x:ex,y:b.top-r.top+46,cardEdge:b.left-r.left};});
 pts=horiz?[{x:0,y:48},...anchors,{x:ex,y:48}]:[{x:ex,y:0},...anchors,{x:ex,y:ey}];
 cum=[0];for(let i=1;i<pts.length;i++)cum.push(cum[i-1]+Math.hypot(pts[i].x-pts[i-1].x,pts[i].y-pts[i-1].y));
 total=cum[cum.length-1];anchorsAt=anchors.map((a,i)=>({s:cum[i+1],a}));
}
function at(s){for(let i=1;i<pts.length;i++){if(s<=cum[i]){const t=(s-cum[i-1])/((cum[i]-cum[i-1])||1);return{x:pts[i-1].x+(pts[i].x-pts[i-1].x)*t,y:pts[i-1].y+(pts[i].y-pts[i-1].y)*t};}}return pts[pts.length-1];}

function hit(el,cls){el.classList.add(cls||'is-hit');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove(cls||'is-hit'),520);}

function drawLane(){
 ctx.clearRect(0,0,W,H);
 ctx.save();ctx.strokeStyle=C.line;ctx.lineWidth=2;ctx.setLineDash([2,7]);ctx.lineCap='round';
 ctx.beginPath();ctx.moveTo(pts[0].x,pts[0].y);for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i].x,pts[i].y);ctx.stroke();
 if(horiz){anchorsAt.forEach(({a})=>{ctx.beginPath();ctx.moveTo(a.x,a.y+8);ctx.lineTo(a.x,a.cardEdge-2);ctx.stroke();});}
 ctx.restore();
 const col=mode==='after'?C.ok:C.wine;
 anchorsAt.forEach(({a})=>{ctx.beginPath();ctx.arc(a.x,a.y,7,0,Math.PI*2);ctx.fillStyle=C.white;ctx.fill();ctx.lineWidth=2;ctx.strokeStyle=col;ctx.stroke();});
}
function dot(x,y,r,color,alpha){ctx.globalAlpha=alpha;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();ctx.globalAlpha=1;}

function spawn(){parts.push({s:0,next:0,off:(Math.random()-.5)*14,ph:Math.random()*6.28,v:(horiz?110:80)*(.85+Math.random()*.3),c:mode==='after'?C.ok:C.wine,fall:null});}

function step(t){
 const dt=Math.min(.05,(t-last)/1000||0);last=t;
 spawnAcc+=dt;const every=.2;while(spawnAcc>every){spawnAcc-=every;spawn();}
 drawLane();
 for(let i=parts.length-1;i>=0;i--){const p=parts[i];
  if(p.fall){p.fall.vx+=p.fall.ax*dt;p.fall.vy+=p.fall.ay*dt;p.fall.x+=p.fall.vx*dt;p.fall.y+=p.fall.vy*dt;p.fall.a-=dt*1.4;
   if(p.fall.a<=0){parts.splice(i,1);continue;}dot(p.fall.x,p.fall.y,4,C.wine,Math.max(0,p.fall.a));continue;}
  p.s+=p.v*dt;p.ph+=dt*3;
  while(p.next<anchorsAt.length&&p.s>=anchorsAt[p.next].s){
   if(Math.random()<DROP[mode][p.next]){const q=at(anchorsAt[p.next].s);const w=p.off+Math.sin(p.ph)*3;
    p.fall=horiz?{x:q.x+(Math.random()-.5)*10,y:q.y+w,vx:(Math.random()-.5)*30,vy:20,ax:0,ay:260,a:1}:{x:q.x+w,y:q.y,vx:20,vy:(Math.random()-.5)*30,ax:260,ay:0,a:1};
    hit(cards[p.next]);break;}
   p.next++;}
  if(p.fall)continue;
  if(p.s>=total){parts.splice(i,1);hit(endDot);continue;}
  const q=at(p.s),w=p.off+Math.sin(p.ph)*3;
  dot(horiz?q.x:q.x+w,horiz?q.y+w:q.y,4.5,p.c,.95);
 }
 raf=running?requestAnimationFrame(step):0;
}
function drawStatic(){geometry();drawLane();
 // a calm snapshot: visitors on the lane, fewer after each step in the typical mode
 const keep=mode==='after'?[1,.92,.86,.8,.76]:[1,.58,.35,.23,.14];
 for(let i=0;i<pts.length-1;i++){const n=Math.round(6*keep[i]);for(let k=0;k<n;k++){const s=cum[i]+(cum[i+1]-cum[i])*(k+.5)/6;const q=at(s);dot(q.x,q.y,4.5,mode==='after'?C.ok:C.wine,.9);}}}

function start(){if(running||reduce)return;running=true;last=performance.now();raf=requestAnimationFrame(step);}
function stop(){running=false;if(raf)cancelAnimationFrame(raf);raf=0;}
geometry();
if(reduce){drawStatic();}
else{
 sec.classList.add('x-jr-hint');
 new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting?start():stop()),{threshold:.15}).observe(sec);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
}
let rt=0,lastW=0;
// Recompute when the cards change size (fonts loading, mode switch, rotation) so the canvas never stretches.
new ResizeObserver(()=>{clearTimeout(rt);rt=setTimeout(()=>{const w=flow.getBoundingClientRect().width;geometry();if(Math.abs(w-lastW)>1)parts=[];lastW=w;if(reduce)drawStatic();},60);}).observe(flow);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{geometry();if(reduce)drawStatic();});
})();
