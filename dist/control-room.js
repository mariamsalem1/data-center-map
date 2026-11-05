'use strict';
const controlOriginalPhoto=equipmentPhotoFor;
equipmentPhotoFor=function(name){return /control room/i.test(name)?{src:'assets/control-room.png',name:'Control room',alt:'Control room with wall displays and three operator monitors showing electrical, cooling and data hall systems'}:controlOriginalPhoto(name)};
function controlScreenReadings(){
 const s=currentSite(),factor=state.building?1/s.buildings:1,power=s.power*factor;
 const electrical={label:'Electrical monitoring',unit:'',labels:['Current · simulated'],series:[{name:'Facility power · MW',values:[power]},{name:'IT power · MW',values:[power/s.pue]},{name:'UPS efficiency · %',values:[96.8]}]};
 const cooling={label:'Cooling monitoring',unit:'',labels:['Current · simulated'],series:[{name:'Cooling load · MW',values:[power*.29]},{name:'Supply air · °C',values:[18.2]},{name:'Return air · °C',values:[s.id==='cairo'&&state.building==='DC-01'?29.4:25.8]}]};
 const halls={label:'Data hall monitoring',unit:'',labels:['Current · simulated'],series:[{name:'Rack utilization · %',values:[s.racks]},{name:'Inlet temperature · °C',values:[23.6]},{name:'Active campus alarms',values:[s.alarms]}]};
 return [electrical,cooling,halls,electrical,cooling,halls];
}
const controlOriginalScene=twinScene;
twinScene=function(kind,label,compact=false){
 const html=controlOriginalScene(kind,label,compact);if(!/control room/i.test(label))return html;
 const screens=controlScreenReadings().map((model,i)=>`<span class="control-screen screen-${i}" data-control-reading="${esc(JSON.stringify(model))}" aria-label="${model.label}, hover for readings" tabindex="0"><span class="control-screen-name">${model.label}</span></span>`).join('');
 return html.replace('</figure>',screens+'</figure>');
};
function showControlScreen(target,event){
 const model=JSON.parse(target.dataset.controlReading),reading=graphReading(model,.5),tooltip=graphTooltip(),bounds=target.getBoundingClientRect();
 tooltip.innerHTML=`<strong>${esc(reading.label)}</strong><small>${esc(currentSite().name)} · ${esc(reading.time)}</small>${reading.items.map(v=>`<span>${esc(v.name)}<b>${Number(v.value).toFixed(2)}</b></span>`).join('')}`;tooltip.hidden=false;
 const x=event?event.clientX:bounds.left,y=event?event.clientY:bounds.top;
 tooltip.style.left=Math.max(8,Math.min(window.innerWidth-tooltip.offsetWidth-10,x+15))+'px';tooltip.style.top=Math.max(8,Math.min(window.innerHeight-tooltip.offsetHeight-10,y+15))+'px';
}
document.addEventListener('pointermove',e=>{const target=e.target.closest('[data-control-reading]');if(target)showControlScreen(target,e)});
document.addEventListener('focusin',e=>{if(e.target.matches('[data-control-reading]'))showControlScreen(e.target)});
document.addEventListener('focusout',()=>{const tooltip=document.getElementById('graph-reading-tooltip');if(tooltip)tooltip.hidden=true});
// Label chart SVGs for keyboard access whenever any page is rendered.
const interactiveOriginalRender=render;
render=function(){interactiveOriginalRender();document.querySelectorAll('svg[data-chart-model]').forEach(svg=>{svg.setAttribute('tabindex','0');svg.setAttribute('aria-label',JSON.parse(svg.dataset.chartModel).label+'; focus for readings')})};
render();
