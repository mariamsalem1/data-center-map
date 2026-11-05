'use strict';
// Building masks use normalized coordinates in each supplied campus image.
const buildingAlarmMasks={
 cairo:[[[11.5,55],[17,38],[29,39],[30,48],[28,70],[12,70]],[[33,53],[38,37],[48,39],[49,65],[34,71]],[[54,52],[57,37],[67,40],[70,68],[55,70]],[[76,51],[77,38],[88,42],[91,68],[77,71]]],
 capital:[[[23,49],[34,43],[60,47],[60,66],[48,70],[25,63]],[[38,37],[47,34],[67,39],[67,52],[57,55],[39,49]],[[48,28],[57,27],[75,31],[75,43],[67,45],[49,39]]],
 october:[[[10,35],[17,31],[34,45],[34,59],[20,63],[11,48]],[[31,29],[38,28],[50,42],[50,52],[39,55],[31,43]],[[52,27],[58,27],[68,40],[68,50],[58,51],[52,40]]],
 alex:[[[28,44],[35,24],[44,24],[42,57],[29,57]],[[44,43],[47,24],[54,25],[57,57],[45,57]],[[61,43],[62,24],[68,25],[77,57],[63,57]]],
 suez:[[[8,55],[13,46],[37,45],[40,55],[39,66],[10,66]],[[64,54],[66,45],[89,46],[93,55],[93,65],[65,65]]],
 aswan:[[[10,47],[16,35],[32,36],[32,60],[12,60]],[[16,29],[21,22],[32,22],[33,37],[18,38]]],
 mansoura:[[[9,52],[13,43],[43,44],[44,62],[10,63]],[[56,52],[57,44],[88,44],[91,62],[57,63]]]
};
function buildingSourceAlarms(site,id){return baseAlerts.filter(a=>a.site===site.id&&a.asset.includes(id))}
function buildingAlarmOverlay(site){
 const masks=buildingAlarmMasks[site.id]||[];
 const active=masks.slice(0,site.buildings).map((points,i)=>({points,id:`DC-0${i+1}`,alarms:buildingSourceAlarms(site,`DC-0${i+1}`)})).filter(b=>b.alarms.length);
 if(!active.length)return '';
 return `<svg class="building-alarm-overlay" viewBox="0 0 100 100" preserveAspectRatio="none" aria-label="Buildings with active source alarms">${active.map(b=>`<g class="building-alarm-shape" role="button" tabindex="0" data-building="${b.id}" aria-label="${esc(site.name)} ${b.id}, ${b.alarms.length} active alarms. Inspect building"><title>${b.id}: ${b.alarms.map(a=>esc(a.title)).join('; ')}</title><polygon points="${b.points.map(p=>p.join(',')).join(' ')}"/></g>`).join('')}</svg><div class="building-alarm-legend"><i></i>Red building = active alarm · ${active.reduce((n,b)=>n+b.alarms.length,0)} source events</div>`;
}
const buildingAlarmOriginalPlan=campusPlan;
campusPlan=function(){const html=buildingAlarmOriginalPlan(),s=currentSite();return html.replace(/(<div class="campus-image-layout[^>]*>)/,match=>match+buildingAlarmOverlay(s))};
