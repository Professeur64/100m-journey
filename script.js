/*
  DAILY UPDATE:
  Add the newest daily contribution at the TOP of dailyEntries.
  The total, percentage and milestones update automatically.

  IMPORTANT: GitHub Pages is public. Amounts in this file can be inspected
  in the source code even though the page only displays a percentage.
*/
const journeyData = {
  startDate: "2026-11-01", // Change to your real challenge start date.
  dailyEntries: [
     { date: "2026-11-01", time: "20:10", amount: 4000, note: "The first recorded step." },
     { date: "2026-11-03", time: "20:10", amount: 200, note: "The first recorded step." },
     { date: "2026-11-04", time: "15:25", amount: 500, note: "The first recorded step." },
     { date: "2026-11-06", time: "19:17", amount: 150, note: "The first recorded step." },
     { date: "2026-11-09", time: "14:05", amount: 250, note: "The first recorded step." },
     { date: "2026-11-11", time: "14:05", amount: 570, note: "The first recorded step." },
     { date: "2026-11-11", time: "14:05", amount: 420, note: "The first recorded step." }
  ]
};

const GOAL = 1000000;
const milestones = [
  {name:"First Step",amount:5000,detail:"The first checkpoint. Make the goal real."},
  {name:"Build Momentum",amount:10000,detail:"Consistency starts creating momentum."},
  {name:"Building",amount:50000,detail:"A foundation is taking shape."},
  {name:"First Big Achievement",amount:100000,detail:"A meaningful milestone on the road."},
  {name:"Expansion",amount:250000,detail:"Strengthen what works and build with intention."},
  {name:"Scaling",amount:500000,detail:"Halfway to the destination."},
  {name:"Three-Quarter Mark",amount:750000,detail:"The finish line is getting closer."},
  {name:"Final Stretch",amount:900000,detail:"Stay focused. Finish with discipline."},
  {name:"The Million",amount:1000000,detail:"The goal has been reached."}
];
function dateObj(s){const d=new Date(`${s}T00:00:00`);return isNaN(d)?null:d}
function dateLabel(s){const d=dateObj(s);return d?new Intl.DateTimeFormat("en-GB",{day:"2-digit",month:"short",year:"numeric"}).format(d).toUpperCase():"DATE NOT SET"}
function daysSince(s){
  const start=dateObj(s);if(!start)return 1;
  const n=new Date(),today=new Date(n.getFullYear(),n.getMonth(),n.getDate());
  return Math.max(1,Math.floor((today-start)/86400000)+1);
}
function totalSaved(){
  return journeyData.dailyEntries.reduce((sum,e)=>{
    const n=Number(e.amount);return sum+(Number.isFinite(n)&&n>0?n:0);
  },0);
}
function percent(amount){return `${(amount/GOAL*100).toFixed(1)}%`}
function money(amount){return `${new Intl.NumberFormat("en-US").format(amount)} DH`}
function render(){
  const total=totalSaved(),p=Math.min(100,Math.max(0,total/GOAL*100));
  document.getElementById("progress-value").textContent=p.toFixed(3);
  document.getElementById("progress-fill").style.width=`${p}%`;
  document.getElementById("progress-marker").style.left=`${p}%`;
  document.querySelector(".track").setAttribute("aria-valuenow",p.toFixed(3));
  document.getElementById("day-count").textContent=String(daysSince(journeyData.startDate)).padStart(3,"0");
  const latest=journeyData.dailyEntries.length?journeyData.dailyEntries[0].date:journeyData.startDate;
  const latestEntry=journeyData.dailyEntries[0];
  document.getElementById("update-label").textContent=latestEntry
    ? `UPDATED ${dateLabel(latest)}${latestEntry.time?` · ${latestEntry.time}`:""}`
    : `UPDATED ${dateLabel(latest)}`;
  renderUpdates();
  renderArticles();
  const done=milestones.filter(m=>total>=m.amount),current=done.at(-1),next=milestones.find(m=>total<m.amount);
  document.getElementById("current-milestone").textContent=current?current.name:"The Beginning";
  document.getElementById("milestone-subtitle").textContent=current?`${percent(current.amount)} checkpoint completed`:"The first step is already a win";
  document.getElementById("next-milestone").textContent=next?next.name:"The Million";
  document.getElementById("next-milestone-subtitle").textContent=next?`${percent(next.amount)} overall progress`:"You made it.";
  document.getElementById("roadmap-list").innerHTML=milestones.map((m,i)=>{
    const complete=total>=m.amount,active=!complete&&next===m;
    return `<article class="milestone ${complete?"completed":""} ${active?"active":""}">
      <div class="milestone-index">${complete?"✓":String(i+1).padStart(2,"0")}</div>
      <div><div class="milestone-name">${m.name}</div><div class="milestone-detail">${m.detail}</div></div>
      <div class="milestone-right"><span class="milestone-percent">${percent(m.amount)}</span>
      <span class="milestone-amount">${money(m.amount)}</span>
      <span class="milestone-state">${complete?"COMPLETED":active?"NEXT MILESTONE":"UPCOMING"}</span></div></article>`;
  }).join("");
}

function formatUpdateDate(entry){
  const d=dateObj(entry.date);
  if(!d)return "DATE NOT SET";
  return new Intl.DateTimeFormat("en-GB",{day:"2-digit",month:"short",year:"numeric"}).format(d).toUpperCase();
}
function formatUpdateTime(time){
  if(!time) return "TIME NOT SET";

  const parts = time.split(":").map(Number);

  if(parts.length !== 2 || parts.some(Number.isNaN)) return time;

  const [hours, minutes] = parts;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}
