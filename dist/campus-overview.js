'use strict';

function campusMetrics(s){
 const index=sites.findIndex(x=>x.id===s.id),capacity=s.buildings*80,occupied=Math.round(capacity*s.racks/100);
 const renewable=24+index*3,energy=68+index*2,installed=+(s.power/(energy/100)).toFixed(2),cooling=+(s.power*.29).toFixed(2),coolingCapacity=+(cooling/.64).toFixed(2);
 return {pue:s.pue,target:1.3,renewable,energy,installed,power:s.power,it:+(s.power/s.pue).toFixed(2),capacity,occupied,backup:s.status==='warning'?+(s.power*.08).toFixed(2):0,backupCapacity:+(installed*.8).toFixed(2),cooling,coolingCapacity,mix:[Math.round(renewable*.5),Math.round(renewable*.25),renewable-Math.round(renewable*.5)-Math.round(renewable*.25),100-renewable]};
}
function campusGauge(label,value,max,unit,color='#8db1ff',detail=''){
 const fraction=Math.max(0,Math.min(1,value/max));
 return `<article class="campus-metric"><h3>${label}</h3><svg viewBox="0 0 140 109" role="img" aria-label="${label}: ${value} ${unit} of ${max} ${unit}"><path d="M24 88A49 49 0 1 1 116 88" pathLength="100" fill="none" stroke="#30414b" stroke-width="9" stroke-linecap="round"/><path d="M24 88A49 49 0 1 1 116 88" pathLength="100" fill="none" stroke="${color}" stroke-width="9" stroke-dasharray="${fraction*100} 100" stroke-linecap="round"/><text x="70" y="58" text-anchor="middle" fill="#edf6fc" font-size="20">${value}<tspan font-size="9"> ${unit}</tspan></text><text x="70" y="76" text-anchor="middle" fill="#a3bbc9" font-size="9">/ ${max} ${unit}</text><text x="70" y="104" text-anchor="middle" fill="#829aab" font-size="8">${detail||'Current load / capacity'}</text></svg></article>`;
}
function campusDashboard(s){
 const m=campusMetrics(s);
 return `<div class="campus-dashboard" aria-live="polite" aria-label="${esc(s.name)} performance"><article class="campus-strip-summary"><h2>${esc(s.name)}<i class="region-health ${s.status}"></i></h2><p>${esc(s.region)} · ${esc(s.city)} · ${s.short}</p><div class="campus-strip-counts"><span><b>${s.buildings}</b>Data center buildings</span><span><b>${s.customers}</b>Customers</span><span><b>${s.alarms}</b>Active alarms</span></div><small>SELECTED CAMPUS · SIMULATED TELEMETRY</small></article>${campusGauge('Average PUE',m.pue,2.5,'',m.pue>1.45?'#f3bc6b':'#a2dbba','Target PUE '+m.target.toFixed(2))}${campusGauge('Energy utilization',m.energy,100,'%', '#7ab0ff','Utilized / installed power')}<article class="campus-metric campus-renewables"><h3>Renewable energy usage</h3><div>${donut(m.renewable,'Renewable',C.mint)}<ul>${['Solar','Hydro','Wind','Grid / other'].map((n,i)=>`<li><i style="background:${['#6f98ff','#5ce0bc','#a394f5','#4a596b'][i]}"></i>${n}<b>${m.mix[i]}%</b></li>`).join('')}</ul></div></article>${campusGauge('Total power utilization',m.power,m.installed,'MW','#8ab2ff')}${campusGauge('Load running on backup',m.backup,m.backupCapacity,'MW','#f4bd70','Running load / backup capacity')}${campusGauge('Total rack utilization',m.occupied,m.capacity,'racks','#a394f5','Occupied / total rack positions')}${campusGauge('Cooling system power',m.cooling,m.coolingCapacity,'MW','#6edbc1')}</div>`;
}
const campusOriginalOverview=overview;
overview=function(){
 const html=campusOriginalOverview(),s=sites.find(x=>x.id===state.site);
 return s?html.replace(/<div class="atlas-kpi-strip"[\s\S]*?<div class="atlas-bottom-handle"/,`<div class="atlas-kpi-strip campus-selected-strip">${campusDashboard(s)}</div><div class="atlas-bottom-handle"`).replace(/<small>[^<]*campuses[^<]*<\/small>/,`<small>${esc(s.name)} · ${esc(s.region)}</small>`):html;
};
function selectMapCampus(id){
 const s=sites.find(x=>x.id===id);if(!s)return;
 state.page='overview';state.site=s.id;state.region=s.region;state.building=null;state.tab='home';
 const strip=$('.atlas-kpi-strip');
 if(strip){strip.innerHTML=campusDashboard(s);strip.classList.add('campus-selected-strip')}
 $('#breadcrumbs').innerHTML=`<span class="atlas-crumb">Egypt operations</span><span class="atlas-crumb">${esc(s.region)}</span><span class="atlas-crumb">${esc(s.name)}</span>`;
 const title=$('.egypt-map-title small');if(title)title.textContent=s.name+' · '+s.region;
 buildAtlasNavigation();
 for(const [markerId,marker] of campusMapMarkers){marker.setStyle({color:markerId===s.id?'#44e3c1':'#fff',weight:markerId===s.id?4:2.5});if(markerId===s.id)marker.bringToFront()}
 // Synchronize the retained map signature; no route/render/remount on marker click.
 egyptRenderedScope=JSON.stringify([state.region,state.site,egyptMapMode]);
}
const campusOriginalBuildNavigation=buildAtlasNavigation;
buildAtlasNavigation=function(){
 campusOriginalBuildNavigation();const s=sites.find(x=>x.id===state.site);if(!s)return;
 const m=campusMetrics(s),nav=$('#atlas-navigation');
 const card=`<section class="campus-nav-context" aria-label="Selected campus summary"><strong>${esc(s.name)}</strong><small>${esc(s.region)} / ${s.short}</small><div><span>PUE<b>${m.pue.toFixed(2)}</b></span><span>Power<b>${s.power} MW</b></span><span>Racks<b>${s.racks}%</b></span></div><p>${s.buildings} buildings · ${s.alarms} active alarms · ${status(s.status)}</p></section>`;
 nav.innerHTML=nav.innerHTML.replace('<div class="atlas-nav-label">OPERATIONS</div>',card+'<div class="atlas-nav-label">OPERATIONS</div>').replace('>Regional performance</button>','>Campus performance</button>');
 $('#atlas-close-navigation').onclick=()=>setAtlasNavigation(false);
 $('#navigation-handle').setAttribute('aria-label','Open navigation for '+s.name);
};
render();
