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
     { date: "2026-11-01", amount: 3000 }
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
  document.getElementById("update-label").textContent=`UPDATED ${dateLabel(latest)}`;
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
document.getElementById("year").textContent=new Date().getFullYear();
render();
