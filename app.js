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

// Problems chart: grow the bars and count up the numbers when the chart scrolls into view.
(function(){
const sec=document.querySelector('.x-stats');
if(!sec)return;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const nums=[...sec.querySelectorAll('.x-bar-num')];
function countUp(){nums.forEach((el,i)=>{const target=+el.dataset.value,start=performance.now()+i*110+300,dur=900;
 el.textContent='0%';
 function tick(t){const k=Math.min(1,Math.max(0,(t-start)/dur));el.textContent=Math.round(target*(1-Math.pow(1-k,3)))+'%';if(k<1)requestAnimationFrame(tick);}
 requestAnimationFrame(tick);});}
if(reduce||!('IntersectionObserver' in window)){sec.classList.add('is-in');return;}
const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){sec.classList.add('is-in');countUp();io.disconnect();}});},{threshold:.35});
io.observe(sec.querySelector('.x-chart'));
})();

// Apple-style scroll reveal: fade and lift blocks into view, staggered within each group.
(function(){
 const root=document.getElementById('anorik-refined-studio');
 if(!root||matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window))return;
 const sel='.x-proof>div,.x-section-title,.x-stats-head,.x-chart,.x-stats-more,.x-case-head,.x-case-facts>div,.x-case-foot,.x-for-list>li,.x-for-note,.x-service-list>li,.x-project,.x-about-text,.x-about-points>div,.x-faq-list,.x-contact-intro,.x-form';
 const items=[...root.querySelectorAll(sel)].filter(el=>!el.closest('.x-stats-head')||el.classList.contains('x-stats-head'));
 items.forEach(el=>{
  const sibs=[...el.parentElement.children].filter(c=>items.includes(c));
  const i=sibs.indexOf(el);
  if(sibs.length>1)el.style.setProperty('--d',(Math.min(i,5)*90)+'ms');
  el.classList.add('x-rv');
 });
 root.classList.add('x-anim');
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target);}}),{rootMargin:'0px 0px -8% 0px',threshold:.12});
 items.forEach(el=>{
  // Anything already on screen at load appears straight away.
  if(el.getBoundingClientRect().top<innerHeight*.92)el.classList.add('is-in');else io.observe(el);
 });
})();

// Mobile quick-contact bar: stay out of the way until the hero buttons have scrolled off.
(function(){
 const root=document.getElementById('anorik-refined-studio');const acts=root&&root.querySelector('.x-hero .x-actions');
 if(!acts)return;let f=0;
 function upd(){f=0;root.classList.toggle('x-bar-hidden',acts.getBoundingClientRect().bottom>0);}
 addEventListener('scroll',()=>{if(!f)f=requestAnimationFrame(upd)},{passive:true});upd();
})();

