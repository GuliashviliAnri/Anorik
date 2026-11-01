(function(){
const root=document.getElementById('anorik-refined-studio');
const language=root.dataset.language==='ka'?'ka':'en';
// First visit from a Georgian-language browser: open the Georgian page.
(function(){let saved=null;try{saved=localStorage.getItem('anorik-language')}catch(e){}
 if(!saved&&language==='en'&&location.pathname==='/'&&(navigator.language||'').toLowerCase().startsWith('ka')){location.replace('/ka/'+location.hash);}})();
root.querySelectorAll('[data-language-button]').forEach(a=>a.addEventListener('click',e=>{
 try{localStorage.setItem('anorik-language',a.dataset.languageButton)}catch(err){}
 e.preventDefault();location.href=a.getAttribute('href')+location.hash;}));

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
