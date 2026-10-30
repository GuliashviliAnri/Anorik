
(function(){
const root=document.getElementById('anorik-refined-studio');
const images={"home": "assets/project-ac85b511f7.webp", "catalog": "assets/project-e945e91689.webp"};
let language=localStorage.getItem('anorik-language')==='ka'?'ka':'en',project=null,stepStage=0;
const words={en:{titles:{web:'Product catalog',systems:'Business workflow',automation:'Automation workflow',support:'Maintenance checklist'},stages:['New','In progress','Done'],flow:['Receive request','Check information','Connect systems'],noProducts:'No products selected',selected:'Selected: ',products:{'საბაღე სკამი':'Garden bench','აუკუბა':'Aucuba'},status:'Status: ',checked:'Checked ',kind:{'ახალი ვებსაიტი':'a new website','ვებსაიტის რედიზაინი':'a website redesign','ბიზნესსისტემა':'a business system','მოვლა და მხარდაჭერა':'website maintenance and support','ავტომატიზაცია':'business process automation'},features:{'პროდუქტების კატალოგი':'product catalog','ადმინპანელი':'admin panel','ინტეგრაციები':'integrations'},need:'I need ',withFeatures:' Features: ',undefinedFeatures:' Let’s define the features together.',projects:{lbloom:['Lbloom','Complete website design and development, including the product catalog, content tools and administration.'],adswikia:['Adswikia','An earlier website redesign. The site was redesigned again in 2026; today’s design is different from my work.'],newuni:['NewUni','A university website redesign currently in progress.'],jibu:['Jibu','An active project in the ANORIK portfolio. Work is ongoing.']},steps:[['Discover','Understand your business and what your customers need.','messages-square'],['Plan','Define the structure, features and scope of the project.','layout-list'],['Design & build','Create the design, develop the product and test it.','panels-top-left'],['Launch & improve','Launch the project and plan the next improvements.','rocket']]},ka:{titles:{web:'პროდუქტის კატალოგი',systems:'ბიზნესსისტემის მართვა',automation:'ავტომატიზაციის პროცესი',support:'მოვლა და მხარდაჭერა'},stages:['ახალი','მუშავდება','დასრულებული'],flow:['მოთხოვნის მიღება','მონაცემების შემოწმება','სისტემაში გადაცემა'],noProducts:'პროდუქტი არჩეული არ არის',selected:'არჩეულია: ',products:{'საბაღე სკამი':'საბაღე სკამი','აუკუბა':'აუკუბა'},status:'სტატუსი: ',checked:'შემოწმებულია ',kind:{'ახალი ვებსაიტი':'ახალი ვებსაიტი','ვებსაიტის რედიზაინი':'ვებსაიტის რედიზაინი','ბიზნესსისტემა':'ბიზნესსისტემა','მოვლა და მხარდაჭერა':'ვებსაიტის მოვლა და მხარდაჭერა','ავტომატიზაცია':'ბიზნესპროცესის ავტომატიზაცია'},features:{'პროდუქტების კატალოგი':'პროდუქტების კატალოგი','ადმინპანელი':'ადმინპანელი','ინტეგრაციები':'ინტეგრაციები'},need:'მინდა ',withFeatures:' მჭირდება: ',undefinedFeatures:' ფუნქციებს ერთად დავაზუსტებთ.',projects:{lbloom:['Lbloom','სრულად შესრულებული ვებსაიტის დიზაინი და დეველოპმენტი — პროდუქტების კატალოგით, კონტენტის მართვითა და ადმინისტრირებით.'],adswikia:['Adswikia','ჩემ მიერ შესრულებული წინა რედიზაინი. 2026 წელს საიტი ხელახლა განაახლეს; დღევანდელი დიზაინი ჩემს ნამუშევარს არ წარმოადგენს.'],newuni:['NewUni','უნივერსიტეტის ვებსაიტის რედიზაინი, რომელზეც მუშაობა ამჟამად მიმდინარეობს.'],jibu:['Jibu','ANORIK-ის პორტფოლიოში შემავალი აქტიური პროექტი. მუშაობა გრძელდება.']},steps:[['გაცნობა','ვიგებთ, რა სჭირდება შენს ბიზნესს და მომხმარებელს.','messages-square'],['დაგეგმვა','ვაზუსტებთ სტრუქტურას, ფუნქციებსა და სამუშაოს მოცულობას.','layout-list'],['დიზაინი და შექმნა','ვაერთიანებთ დიზაინს, დეველოპმენტსა და ტესტირებას.','panels-top-left'],['გაშვება და განვითარება','ვუშვებთ პროექტს და ვგეგმავთ შემდგომ გაუმჯობესებებს.','rocket']]}};
const icons=()=>{if(window.lucide)lucide.createIcons({attrs:{width:18,height:18}})};
function updateBrief(){const w=words[language],kind=w.kind[root.querySelector('input[name=al-kind]:checked').value];const features=[...root.querySelectorAll('input[name=al-feature]:checked')].map(el=>w.features[el.value]);root.querySelector('#al-brief-output').textContent=w.need+kind+'.'+(features.length?w.withFeatures+features.join(', ')+'.':w.undefinedFeatures);}

function updateProject(){const detail=root.querySelector('#al-project-detail');if(!project){detail.hidden=true;return}detail.hidden=false;const p=words[language].projects[project];detail.innerHTML='<div><strong>'+p[0]+'</strong><p>'+p[1]+'</p></div>'+(project==='lbloom'?'<img src="'+images.catalog+'" alt="'+(language==='en'?'Actual Lbloom product catalog':'Lbloom-ის რეალური კატალოგი')+'">':'');}
function updateStep(){const s=words[language].steps[stepStage];root.querySelector('#al-step-title').textContent=s[0];root.querySelector('#al-step-text').textContent=s[1];root.querySelector('#al-step-icon').innerHTML='<i data-lucide="'+s[2]+'" aria-hidden="true"></i>';icons();}
function renderLocale(){document.documentElement.lang=language;localStorage.setItem('anorik-language',language);root.dataset.language=language;root.lang=language;root.querySelectorAll('[data-placeholder-en]').forEach(el=>el.placeholder=el.dataset[language==='en'?'placeholderEn':'placeholderKa']);root.querySelector('.al-nav').setAttribute('aria-label',language==='en'?'Main navigation':'მთავარი ნავიგაცია');root.querySelectorAll('[data-en]').forEach(el=>el.innerHTML=el.dataset[language]);root.querySelectorAll('[data-language-button]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.languageButton===language)));updateBrief();updateProject();updateStep();}
root.querySelectorAll('[data-language-button]').forEach(button=>button.addEventListener('click',()=>{language=button.dataset.languageButton;renderLocale()}));
root.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>{project=project===button.dataset.project?null:button.dataset.project;root.querySelectorAll('[data-project]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.project===project)));updateProject()}));
root.querySelectorAll('[data-step]').forEach(button=>button.addEventListener('click',()=>{stepStage=Number(button.dataset.step);root.querySelectorAll('[data-step]').forEach(el=>el.setAttribute('aria-pressed',String(el===button)));updateStep()}));
root.querySelectorAll('input[name=al-kind],input[name=al-feature]').forEach(input=>input.addEventListener('change',updateBrief));
root.querySelectorAll('[data-service-choice]').forEach(button=>button.addEventListener('click',()=>{root.querySelector('input[name=al-kind][value="'+button.dataset.serviceChoice+'"]').checked=true;updateBrief();root.querySelector('#al-brief').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});}));
// Follow the section in view; an underline is never pinned to the first link.
const navLinks=[...root.querySelectorAll('.al-nav a')];
const sectionTargets=['al-work','al-services','al-process','al-brief'].map(id=>document.getElementById(id));
let navFrame=0;
function updateNavigation(){navFrame=0;let current=null;const marker=Math.min(120,window.innerHeight*.2);sectionTargets.forEach(section=>{if(section.getBoundingClientRect().top<=marker)current=section.id});navLinks.forEach(link=>{if(link.hash==='#'+current)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current')});}
function queueNavigation(){if(!navFrame)navFrame=requestAnimationFrame(updateNavigation);}
window.addEventListener('scroll',queueNavigation,{passive:true});window.addEventListener('resize',queueNavigation);window.addEventListener('load',queueNavigation);updateNavigation();
const inquiryForm=root.querySelector('#al-inquiry-form');
const kindKeys={'ახალი ვებსაიტი':'New website','ვებსაიტის რედიზაინი':'Redesign','ბიზნესსისტემა':'Business system','ავტომატიზაცია':'Automation','მოვლა და მხარდაჭერა':'Maintenance & support'};
const featureKeys={'პროდუქტების კატალოგი':'Product catalog','ადმინპანელი':'Admin panel','ინტეგრაციები':'Integrations'};
const formText={
 en:{sending:'Sending…',sent:'Thank you — your inquiry has been sent. We’ll reply to your email shortly.',failed:'Something went wrong and your inquiry was not sent. Please email us at <a href="mailto:contact@anorik.com">contact@anorik.com</a>.',invalid:'Please check your name, email and project description.'},
 ka:{sending:'იგზავნება…',sent:'გმადლობთ — მოთხოვნა გაიგზავნა. მალე გიპასუხებთ ელფოსტაზე.',failed:'მოთხოვნა ვერ გაიგზავნა. გთხოვთ, მოგვწერეთ პირდაპირ: <a href="mailto:contact@anorik.com">contact@anorik.com</a>.',invalid:'გთხოვთ, შეამოწმეთ სახელი, ელფოსტა და პროექტის აღწერა.'}
};
let sending=false;
inquiryForm.addEventListener('submit',async event=>{
 event.preventDefault();
 if(sending||!inquiryForm.reportValidity())return;
 const data=new FormData(inquiryForm);
 const status=root.querySelector('#al-inquiry-status');
 const button=inquiryForm.querySelector('button[type=submit]');
 const t=()=>formText[language];
 const show=(key,state)=>{status.hidden=false;status.dataset.state=state;status.innerHTML=t()[key];};
 sending=true;button.disabled=true;show('sending','pending');
 try{
  const res=await fetch('/api/contact',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({
   name:data.get('name'),email:data.get('email'),message:data.get('message'),website:data.get('website'),language,
   kind:kindKeys[data.get('al-kind')],features:data.getAll('al-feature').map(f=>featureKeys[f]).filter(Boolean)
  })});
  if(res.ok){show('sent','success');inquiryForm.reset();updateBrief();}
  else show(res.status===422?'invalid':'failed','error');
 }catch(e){show('failed','error');}
 finally{sending=false;button.disabled=false;}
});

renderLocale();
})();
