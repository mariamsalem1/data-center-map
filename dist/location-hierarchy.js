'use strict';
// The existing prototype has one monitored data center per building; do not
// duplicate metrics or invent additional facilities when presenting the hierarchy.
function monitoredDataCenters(siteId,buildingId){
 const site=sites.find(s=>s.id===siteId);
 if(!site||!Array.from({length:site.buildings},(_,i)=>`DC-0${i+1}`).includes(buildingId))return [];
 return [{id:`${siteId}:${buildingId}:dc01`,name:'Data Center 01',siteId,buildingId}];
}
function buildingDisplayName(id){return id?'Building '+id.replace('DC-',''):''}
function syncSelectedDataCenter(siteId=state.site,buildingId=state.building){
 const available=monitoredDataCenters(siteId,buildingId);
 if(!available.some(d=>d.id===state.dataCenter))state.dataCenter=available[0]?.id||null;
 return available.find(d=>d.id===state.dataCenter)||null;
}
function hierarchyBreadcrumbs(){
 const site=sites.find(s=>s.id===state.site),center=syncSelectedDataCenter();
 return `<nav class="location-trail" aria-label="Campus building data center hierarchy"><button data-action="reset">All Campuses</button>${site?`<span>›</span><button data-campus="${site.id}">${esc(site.name)}</button>`:''}${state.building?`<span>›</span><button data-hierarchy-building="${state.building}">${buildingDisplayName(state.building)}</button>`:''}${center?`<span>›</span><strong>${center.name}</strong>`:''}${state.page==='building'?`<span>›</span><span class="hierarchy-system">${navigationSystemLabels[state.tab]}</span>`:state.page==='regions'&&center?'<span>›</span><span class="hierarchy-system">Data Center KPIs</span>':''}</nav>`;
}
function dataCenterSelector(id){const centers=monitoredDataCenters(state.site,state.building);return `<label>Data Center<select id="${id}" aria-label="Change selected data center" ${centers.length?'':'disabled'}>${centers.length?centers.map(d=>`<option value="${d.id}" ${state.dataCenter===d.id?'selected':''}>${d.name}</option>`).join(''):'<option value="">Choose a building first</option>'}</select></label>`}
const hierarchyOriginalContext=navigationContext;
navigationContext=function(){
 const center=syncSelectedDataCenter();let html=hierarchyOriginalContext();
 html=html.replace(/<nav class="location-trail"[\s\S]*?<\/nav>/,hierarchyBreadcrumbs());
 html=html.replace(/(<option value="DC-\d+"[^>]*>)(DC-\d+)(<\/option>)/g,(_,a,b,c)=>a+buildingDisplayName(b)+c);
 html=html.replace('</select></label></div></div>','</select></label>'+dataCenterSelector('context-data-center')+'</div></div>');
 html=html.replace('Building systems','Data center systems').replace('BUILDING SYSTEMS','DATA CENTER SYSTEMS').replaceAll('Building KPIs','Data Center KPIs');
 if(center)html=html.replace(/These tabs monitor [^<]*/,`These tabs monitor ${center.name} in ${buildingDisplayName(state.building)}`);
 if(state.site)html=html.replace('</section>',`<div class="hierarchy-back-actions"><button data-action="reset">← All campuses</button>${state.building?`<button data-campus="${state.site}">← Campus overview</button>`:''}${center?'<span>1 monitored data center in this building</span>':''}</div></section>`);
 return html;
};
const hierarchyOriginalNavigation=buildAtlasNavigation;
buildAtlasNavigation=function(){
 syncSelectedDataCenter();hierarchyOriginalNavigation();const nav=$('#atlas-navigation');
 nav.innerHTML=nav.innerHTML.replace(/(<option value="DC-\d+"[^>]*>)(DC-\d+)(<\/option>)/g,(_,a,b,c)=>a+buildingDisplayName(b)+c);
 const selector=dataCenterSelector('nav-data-center').replace('<label>Data Center','<label class="hierarchy-nav-center">Data Center');
 nav.innerHTML=nav.innerHTML.replace(/(<select id="nav-building"[\s\S]*?<\/select>)/,'$1'+selector).replace('>Building KPIs</option>','>Data Center KPIs</option>');
 nav.innerHTML=nav.innerHTML.replace(/(<select id="nav-region"[\s\S]*?<\/select>)/,'$1<button type="button" class="atlas-tree-button regional-performance-button" data-regional-performance aria-label="Open performance for the selected Egypt region">Regional performance <span aria-hidden="true">&#8250;</span></button>');
 if(!state.site)nav.innerHTML=nav.innerHTML.replace(/<option value="regions"[^>]*>Regional performance<\/option>/,'');
 $('#atlas-close-navigation').onclick=()=>setAtlasNavigation(false);
};
const hierarchyOriginalSnapshot=navigationSnapshot;
navigationSnapshot=function(){return {...hierarchyOriginalSnapshot(),dataCenter:state.dataCenter||null}};
const hierarchyOriginalURL=navigationURL;
navigationURL=function(){const url=new URL(hierarchyOriginalURL());if(state.dataCenter)url.searchParams.set('datacenter',state.dataCenter);else url.searchParams.delete('datacenter');return url.href};
const hierarchyOriginalRoute=route;
route=function(page,site=state.site,building=state.building){syncSelectedDataCenter(site,building);hierarchyOriginalRoute(page,site,building)};
const hierarchyOriginalRender=render;
render=function(){
 const center=syncSelectedDataCenter();hierarchyOriginalRender();
 // Only navigation outside the map is changed; leave Leaflet's subtree intact.
 if(state.page!=='overview')$('#breadcrumbs').innerHTML=hierarchyBreadcrumbs();
 if(center&&(state.page==='building'||state.page==='regions')){
  $('#eyebrow').textContent=currentSite().name+' / '+buildingDisplayName(state.building)+' / '+center.name;
  if(state.page==='regions')$('#page-title').textContent=center.name+' · Monitored KPIs';
 }
};
document.addEventListener('change',e=>{
 if(!['context-data-center','nav-data-center'].includes(e.target.id))return;
 if(!monitoredDataCenters(state.site,state.building).some(d=>d.id===e.target.value))return;
 state.dataCenter=e.target.value;render();saveNavigation();
});
document.addEventListener('click',e=>{const target=e.target.closest('[data-hierarchy-building]');if(target){state.tab='home';route('building',state.site,target.dataset.hierarchyBuilding)}});
if(typeof location.href==='string'){
 const requested=new URL(location.href).searchParams.get('datacenter');
 if(monitoredDataCenters(state.site,state.building).some(d=>d.id===requested))state.dataCenter=requested;
}
syncSelectedDataCenter();
saveNavigation(true);
render();

document.addEventListener('click',e=>{if(!e.target.closest('[data-regional-performance]'))return;state.dataCenter=null;route('regions',null,null);setAtlasNavigation(false)});
