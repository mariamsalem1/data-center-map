'use strict';
const navigationSystemLabels={home:'Building overview',halls:'Data halls',bms:'Building services (BMS/FMS)',mechanical:'Cooling & mechanical',electrical:'Power & electrical',fire:'Fire systems',security:'Security & CCTV'};
function navigationContext(){
 const site=sites.find(s=>s.id===state.site),building=site&&state.building;
 const local=state.page==='building'||state.page==='regions'&&building;
 const activeLabel=state.page==='regions'&&building?'Building KPIs':navigationSystemLabels[state.tab]||'Building overview';
 const trail=`<nav class="location-trail" aria-label="Location hierarchy"><button data-action="reset">Egypt map</button>${site?`<span>›</span><button data-region="${esc(site.region)}">${esc(site.region)}</button><span>›</span><button data-campus="${site.id}">${esc(site.name)}</button>`:''}${building?`<span>›</span><strong>${esc(building)}</strong>`:''}</nav>`;
 const selectors=`<div class="location-switches"><label>Campus<select id="context-campus" aria-label="Change selected campus"><option value="">Choose a campus</option>${[...new Set(sites.map(s=>s.region))].map(region=>`<optgroup label="${esc(region)}">${sites.filter(s=>s.region===region).map(s=>`<option value="${s.id}" ${s.id===state.site?'selected':''}>${esc(s.name)}</option>`).join('')}</optgroup>`).join('')}</select></label><label>Building<select id="context-building" aria-label="Change selected building" ${site?'':'disabled'}><option value="">${site?'Choose a building':'Choose a campus first'}</option>${site?Array.from({length:site.buildings},(_,i)=>`<option value="DC-0${i+1}" ${state.building===`DC-0${i+1}`?'selected':''}>DC-0${i+1}</option>`).join(''):''}</select></label></div>`;
 const tabs=local?`<div class="building-navigation-label"><div><strong>${esc(site.name)} <span>/ ${esc(building)}</span></strong><small>BUILDING SYSTEMS · These tabs monitor ${esc(building)} at this campus</small></div><span class="location-current-view">Viewing: ${activeLabel}</span></div><nav class="building-page-tabs" aria-label="${esc(site.name)} ${esc(building)} system tabs"><button data-page="regions" class="${state.page==='regions'?'active':''}" ${state.page==='regions'?'aria-current="page"':''}>Building KPIs</button>${Object.entries(navigationSystemLabels).map(([tab,label])=>`<button data-tab="${tab}" class="${state.page==='building'&&state.tab===tab?'active':''}" ${state.page==='building'&&state.tab===tab?'aria-current="page"':''}>${label}</button>`).join('')}</nav>`:'';
 return `<section class="location-navigation" aria-label="Selected location and navigation"><div class="location-navigation-top"><div>${trail}<p>${local?'Change the campus or building above; use the system tabs below.':building?'Location context: '+site.name+' / '+building+'. Use the selectors to open another location.':site?'Campus selected. Choose a building to open its systems and KPIs.':'Choose a campus, then a building to open its systems and KPIs.'}</p></div>${selectors}</div>${tabs}</section>`;
}
function changeContextCampus(id){const s=sites.find(s=>s.id===id);if(!s){state.region='all';route('overview',null,null);return}state.region=s.region;state.tab='home';route('campus',s.id,null)}
function changeContextBuilding(id){const s=sites.find(s=>s.id===state.site);if(!s||!Array.from({length:s.buildings},(_,i)=>`DC-0${i+1}`).includes(id))return;const keep=state.page==='building'?state.tab:'home';const kpis=state.page==='regions'&&state.building;state.tab=keep;route(kpis?'regions':'building',s.id,id)}
const uxOriginalNavigation=buildAtlasNavigation;
buildAtlasNavigation=function(){
 uxOriginalNavigation();
 const nav=$('#atlas-navigation'),site=sites.find(s=>s.id===state.site);
 if(!site||!state.building){
  nav.innerHTML=nav.innerHTML.replace(/<div class="atlas-nav-label">[^<]*\/ BUILDING SYSTEMS<\/div>[\s\S]*?(?=<div class="atlas-nav-label">TOOLS<\/div>)/,`<div class="navigation-next-step"><strong>${site?'Next: choose a building':'Start: choose a campus'}</strong><p>${site?'Use the Building selector above to unlock its KPIs and system tabs.':'Select a campus and building above to open local monitoring.'}</p></div>`);
 }else{
  nav.innerHTML=nav.innerHTML.replace(`${state.building} / BUILDING SYSTEMS`,`${esc(site.name)} / ${state.building} SYSTEMS`);
 }
 $('#atlas-close-navigation').onclick=()=>setAtlasNavigation(false);
};
const uxOriginalRender=render;
render=function(){
 uxOriginalRender();
 // Leaflet owns the overview subtree. Reassigning its HTML destroys canvas,
 // markers, tile state and handlers even when the markup looks unchanged.
 if(state.page!=='overview'){
  const content=$('#content');
  content.innerHTML=navigationContext()+content.innerHTML.replace(/<nav class="building-page-tabs"[\s\S]*?<\/nav>/,'');
 }
 const browse=$('#browse-locations-button');if(browse)browse.textContent=state.site?'Change location':'Browse locations';
};
document.addEventListener('change',e=>{if(e.target.id==='context-campus')changeContextCampus(e.target.value);if(e.target.id==='context-building')changeContextBuilding(e.target.value)});
// Avoid silently selecting an arbitrary campus/building when systems are not in scope.
document.addEventListener('click',e=>{const target=e.target.closest('[data-tab]');if(target&&(!state.site||!state.building)){e.preventDefault();e.stopImmediatePropagation();setAtlasNavigation(true);toast('Choose a campus and building to open its systems.')}},true);
$('#browse-locations-button').onclick=()=>setAtlasNavigation(true);

