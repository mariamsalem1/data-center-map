'use strict';
function selectedBuildingMetrics(){
 const site=currentSite(),building=performanceBuildings(performanceScope()).find(b=>b.site.id===site.id&&b.id===state.building);
 if(!building)return null;
 const campus=campusMetrics(site),share=building.power/site.power,alarms=buildingSourceAlarms(site,building.id),rackHot=alarms.some(a=>a.system==='halls');
 return {site,building,pue:site.pue,power:building.power,it:building.power/site.pue,installed:campus.installed*share,racks:building.racks,rackCapacity:building.capacity,temp:site.id==='cairo'&&building.id==='DC-01'?23.6:building.temp,maxTemp:rackHot?32.8:building.temp+2.2,humidity:44+Number(building.id.slice(-2))%5,alarms,status:alarms.some(a=>a.severity==='critical')?'critical':alarms.length?'warning':'operational'};
}
function buildingKPIPanel(){
 const m=selectedBuildingMetrics();if(!m)return '';
 return `<aside class="building-kpi-panel" aria-label="Selected building KPI side panel"><div class="building-kpi-header"><span>SELECTED DATA CENTER</span><h2>${m.building.id}</h2><p>${esc(m.site.name)}<br>${esc(m.site.region)} / ${m.site.short}</p>${status(m.status)}</div><div class="building-kpi-key-values"><div><span>Building PUE</span><strong>${m.pue.toFixed(2)}<small>PUE</small></strong></div><div><span>Facility power</span><strong>${m.power.toFixed(2)}<small>MW</small></strong></div></div><div class="building-kpi-chart">${campusGauge('Rack utilization',m.racks,m.rackCapacity,'racks',C.purple,'Occupied / total rack positions')}</div><div class="building-kpi-readings">${[['IT power',m.it.toFixed(2)+' MW'],['Available power',(m.installed-m.power).toFixed(2)+' MW'],['Average inlet',m.temp.toFixed(1)+' °C'],['Maximum inlet',m.maxTemp.toFixed(1)+' °C'],['Relative humidity',m.humidity+' %RH'],['Free rack positions',(m.rackCapacity-m.racks)+' racks'],['Cooling monitoring',m.alarms.some(a=>a.system==='mechanical')?'Attention':'Available'],['Active source alarms',m.alarms.length+' events']].map(([label,value])=>`<div><span>${label}</span><strong class="${label==='Maximum inlet'&&m.maxTemp>30?'negative':label==='Cooling monitoring'&&value==='Attention'?'warning':''}">${value}</strong></div>`).join('')}</div><div class="building-kpi-events"><h3>Building alarms</h3>${m.alarms.length?m.alarms.map(a=>`<button data-alert="${a.id}" class="building-kpi-alarm"><i class="${a.severity}"></i><span>${esc(a.title)}<small>${esc(a.reading)} · Inspect source ↗</small></span></button>`).join(''):'<p class="positive">No active source alarms.</p>'}</div><div class="building-kpi-footer"><i></i>Simulated telemetry<span>${state.paused?'Simulation paused':'Local simulation'}</span></div></aside>`;
}
// Replace the formerly fixed building KPI cards with the same selected-building model.
buildingKPIs=function(){const m=selectedBuildingMetrics();if(!m)return '';return `<div class="kpi-grid">${kpi('Building PUE',m.pue.toFixed(2),'PUE','Target 1.30','selected building',1)}${kpi('Facility power',m.power.toFixed(2),'MW','IT '+m.it.toFixed(2)+' MW','selected building',2,C.blue)}${kpi('Average inlet temperature',m.temp.toFixed(1),'°C','Within range','target: 18–27 °C',0)}${kpi('Rack utilization',(m.racks/m.rackCapacity*100).toFixed(1),'%',m.racks+' / '+m.rackCapacity,'positions occupied',3)}</div>`};
// The existing left navigation is the single changeable KPI/navigation panel.
const buildingOriginalData=regionalData;
const buildingOriginalBuildings=performanceBuildings;
function scopedPerformanceBuilding(){
 if(!state.site||!state.building)return null;
 return buildingOriginalBuildings({campuses:[currentSite()]}).find(b=>b.id===state.building)||null;
}
regionalData=function(){
 const rows=buildingOriginalData(),b=scopedPerformanceBuilding();if(!b)return rows;
 const r=rows.find(r=>r.campuses.some(s=>s.id===b.site.id));if(!r)return rows;
 const fraction=b.power/b.site.power,counts=[0,0,0];counts[b.pue<=1.32?0:b.pue<=1.45?1:2]=1;
 return [{...r,name:b.site.name+' / '+b.id,buildings:1,power:b.power,it:b.power/b.pue,pue:b.pue,capacity:b.capacity,occupied:b.racks,counts,costs:r.costs.map(c=>c*fraction)}];
};
const buildingOriginalScope=performanceScope;
performanceScope=function(){
 const q=buildingOriginalScope(),b=scopedPerformanceBuilding();if(!b)return q;
 const m=campusMetrics(b.site),fraction=b.power/b.site.power;
 return {...q,selectedBuilding:b,power:b.power,it:b.power/b.pue,pue:b.pue,installed:m.installed*fraction,cooling:m.cooling*fraction,coolingCapacity:m.coolingCapacity*fraction,backup:m.backup*fraction,backupCapacity:m.backupCapacity*fraction,racks:b.racks,rackCapacity:b.capacity,renewable:m.renewable,alerts:buildingSourceAlarms(b.site,b.id)};
};
performanceBuildings=function(scope){return scope.selectedBuilding?[scope.selectedBuilding]:buildingOriginalBuildings(scope)};
const buildingOriginalNavigation=buildAtlasNavigation;
buildAtlasNavigation=function(){
 buildingOriginalNavigation();if(!state.site||!state.building)return;
 const nav=$('#atlas-navigation');
 nav.innerHTML=nav.innerHTML.replace('>Campus performance</button>','>Building KPIs</button>');
 $('#atlas-close-navigation').onclick=()=>setAtlasNavigation(false);
 $('#navigation-handle').setAttribute('aria-label','Open navigation and KPIs for '+currentSite().name+' '+state.building);
};
const buildingKPIOriginalRender=render;
render=function(){
 buildingKPIOriginalRender();
 if(state.page==='regions'&&state.building){$('#page-title').textContent=currentSite().name+' / '+state.building+' KPIs';$('#page-description').textContent='All monitored KPIs for the selected building · Simulated operational and cost data.'}
 if(state.site&&state.building&&(state.page==='building'||state.page==='regions')){
  const tabs=`<nav class="building-page-tabs" aria-label="Selected building tabs"><button data-page="regions" class="${state.page==='regions'?'active':''}">Building KPIs</button>${Object.entries(tabNames).map(([tab,label])=>`<button data-tab="${tab}" class="${state.page==='building'&&state.tab===tab?'active':''}">${label}</button>`).join('')}</nav>`;
  $('#content').innerHTML=tabs+$('#content').innerHTML;
 }
};