// ===== Scroll-driven motion (Apple style) =====
(function(){
 const root=document.getElementById('anorik-refined-studio');
 if(!root||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 root.classList.add('x-motion');
 const clamp=v=>Math.max(0,Math.min(1,v));
 const ease=t=>1-Math.pow(1-t,3);
 function words(el,cls){
  const t=el.textContent.trim().split(/\s+/);el.textContent='';
  return t.map((w,i)=>{const s=document.createElement('span');s.className=cls;s.textContent=w;s.style.setProperty('--wi',i);el.appendChild(s);if(i<t.length-1)el.appendChild(document.createTextNode(' '));return s;});
 }
 // 1. Hero headline: words sharpen into place one by one.
 const h1=root.querySelector('.x-hero h1');
 if(h1){h1.setAttribute('aria-label',h1.textContent.trim());words(h1,'x-w');h1.classList.add('x-words');}
 // 2. Case study screenshot grows to full size as it scrolls in.
 const shot=root.querySelector('.x-case-shot');
 // 3. About statement lights up word by word while scrolling.
 const about=root.querySelector('.x-about-text');const aw=about?words(about,'x-aw'):[];
 // 4. Process: a progress line fills and each step lights up in turn.
 const steps=root.querySelector('.x-steps');const stepItems=steps?[...steps.children]:[];
 const heroCopy=root.querySelector('.x-hero-copy');
 let f=0;
 function tick(){
  f=0;const vh=innerHeight;
  if(heroCopy){const p=clamp(scrollY/(vh*.9));heroCopy.style.setProperty('--hp',p.toFixed(3));}
  if(shot){const r=shot.getBoundingClientRect();const p=ease(clamp((vh-r.top)/(vh*.85)));shot.style.setProperty('--sp',p.toFixed(3));}
  if(aw.length){const r=about.getBoundingClientRect();const p=clamp((vh*.85-r.top)/(r.height+vh*.35));const n=Math.round(p*aw.length);aw.forEach((w,i)=>w.classList.toggle('on',i<n));}
  if(steps){const r=steps.getBoundingClientRect();const p=clamp((vh*.8-r.top)/(r.height*.9+vh*.25));steps.style.setProperty('--pp',p.toFixed(3));stepItems.forEach((li,i)=>li.classList.toggle('on',p>=(i+.35)/stepItems.length));}
 }
 addEventListener('scroll',()=>{if(!f)f=requestAnimationFrame(tick)},{passive:true});
 addEventListener('resize',()=>{if(!f)f=requestAnimationFrame(tick)});tick();
 // 5. Big numbers count up when they appear.
 root.querySelectorAll('.x-proof dt').forEach(dt=>{
  const m=dt.textContent.trim().match(/^(\d+)(\D.*)$/);if(!m||+m[1]<10)return;
  const end=+m[1],suf=m[2];dt.textContent='0'+suf;
  const io=new IntersectionObserver(es=>{if(!es[0].isIntersecting)return;io.disconnect();const t0=performance.now();
   (function step(t){const k=Math.min(1,(t-t0)/1400);dt.textContent=Math.round(end*ease(k))+suf;if(k<1)requestAnimationFrame(step);})(t0);},{threshold:.6});
  io.observe(dt);
 });
 // 6. Cards: soft wine spotlight follows the pointer.
 if(matchMedia('(pointer:fine)').matches){
  root.querySelectorAll('.x-service-list>li,.x-for-list>li,.x-steps>li,.x-about-points>div,.x-project').forEach(c=>{
   c.classList.add('x-spot');
   c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px');});
  });
 }
})();

// Header turns dark while it sits over a black section.
(function(){
 const root=document.getElementById('anorik-refined-studio');const head=root&&root.querySelector('.x-head');
 if(!head)return;const dark=[...root.querySelectorAll('.x-case,.x-about')];let f=0;
 function upd(){f=0;const y=head.getBoundingClientRect().bottom-4;root.classList.toggle('x-head-dark',dark.some(s=>{const r=s.getBoundingClientRect();return r.top<=y&&r.bottom>y;}));}
 addEventListener('scroll',()=>{if(!f)f=requestAnimationFrame(upd)},{passive:true});upd();
})();

// ANORIK wordmark: letters flick through typefaces, then settle (on load and on hover).
(function(){
 const root=document.getElementById('anorik-refined-studio');if(!root)return;
 const pool=['abril','archivo','bebas','bodoni','cinzel','cormorant','dmserif','fraunces','grotesk','italiana','majormono','monoton','playfair','plexserif','righteous','rubikmono','syne','unbounded'];
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 root.querySelectorAll('.al-brand-name').forEach(name=>{
  const letters=[...name.children];let busy=false;
  function shuffle(){
   if(busy||reduce)return;busy=true;name.classList.add('is-shuffling');
   const t0=performance.now();let last=0;
   // Keep every letter in its final-width box so the header doesn't jump while fonts flick.
   letters.forEach(l=>{l.style.width=l.offsetWidth+'px';l.classList.remove('is-set');});
   (function step(t){
    if(t-last>70){last=t;letters.forEach((l,i)=>{if(!l.classList.contains('is-set'))l.style.fontFamily="'wm-"+pool[Math.random()*pool.length|0]+"'";});}
    letters.forEach((l,i)=>{if(!l.classList.contains('is-set')&&t-t0>600+i*140){l.style.fontFamily='';l.classList.add('is-set');}});
    if(letters.every(l=>l.classList.contains('is-set'))){letters.forEach(l=>l.style.width='');name.classList.remove('is-shuffling');busy=false;return;}
    requestAnimationFrame(step);
   })(t0);
  }
  const logo=name.closest('.al-logo');
  if(name.closest('.x-head'))(document.fonts?document.fonts.ready:Promise.resolve()).then(()=>setTimeout(shuffle,200));
  if(logo&&matchMedia('(hover:hover)').matches)logo.addEventListener('mouseenter',shuffle);
 });
})();
