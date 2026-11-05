'use strict';
function hoverSVG(html,model){return html.replace('<svg ',`<svg data-chart-model="${esc(JSON.stringify(model))}" `)}
const hoverPerformanceLine=performanceLineChart;
performanceLineChart=function(series,unit,description){return hoverSVG(hoverPerformanceLine(series,unit,description),{label:description,unit,labels:series[0].values.map((_,i)=>String(Math.round(i*24/(series[0].values.length-1))).padStart(2,'0')+':00'),series:series.map(s=>({name:s.label,values:s.values})),left:.087,right:.964})};
const hoverRegionalBars=regionalBars;
regionalBars=function(r){return hoverSVG(hoverRegionalBars(r),{label:'Monthly PUE · '+r.name,unit:'PUE',labels:regionalMonths,series:[{name:'Best PUE',values:regionalMonths.map((_,i)=>Math.min(Math.max(1.12,r.pue+Math.sin((i-3)*Math.PI/6)*.09),Math.min(...r.campuses.map(s=>s.pue))-.025+Math.sin((i-3)*Math.PI/6)*.04))},{name:'Average PUE',values:regionalMonths.map((_,i)=>Math.max(1.12,r.pue+Math.sin((i-3)*Math.PI/6)*.09))}],left:.065,right:.98})};
const hoverCostBars=performanceCostBars;
performanceCostBars=function(q){const seasonal=1+Math.sin((regionalMonth-3)*Math.PI/6)*.09,days=new Date(2026,regionalMonth+1,0).getDate();return hoverSVG(hoverCostBars(q),{label:'Estimated utility cost',unit:'EGP',labels:regionalMonths,series:[{name:'Total',values:regionalMonths.map((_,i)=>q.costs.reduce((a,b)=>a+b,0)/seasonal/days*(1+Math.sin((i-3)*Math.PI/6)*.09)*new Date(2026,i+1,0).getDate())}],left:.085,right:.98})};
const hoverCoolingTrend=coolingTrend;
coolingTrend=function(){return hoverSVG(hoverCoolingTrend(),{label:'Cooling performance',unit:'°C',labels:Array.from({length:37},(_,i)=>`${14+Math.floor(i/9)}:${String(Math.round(i%9*60/9)).padStart(2,'0')}`),series:[{name:'Return',values:Array.from({length:37},(_,i)=>29.4+Math.sin(i*1.4)*.21+Math.cos(i*.57)*.12)},{name:'Supply',values:Array.from({length:37},(_,i)=>18.2+Math.sin(i*1.4+2)*.21+Math.cos(i*.57)*.12)}],left:43/470,right:385/470})};
const hoverDonut=donut;
donut=function(value=72,label='Utilized',color=C.blue){return hoverSVG(hoverDonut(value,label,color),{label,unit:'%',labels:['Current'],series:[{name:label,values:[value]},{name:'Remaining',values:[100-value]}]})};
const hoverRackGauge=regionalRackGauge;
regionalRackGauge=function(r){return hoverSVG(hoverRackGauge(r),{label:'Rack utilization · '+r.name,unit:'racks',labels:['Current'],series:[{name:'Occupied',values:[r.occupied]},{name:'Total capacity',values:[r.capacity]},{name:'Available',values:[r.capacity-r.occupied]}]})};
const hoverCampusGauge=campusGauge;
campusGauge=function(label,value,max,unit,color,detail){return hoverSVG(hoverCampusGauge(label,value,max,unit,color,detail),{label,unit,labels:['Current'],series:[{name:'Current',values:[value]},{name:'Capacity',values:[max]},{name:'Available',values:[max-value]}]})};
const hoverEfficiency=regionalEfficiency;
regionalEfficiency=function(r){return hoverSVG(hoverEfficiency(r),{label:'Efficiency · '+r.name,unit:'buildings',labels:['Current'],series:['High efficiency','Medium efficiency','Low efficiency'].map((name,i)=>({name,values:[r.counts[i]]}))})};
const hoverOriginalLine=lineChart;
lineChart=function(series=2,kind='power'){
 const temperatures=kind==='temperature';
 return hoverSVG(hoverOriginalLine(series,kind),{label:'Illustrative '+kind+' trend',unit:temperatures?'°C':'MW',labels:Array.from({length:30},(_,i)=>kind==='daily'?['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][Math.min(6,Math.floor(i*7/30))]:String(Math.floor(i*24/30)).padStart(2,'0')+':00'),series:Array.from({length:series},(_,s)=>({name:temperatures?(s?'Return / maximum':'Supply / average'):(s?'IT load':'Facility load'),values:Array.from({length:30},(_,i)=>{const y=95-s*29-Math.sin(i*.43+s)*12-Math.cos(i*1.1)*6-i*.45;return temperatures?20+(132-y)/107*15:(132-y)/107*60})})),left:35/370,right:341/370});
};
const hoverBar=barChart;
barChart=function(){return hoverSVG(hoverBar(),{label:'Monthly energy · illustrative',unit:'chart units',labels:regionalMonths,series:[{name:'Total energy',values:Array.from({length:12},(_,i)=>(54+i*13%39)/107*60)},{name:'Renewable energy',values:Array.from({length:12},(_,i)=>(54+i*13%39)/107*60*.3)}],left:30/350,right:340/350})};
const hoverSpark=spark;
spark=function(...args){return hoverSVG(hoverSpark(...args),{label:'Trend index',unit:'index',labels:Array.from({length:20},(_,i)=>'Sample '+(i+1)),series:[],spark:true,left:0,right:1})};
function graphReading(model,fraction,svg){
 const f=Math.max(0,Math.min(1,(fraction-(model.left??0))/((model.right??1)-(model.left??0))));
 const index=Math.min(model.labels.length-1,Math.round(f*(model.labels.length-1)));
 let series=model.series;
 if(model.spark){const points=svg.querySelector('polyline')?.getAttribute('points')||'';series=[{name:'Trend',values:points.trim().split(/\s+/).map(p=>42-Number(p.split(',')[1]))}]}
 return {label:model.label,time:model.labels[index],unit:model.unit,items:series.map(s=>({name:s.name,value:s.values[index]}))};
}
function graphTooltip(){let el=document.getElementById('graph-reading-tooltip');if(!el){el=document.createElement('div');el.id='graph-reading-tooltip';el.className='graph-reading-tooltip';el.setAttribute('role','status');document.body.appendChild(el)}return el}
function showGraphReading(svg,event){
 let model;try{model=JSON.parse(svg.dataset.chartModel)}catch{return}
 const bounds=svg.getBoundingClientRect(),reading=graphReading(model,event?(event.clientX-bounds.left)/bounds.width:.5,svg),tooltip=graphTooltip();
 document.querySelectorAll('.graph-reading-active').forEach(el=>{if(el!==svg)el.classList.remove('graph-reading-active')});svg.classList.add('graph-reading-active');
 tooltip.innerHTML=`<strong>${esc(reading.label)}</strong><small>${esc(reading.time)}</small>${reading.items.map(v=>`<span>${esc(v.name)}<b>${Number(v.value).toLocaleString('en-GB',{maximumFractionDigits:2})} ${esc(reading.unit)}</b></span>`).join('')}`;
 tooltip.hidden=false;const x=event?event.clientX:bounds.left+bounds.width/2,y=event?event.clientY:bounds.top+20;
 tooltip.style.left=Math.max(8,Math.min(window.innerWidth-tooltip.offsetWidth-10,x+15))+'px';tooltip.style.top=Math.max(8,Math.min(window.innerHeight-tooltip.offsetHeight-10,y+15))+'px';
}
document.addEventListener('pointermove',e=>{const svg=e.target.closest('svg[data-chart-model]');if(svg)showGraphReading(svg,e);else{const tip=document.getElementById('graph-reading-tooltip');if(tip)tip.hidden=true;document.querySelectorAll('.graph-reading-active').forEach(el=>el.classList.remove('graph-reading-active'))}});
document.addEventListener('pointerout',e=>{const svg=e.target.closest('svg[data-chart-model]');if(svg&&!svg.contains(e.relatedTarget)){svg.classList.remove('graph-reading-active');const tip=document.getElementById('graph-reading-tooltip');if(tip)tip.hidden=true}});
document.addEventListener('focusin',e=>{if(e.target.matches('svg[data-chart-model]'))showGraphReading(e.target)});
