(function(){
const root=document.getElementById('anorik-refined-studio');
let language;
try{language=localStorage.getItem('anorik-language')==='ka'?'ka':'en'}catch(e){language='en'}

const goals={
 en:[
  {plan:['Find where visitors drop off today and what stops them from contacting you.','Rewrite the offer and structure pages around the questions customers actually ask.','Make every page end in one clear next step — call, form or booking — and measure it.'],cta:'Plan more inquiries with us',kind:'Redesign'},
  {plan:['Map the repetitive work: inquiries, orders, reports, copy-pasting between tools.','Connect your tools so data moves on its own, with an admin panel for what’s left.','Hand off routine follow-ups to automations and AI agents with clear rules.'],cta:'Plan the automation with us',kind:'Automation'},
  {plan:['Review your current site against the businesses you compete with.','Design a clear, distinctive site that reflects the quality of your work.','Build it fast and easy to update, so it stays current after launch.'],cta:'Plan the new site with us',kind:'New website'}
 ],
 ka:[
  {plan:['ვარკვევთ, სად ტოვებენ ვიზიტორები საიტს და რა უშლით ხელს დაგიკავშირდნენ.','ვწერთ შეთავაზებას და ვაწყობთ გვერდებს იმ კითხვების მიხედვით, რასაც მომხმარებლები რეალურად სვამენ.','ყოველი გვერდი მთავრდება ერთი გასაგები ნაბიჯით — ზარი, ფორმა ან ჯავშანი — და ვზომავთ შედეგს.'],cta:'დავგეგმოთ მეტი მოთხოვნა',kind:'Redesign'},
  {plan:['ვაღწერთ განმეორებად სამუშაოს: მოთხოვნები, შეკვეთები, ანგარიშები, ინსტრუმენტებს შორის კოპირება.','ვაკავშირებთ შენს ინსტრუმენტებს, რომ მონაცემები თავად მოძრაობდეს, დანარჩენისთვის კი — ადმინპანელი.','რუტინულ კომუნიკაციას ავტომატიზაციასა და AI აგენტებს გადავცემთ მკაფიო წესებით.'],cta:'დავგეგმოთ ავტომატიზაცია',kind:'Automation'},
  {plan:['ვაფასებთ შენს ამჟამინდელ საიტს კონკურენტებთან შედარებით.','ვქმნით მკაფიო, გამორჩეულ დიზაინს, რომელიც შენი სამუშაოს ხარისხს ასახავს.','ვაწყობთ სწრაფად და მარტივად სამართავად, რომ გაშვების შემდეგაც აქტუალური დარჩეს.'],cta:'დავგეგმოთ ახალი საიტი',kind:'New website'}
 ]
};
let goal=0;

const formText={
 en:{sending:'Sending your inquiry…',sent:'Thank you — your inquiry has been sent. We’ll reply to your email shortly.',failed:'Your inquiry couldn’t be sent. Please email us at <a href="mailto:contact@anorik.com">contact@anorik.com</a>.',invalid:'Please add your name, a valid email and a few words about your project.'},
 ka:{sending:'მოთხოვნა იგზავნება…',sent:'გმადლობთ — მოთხოვნა გაიგზავნა. მალე გიპასუხებთ ელფოსტაზე.',failed:'მოთხოვნა ვერ გაიგზავნა. მოგვწერე პირდაპირ: <a href="mailto:contact@anorik.com">contact@anorik.com</a>.',invalid:'მიუთითე სახელი, სწორი ელფოსტა და რამდენიმე სიტყვა პროექტზე.'}
};

const form=document.getElementById('al-inquiry-form');
const status=document.getElementById('al-inquiry-status');
function pickKind(kind){const input=form.querySelector('input[name=kind][value="'+kind.replace(/"/g,'\\"')+'"]');if(input)input.checked=true;}

function renderGoal(animate){
 const g=goals[language][goal];
 const list=document.getElementById('x-plan');
 list.classList.remove('is-new');
 list.innerHTML=g.plan.map(t=>'<li>'+t+'</li>').join('');
 if(animate){void list.offsetWidth;list.classList.add('is-new');}
 document.getElementById('x-plan-cta-text').textContent=g.cta;
 root.querySelectorAll('[data-goal]').forEach(b=>{const on=Number(b.dataset.goal)===goal;b.setAttribute('aria-selected',String(on));b.tabIndex=on?0:-1;});
 document.getElementById('goal-panel').setAttribute('aria-labelledby','goal-tab-'+goal);
}
const tabs=[...root.querySelectorAll('[data-goal]')];
tabs.forEach(b=>{
 b.addEventListener('click',()=>{goal=Number(b.dataset.goal);renderGoal(true);});
 b.addEventListener('keydown',e=>{
  const d=e.key==='ArrowDown'||e.key==='ArrowRight'?1:e.key==='ArrowUp'||e.key==='ArrowLeft'?-1:0;
  if(!d)return;e.preventDefault();goal=(goal+d+tabs.length)%tabs.length;renderGoal(true);tabs[goal].focus();
 });
});
document.getElementById('x-plan-cta').addEventListener('click',()=>pickKind(goals[language][goal].kind));
root.querySelectorAll('[data-pick-kind]').forEach(a=>a.addEventListener('click',()=>pickKind(a.dataset.pickKind)));

function renderLocale(){
 document.documentElement.lang=language;root.dataset.language=language;root.lang=language;
 try{localStorage.setItem('anorik-language',language)}catch(e){}
 root.querySelectorAll('[data-en]').forEach(el=>{const v=el.dataset[language];if(el.tagName==='H1'||el.childElementCount===0)el.innerHTML=v;});
 root.querySelectorAll('[data-placeholder-en]').forEach(el=>el.placeholder=el.dataset[language==='en'?'placeholderEn':'placeholderKa']);
 root.querySelectorAll('[data-language-button]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.languageButton===language)));
 if(!status.hidden&&status.dataset.key)status.innerHTML=formText[language][status.dataset.key];
 renderGoal(false);
}
root.querySelectorAll('[data-language-button]').forEach(b=>b.addEventListener('click',()=>{language=b.dataset.languageButton;renderLocale();}));

// highlight the section in view
const navLinks=[...root.querySelectorAll('.x-nav a')];
const sections=navLinks.map(a=>document.querySelector(a.hash));
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

renderLocale();updateNav();
})();