function renderUpdates(){
  const list=document.getElementById("updates-list");
  if(!list)return;
  const chronological=[...journeyData.dailyEntries].sort((a,b)=>{
    const av=new Date(`${a.date}T${a.time||"12:00"}:00`).getTime();
    const bv=new Date(`${b.date}T${b.time||"12:00"}:00`).getTime();
    return av-bv;
  });
  let running=0;
  const snapshots=chronological.map(entry=>{
    const amount=Number(entry.amount);
    const contribution=Number.isFinite(amount)&&amount>0?amount:0;
    running+=contribution;
    return {...entry,delta:contribution/GOAL*100,total:Math.min(100,running/GOAL*100)};
  }).reverse();
  if(!snapshots.length){
    list.innerHTML='<div class="empty-update">The journey is getting ready. The first update will appear here.</div>';
    return;
  }
  list.innerHTML=snapshots.slice(0,3).map(entry=>`
    <article class="update-row">
      <div class="update-dot">●</div>
      <div class="update-when"><span class="update-date">${formatUpdateDate(entry)}</span><span class="update-time">${formatUpdateTime(entry.time)}</span></div>
      <div class="update-right"><span class="update-delta">+${entry.delta.toFixed(3)}%</span><span class="update-total">${entry.total.toFixed(3)}<i>% TOTAL</i></span></div>
    </article>`).join("");
}
const learningArticles=[
 {category:"SELF-DEVELOPMENT",title:"Coming soon",tag:"SOON",description:"Articles about the tools, habits and skills I'm using to grow and move closer to the goal.",body:"This section is being prepared. Soon it will hold real articles about the tools for growth and success I'm learning and applying on the road to 1,000,000 DH.",visual:"visual-product",mark:"01"},
 {category:"MINDSET & DISCIPLINE",title:"Coming soon",tag:"SOON",description:"Articles about the mindset, focus and discipline behind consistent progress toward the goal.",body:"This section is being prepared. Soon it will hold real articles about building the discipline and mindset needed to reach 1,000,000 DH.",visual:"visual-marketing",mark:"02"},
 {category:"SKILL BUILDING",title:"Coming soon",tag:"SOON",description:"Articles about the skills I'm learning to build real value and move faster toward the goal.",body:"This section is being prepared. Soon it will hold real articles about the skills I'm developing on the road to 1,000,000 DH.",visual:"visual-ai",mark:"03"},
 {category:"WEALTH & GROWTH",title:"Coming soon",tag:"SOON",description:"Articles about the tools and strategies I'm using to build wealth and reach the 100M goal.",body:"This section is being prepared. Soon it will hold real articles about the tools for growth and success used on the road to 1,000,000 DH.",visual:"visual-web",mark:"04"}
];
function renderArticles(){
 const track=document.getElementById("article-track");
 if(!track)return;
 track.innerHTML=learningArticles.map((article,index)=>`
  <button class="learning-card" type="button" data-article-index="${index}" aria-label="Read ${article.title}">
   <div class="learning-visual ${article.visual}"><span class="visual-index">${article.mark} / FIELD GUIDE</span><span class="visual-word">${article.tag}</span><span class="visual-orbit"></span></div>
   <div class="learning-content"><p class="learning-category">${article.category}</p><h3>${article.title}</h3><p class="learning-description">${article.description}</p><span class="article-open">READ ARTICLE <b>↗</b></span></div>
  </button>`).join("");
 track.querySelectorAll("[data-article-index]").forEach(card=>card.addEventListener("click",()=>openArticle(learningArticles[Number(card.dataset.articleIndex)])));
}
function openArticle(article){
 const modal=document.getElementById("article-modal");
 const content=document.getElementById("article-modal-content");
 if(!modal||!content)return;
 const blocks=Array.isArray(article.content)?article.content:[{type:"paragraph",text:article.body||""}];
 content.innerHTML=`<div class="modal-hero ${article.visual||""}"><span>${article.category||"FIELD GUIDE"}</span><h2>${article.title}</h2><p>${article.description||""}</p></div><div class="modal-article-body">${blocks.map(block=>{
   if(block.type==="heading")return `<h3>${block.text}</h3>`;
   if(block.type==="list")return `<ul>${(block.items||[]).map(item=>`<li>${item}</li>`).join("")}</ul>`;
   return `<p>${block.text||""}</p>`;
 }).join("")}</div><div class="modal-foot">100M JOURNEY <span>LEARNING IN PUBLIC</span></div>`;
 modal.classList.add("is-open");modal.setAttribute("aria-hidden","false");document.body.classList.add("modal-open");
 document.getElementById("article-modal-close").focus();
}
function closeArticle(){
 const modal=document.getElementById("article-modal");
 if(!modal)return;
 modal.classList.remove("is-open");modal.setAttribute("aria-hidden","true");document.body.classList.remove("modal-open");
}
document.getElementById("article-modal-close")?.addEventListener("click",closeArticle);
document.getElementById("article-modal")?.addEventListener("click",event=>{if(event.target.id==="article-modal")closeArticle();});
document.addEventListener("keydown",event=>{if(event.key==="Escape")closeArticle();});

document.getElementById("year").textContent=new Date().getFullYear();
render();