function navigationSnapshot(){return {page:state.page,site:state.site,building:state.building,tab:state.tab,region:state.region}}
function navigationURL(){const url=new URL(location.href);for(const key of ['view','campus','building','system','region'])url.searchParams.delete(key);url.searchParams.set('view',state.page);if(state.site)url.searchParams.set('campus',state.site);if(state.building)url.searchParams.set('building',state.building);if(state.page==='building')url.searchParams.set('system',state.tab);if(state.region!=='all')url.searchParams.set('region',state.region);return url.href}
function saveNavigation(replace=false){if(typeof history==='undefined'||typeof location.href!=='string')return;const snapshot=navigationSnapshot();if(!replace&&JSON.stringify(history.state?.dashboard)===JSON.stringify(snapshot))return;history[replace?'replaceState':'pushState']({...history.state,dashboard:snapshot},'',navigationURL())}
const uxOriginalRoute=route;
route=function(...args){uxOriginalRoute(...args);saveNavigation()};
const uxOriginalCampusSelect=selectMapCampus;
selectMapCampus=function(id){uxOriginalCampusSelect(id);$('#browse-locations-button').textContent='Change location';saveNavigation()};
if(typeof history!=='undefined'&&typeof location.href==='string'){
 const params=new URL(location.href).searchParams,view=params.get('view');
 if(['overview','regions','facilities','campus','building','alerts','work','insights','logs'].includes(view)){
  const site=sites.find(s=>s.id===params.get('campus'));
  state.site=site?.id||null;state.region=site?.region||([...new Set(sites.map(s=>s.region))].includes(params.get('region'))?params.get('region'):'all');
  state.building=site&&Array.from({length:site.buildings},(_,i)=>`DC-0${i+1}`).includes(params.get('building'))?params.get('building'):null;
  state.tab=Object.hasOwn(navigationSystemLabels,params.get('system'))?params.get('system'):'home';
  state.page=view==='building'&&!state.building?(site?'campus':'overview'):view==='campus'&&!site?'overview':view;
 }
 saveNavigation(true);
 window.addEventListener('popstate',e=>{if(e.state?.dashboard){Object.assign(state,e.state.dashboard);closeDrawer();render();setAtlasNavigation(false)}});
}
render();
