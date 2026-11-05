import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const elements=new Map();
const events={};
function element(id){if(!elements.has(id))elements.set(id,{innerHTML:'',textContent:'',hidden:true,value:'',classList:{add(){},remove(){},toggle(){}},setAttribute(){},focus(){},setSelectionRange(){},querySelector(){return element('child')},querySelectorAll(){return []}});return elements.get(id)}
const memory=new Map();
const context={document:{body:element('body'),activeElement:null,querySelector:element,querySelectorAll:()=>[],addEventListener:(name,fn)=>events[name]=fn,createElement:()=>({click(){}})},localStorage:{getItem:k=>memory.get(k),setItem:(k,v)=>memory.set(k,v)},window:{scrollTo(){}},navigator:{},location:{protocol:'http:'},fetch:()=>Promise.reject(Error('Offline test')),setInterval(){},setTimeout(){},console,URL,Blob,FormData,MouseEvent:class{},Date};
vm.createContext(context);vm.runInContext(fs.readFileSync(new URL('../dist/app.js',import.meta.url),'utf8'),context);
const run=code=>vm.runInContext(code,context);
for(const page of ['overview','facilities','campus','alerts','work','insights','logs']){run(`route('${page}',${page==='campus'?"'cairo'":'null'},null)`);assert.ok(element('#content').innerHTML.length>500,`${page} renders`);assert.ok(!element('#content').innerHTML.includes('undefined'),`${page} has no undefined content`)}
for(const tab of ['home','halls','bms','mechanical','electrical','fire','security']){run(`state.tab='${tab}';route('building','cairo','DC-01')`);assert.ok(element('#content').innerHTML.length>1000,`${tab} renders`);assert.ok(!element('#content').innerHTML.includes('undefined'),`${tab} has no undefined content`)}
run("state.region='Canal';route('overview',null,null)");assert.equal(run('scopedSites().length'),1);assert.equal(run('activeAlerts().length'),1);assert.ok(element('#content').innerHTML.includes('6.2'));assert.ok(!element('#content').innerHTML.includes('5th Settlement Campus'));
run("state.region='all';route('facilities',null,null);state.query='borg';render()");assert.ok(element('#content').innerHTML.includes('Borg El Arab Campus'));assert.ok(!element('#content').innerHTML.includes('5th Settlement Campus'));
run("state.query='';state.filter='critical';route('alerts',null,null);state.filter='critical';render()");assert.ok(element('#content').innerHTML.includes('High rack inlet temperature'));assert.ok(!element('#content').innerHTML.includes('UPS battery health declining'));
function click(dataset){events.click({target:{closest:()=>({dataset})}})}
click({ack:'AL-2048'});assert.equal(run("state.ack.includes('AL-2048')"),true);assert.equal(run('baseAlerts.length'),3);assert.ok(memory.has('nile-state'));
click({work:'WO-1042'});assert.equal(run("state.work.find(w=>w.id==='WO-1042').status"),'In progress');click({work:'WO-1042'});assert.equal(run("state.work.find(w=>w.id==='WO-1042').status"),'Completed');
click({alert:'AL-2047'});assert.equal(run('state.page'),'building');assert.equal(run('state.site'),'cairo');assert.equal(run('state.tab'),'mechanical');assert.equal(element('#drawer').hidden,false);
run('state.heatmap=true;state.tab="halls";render()');assert.ok(element('#content').innerHTML.includes('Hide thermal overlay'));
run('scopeDrawer();offlineGuide();newWork();newLog();equipmentDrawer("AHU-03")');assert.ok(element('#drawer').innerHTML.includes('AHU-03'));
assert.equal(run("esc('<script>')"),'&lt;script&gt;');
console.log('PASS: 14 screens, location aggregation, search, severity filters, acknowledgment persistence, work progression, alarm source tracing, rack overlay, drawers, and HTML escaping.');
vm.runInContext(fs.readFileSync(new URL('../dist/egypt-map.js',import.meta.url),'utf8'),context);
run("state.region='all';route('overview',null,null)");
assert.ok(element('#content').innerHTML.includes('atlas-map-stage'));
assert.ok(element('#content').innerHTML.includes('id="egypt-map"'));
assert.ok(!element('#content').innerHTML.includes('North America'));
assert.ok(!element('#atlas-navigation').innerHTML.includes('Global operations'));
assert.ok(!element('#content').innerHTML.includes('Infrastructure footprint'));
assert.ok(element('#atlas-navigation').innerHTML.includes('5th Settlement Campus'));
assert.ok(element('#atlas-navigation').innerHTML.includes('id="nav-region"'));
assert.ok(element('#atlas-navigation').innerHTML.includes('id="nav-campus"'));
assert.ok(element('#atlas-navigation').innerHTML.includes('Choose a campus first'));
run("route('campus','cairo',null)");assert.ok(element('#atlas-navigation').innerHTML.includes('DC-04'));
run('setAtlasNavigation(true)');assert.equal(element('#atlas-navigation').hidden,false);assert.equal(element('#navigation-shade').hidden,false);
run('setAtlasNavigation(false)');assert.equal(element('#atlas-navigation').hidden,true);
run("state.region='all';route('overview',null,null)");assert.ok(element('#content').innerHTML.includes('Greater Cairo'));assert.ok(!element('#content').innerHTML.includes('North America'));
for(const page of ['facilities','campus','alerts','work','insights','logs']){run(`route('${page}','cairo',null)`);assert.ok(element('#content').innerHTML.length>500)}
for(const tab of ['home','halls','bms','mechanical','electrical','fire','security']){run(`state.tab='${tab}';route('building','cairo','DC-01')`);assert.ok(element('#content').innerHTML.length>1000)}
console.log('PASS: Egypt-only map container and KPI strip, no global navigation, campus/building menu, navigation open/close, and all detail screens. Leaflet browser rendering is not exercised by this VM check.');
run("state.region='Greater Cairo';route('building','capital','DC-02');goToOverviewMap()");
assert.equal(run('state.page'),'overview');assert.equal(run('state.region'),'all');assert.equal(run('state.site'),null);assert.equal(run('state.building'),null);
console.log('PASS: Overview Map resets building and campus navigation to the national portfolio.');

vm.runInContext(fs.readFileSync(new URL('../dist/equipment-3d.js',import.meta.url),'utf8'),context);
run("state.region='all';state.tab='halls';route('building','cairo','DC-01')");
let hallHTML=element('#content').innerHTML;
assert.equal((hallHTML.match(/data-rack-select=/g)||[]).length,32);
assert.ok(hallHTML.includes('COLD AISLE / CONTAINMENT'));
assert.ok(hallHTML.includes('32.8 °C'));
assert.equal(run('twinRackReading(12).temperature'),32.8);
assert.equal(run('twinRackReading(12).load'),82);
run('equipmentDrawer("Rack R-12")');
assert.ok(element('#drawer').innerHTML.includes('32.8 °C'));
assert.ok(element('#drawer').innerHTML.includes('82 %'));
events.click({target:{closest:()=>({dataset:{rackSelect:'8'}})}});
assert.equal(run('twinSelectedRack'),8);
assert.ok(element('#rack-detail').innerHTML.includes('Rack R-08'));
events.click({target:{closest:()=>({dataset:{hallSelect:'B'}})}});
assert.equal(run('twinHall'),'B');
assert.equal(run('twinRackReading(12).hot'),false);
assert.ok(!element('#content').innerHTML.includes('R-12 high inlet temperature'));
run("twinHall='A';route('building','capital','DC-02')");
assert.equal(run('twinRackReading(12).hot'),false);
run("state.tab='halls';route('building','cairo','DC-01');state.heatmap=true;render()");
assert.ok(element('#content').innerHTML.includes('thermal-active'));
assert.ok(element('#content').innerHTML.includes('Hide thermal overlay'));
for(const tab of ['home','bms','mechanical','electrical','fire','security']){
  run(`state.tab='${tab}';render()`);
  const html=element('#content').innerHTML;
  assert.ok(html.includes('twin-scene'),`${tab} has detailed equipment views`);
  assert.ok(!html.includes('undefined'),`${tab} is complete`);
  assert.ok(!html.includes('CAMERA PLACEHOLDER'),`${tab} has no dummy camera scene`);
}
for(const asset of ['AHU-03','UPS-B','Generator A','Water tank','Suppression bank','Security door','Control room']){
  run(`equipmentDrawer('${asset}')`);
  assert.ok(element('#drawer').innerHTML.includes('twin-scene'),`${asset} inspector shows equipment`);
}
console.log('PASS: 32 reference-style racks, rack selection, exact R-12 readings, Hall B and campus alarm isolation, thermal overlay, all equipment views and asset inspectors.');

const campusMarkers=[];
context.L={circleMarker(coords,options){const marker={coords,options,handlers:{},addTo(){return this},bindTooltip(){return this},bindPopup(){return this},on(name,fn){this.handlers[name]=fn;return this},setRadius(radius){this.radius=radius;return this}};campusMarkers.push(marker);return marker}};
run("state.site=null;state.region='all';addCampusMarkers()");
assert.equal(campusMarkers.length,run('sites.length'));
for(const marker of campusMarkers){assert.equal(marker.options.fillColor,'#000000');assert.ok(marker.options.radius>=12);assert.equal(marker.options.color,'#fff');marker.handlers.mouseover();assert.equal(marker.radius,16);marker.handlers.mouseout();assert.equal(marker.radius,marker.options.radius)}
const branding=fs.readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
assert.ok(branding.includes('alt="Schneider Electric"'));
assert.ok(branding.includes('assets/schneider-electric.png'));
assert.ok(!branding.includes('AVEVA'));
assert.ok(fs.existsSync(new URL('../dist/assets/schneider-electric.png',import.meta.url)));
console.log('PASS: transparent logo asset wired into branding; all campus markers black, larger, and restored correctly after hover.');

vm.runInContext(fs.readFileSync(new URL('../dist/cooling.js',import.meta.url),'utf8'),context);
run("state.tab='mechanical';route('building','cairo','DC-01')");
const coolingHTML=element('#content').innerHTML;
assert.ok(coolingHTML.includes('assets/ahu-03.png'));
assert.ok(coolingHTML.includes('cooling-hero'));
assert.ok(coolingHTML.includes('1.36'));
assert.ok(!coolingHTML.includes('undefined'));
assert.equal((coolingHTML.match(/class="cooling-sensor /g)||[]).length,5);
for(const name of run('Object.keys(coolingSensors)')){
  run(`equipmentDrawer(${JSON.stringify(name)})`);
  const sensor=run(`coolingSensors[${JSON.stringify(name)}]`);
  assert.ok(element('#drawer').innerHTML.includes(sensor.value));
  assert.ok(element('#drawer').innerHTML.includes(sensor.limit));
}
run("equipmentDrawer('Return sensor TT-02')");
assert.ok(element('#drawer').innerHTML.includes('critical'));
run("equipmentDrawer('Rack R-12')");
assert.ok(element('#drawer').innerHTML.includes('Rack R-12'));
assert.ok(fs.existsSync(new URL('../dist/assets/cooling-ahu.png',import.meta.url)));
console.log('PASS: cinematic cooling layout, five sensor inspectors, return alarm, coherent capacity and existing rack inspector delegation.');

vm.runInContext(fs.readFileSync(new URL('../dist/regions.js',import.meta.url),'utf8'),context);
run("state.region='all';state.site=null;route('regions',null,null)");
assert.equal(run('state.region'),'all');
assert.equal(run('state.site'),null);
assert.equal(run('state.building'),null);
assert.equal(run('regionalData().length'),5);
assert.ok(element('#page-title').textContent.includes('Regional data center'));
assert.ok(element('#atlas-navigation').innerHTML.includes('Regional performance'));
assert.equal((element('#content').innerHTML.match(/class="regional-row"/g)||[]).length,5);
assert.ok(!element('#content').innerHTML.includes('undefined'));
for(const r of run('regionalData()')){
  assert.equal(r.counts.reduce((a,b)=>a+b,0),r.buildings);
  assert.ok(r.occupied<=r.capacity&&r.occupied>0);
  assert.ok(Math.abs(r.pue-r.power/r.it)<1e-9);
  assert.ok(r.costs.every(c=>Number.isFinite(c)&&c>0));
}
const previous=run('regionalData()[0].costs[1]');
events.change({target:{id:'regional-month',value:'5'}});
assert.equal(run('regionalMonth'),5);
assert.notEqual(run('regionalData()[0].costs[1]'),previous);
assert.ok(element('#content').innerHTML.includes('Jun 2026 estimate'));
run("state.tab='mechanical';route('building','cairo','DC-01')");
assert.ok(element('#content').innerHTML.includes('cooling-hero'));
console.log('PASS: all five regions in one tab, national scope reset, region aggregation, weighted PUE, capacity totals, monthly reporting and cooling navigation.');

vm.runInContext(fs.readFileSync(new URL('../dist/campus-overview.js',import.meta.url),'utf8'),context);
for(const marker of campusMarkers){marker.setStyle=function(style){this.style=style;return this};marker.bringToFront=function(){return this}}
for(const [id,marker] of run('[...campusMapMarkers.entries()]')){
  marker.handlers.click();
  assert.equal(run('state.site'),id);
  assert.equal(run('state.page'),'overview');
  assert.equal(run('state.building'),null);
  const selected=run('currentSite()');
  assert.equal(run('state.region'),selected.region);
  assert.ok(element('.atlas-kpi-strip').innerHTML.includes(selected.name));
  assert.ok(element('#atlas-navigation').innerHTML.includes('Selected campus summary'));
  assert.ok(element('#atlas-navigation').innerHTML.includes('Campus performance'));
  assert.ok(element('#breadcrumbs').innerHTML.includes(selected.name));
  for(const label of ['Average PUE','Energy utilization','Renewable energy usage','Total power utilization','Load running on backup','Total rack utilization','Cooling system power'])assert.ok(element('.atlas-kpi-strip').innerHTML.includes(label));
  assert.equal(marker.style.color,'#44e3c1');
  assert.equal((run('overview()').match(/class="campus-dashboard"/g)||[]).length,1);
}
run("state.page='regions';render()");
assert.equal((element('#content').innerHTML.match(/class="regional-row"/g)||[]).length,1);
assert.ok(element('#content').innerHTML.includes(run('currentSite().name')));
assert.ok(element('#page-title').textContent.includes(run('currentSite().name')));
run("state.site=null;state.region='all';state.page='regions';render()");
assert.equal((element('#content').innerHTML.match(/class="regional-row"/g)||[]).length,5);
console.log('PASS: all seven marker click handlers select campus in place, refresh seven visualizations, synchronize breadcrumbs/navigation, highlight selection, and scope the performance tab; national selection restores all regions.');

vm.runInContext(fs.readFileSync(new URL('../dist/performance-detail.js',import.meta.url),'utf8'),context);
for(const id of [...run('sites.map(s=>s.id)'),null]){
  run(`state.site=${JSON.stringify(id)};state.region='all';state.page='regions';render()`);
  const html=element('#content').innerHTML;
  for(const label of ['Facility and IT power','Energy source distribution','Cooling and thermal performance','Utility cost trend','Building capacity and performance','Available operational headroom','Alarms and operational priorities'])assert.ok(html.includes(label),`${id} includes ${label}`);
  assert.ok(!/undefined|NaN|Infinity/.test(html),`${id} has valid metrics`);
  const scope=run('performanceScope()'),buildings=run('performanceBuildings(performanceScope())');
  assert.ok(Math.abs(buildings.reduce((a,b)=>a+b.power,0)-scope.power)<1e-8);
  assert.equal(buildings.reduce((a,b)=>a+b.racks,0),scope.racks);
  assert.equal(scope.alerts.length,run('baseAlerts.filter(a=>scopedSites().some(s=>s.id===a.site)).length'));
}
run("state.site='aswan';state.region='Upper Egypt';render()");
assert.ok(element('#content').innerHTML.includes('No active source alarms'));
assert.ok(!element('#content').innerHTML.includes('data-alert="AL-2048"'));
run("state.site='cairo';state.region='Greater Cairo';render()");
assert.ok(element('#content').innerHTML.includes('data-alert="AL-2048"'));
assert.ok(element('#content').innerHTML.includes('data-alert="AL-2047"'));
const estimateBefore=run('performanceScope().costs[1]');
events.change({target:{id:'regional-month',value:'8'}});
assert.notEqual(run('performanceScope().costs[1]'),estimateBefore);
console.log('PASS: rich performance dashboard in every campus and national scope, seven operational panels, building power/rack totals, scoped alarm links and monthly updates.');

vm.runInContext(fs.readFileSync(new URL('../dist/equipment-photos.js',import.meta.url),'utf8'),context);
for(const [name,file] of [['Generator A','generator-a.png'],['UPS-B','ups-b.png'],['AHU-03','ahu-03.png'],['Switchgear','switchgear.png'],['Water tank','water-tank.png']]){
  run(`equipmentDrawer(${JSON.stringify(name)})`);
  assert.ok(element('#drawer').innerHTML.includes('assets/'+file),`${name} inspector uses the supplied image`);
  assert.ok(run(`equipmentCard('Equipment','1','unit','Monitoring',${JSON.stringify(name)})`).includes('assets/'+file));
  assert.ok(fs.existsSync(new URL('../dist/assets/'+file,import.meta.url)));
}
run("equipmentDrawer('Water tank')");
assert.ok(element('#drawer').innerHTML.includes('assets/water-pump.png'));
run("state.tab='home';route('building','cairo','DC-01')");
for(const file of ['generator-a.png','ups-b.png','ahu-03.png','switchgear.png','water-tank.png'])assert.ok(element('#content').innerHTML.includes('assets/'+file));
run("state.tab='mechanical';render()");
assert.ok(element('#content').innerHTML.includes('assets/ahu-03.png'));
run("equipmentDrawer('Supply sensor TT-01')");
assert.ok(element('#drawer').innerHTML.includes('18.2'));
console.log('PASS: five supplied equipment photos wired into overview/cards/inspectors, both tank/pump views available, AHU cooling image and sensor inspector retained.');

vm.runInContext(fs.readFileSync(new URL('../dist/chart-interactions.js',import.meta.url),'utf8'),context);
vm.runInContext(fs.readFileSync(new URL('../dist/control-room.js',import.meta.url),'utf8'),context);
run("equipmentDrawer('Control room')");
assert.ok(element('#drawer').innerHTML.includes('assets/control-room.png'));
assert.equal((element('#drawer').innerHTML.match(/data-control-reading=/g)||[]).length,6);
const reading=run("graphReading({label:'Power',unit:'MW',labels:['00:00','12:00','24:00'],series:[{name:'Facility',values:[2,3,4]}]},.5)");
assert.equal(reading.items[0].value,3);assert.equal(reading.time,'12:00');
for(const expression of ["donut(78)","lineChart(2,'temperature')","barChart()","spark()","coolingTrend()","campusGauge('Power',3.2,5,'MW')","regionalBars(regionalData()[0])","regionalEfficiency(regionalData()[0])","regionalRackGauge(regionalData()[0])","performanceCostBars(performanceScope())"]){assert.ok(run(expression).includes('data-chart-model='),expression+' has hover data')}
run("state.site='aswan';state.building='DC-01'");
assert.equal(run('controlScreenReadings()[0].series[0].values[0]'),1.95);
run("state.site='cairo';state.building='DC-01'");
assert.equal(run('controlScreenReadings()[1].series[2].values[0]'),29.4);
assert.ok(fs.existsSync(new URL('../dist/assets/control-room.png',import.meta.url)));
console.log('PASS: control-room image, six scoped screen readings, exact hover sample lookup, and hover metadata across all chart families.');

vm.runInContext(fs.readFileSync(new URL('../dist/campus-images.js',import.meta.url),'utf8'),context);
run("state.site='cairo';state.page='campus';render()");
const cairoPlan=run('campusPlan()');
assert.ok(cairoPlan.includes('assets/campus-cairo.png'));
assert.equal((cairoPlan.match(/data-building=/g)||[]).length,4);
for(const name of ['AHU-03','Generator A','Control room','Main gate'])assert.ok(cairoPlan.includes(`data-equipment="${name}"`));
for(const id of run("sites.filter(s=>s.id!=='cairo').map(s=>s.id)")){
  run(`state.site='${id}'`);
  assert.ok(!run('campusPlan()').includes('assets/campus-cairo.png'));
  assert.ok(run('campusPlan()').includes('assets/campus-'+id+'.png'));
  assert.equal((run('campusPlan()').match(/data-building=/g)||[]).length,run('currentSite().buildings'));
  assert.ok(fs.existsSync(new URL('../dist/assets/campus-'+id+'.png',import.meta.url)));
}
assert.ok(fs.existsSync(new URL('../dist/assets/campus-cairo.png',import.meta.url)));
console.log('PASS: supplied campus image applies only to 5th Settlement, with four building targets and support equipment; six other campuses have distinct supplied images with correctly scoped building targets.');

vm.runInContext(fs.readFileSync(new URL('../dist/fire-visuals.js',import.meta.url),'utf8'),context);
run("state.site='cairo';state.tab='fire';route('building','cairo','DC-01')");
const fireHTML=element('#content').innerHTML;
for(const text of ['fire-response-reference.png','fire-safety-reference.png','Fire detection zones','Response readiness','Zones &amp; Equipment','95 / 96 online','SD-042 offline'])assert.ok(fireHTML.includes(text),text);
assert.equal((fireHTML.match(/class="fire-photo-card"/g)||[]).length,12);
for(const name of run('Object.keys(fireAssets)')){run(`equipmentDrawer(${JSON.stringify(name)})`);assert.ok(element('#drawer').innerHTML.includes('fire-asset-image'));assert.ok(element('#drawer').innerHTML.includes('Read-only monitoring'))}
run("state.site='aswan';route('building','aswan','DC-01');state.tab='fire';render()");
assert.ok(element('#content').innerHTML.includes('96 / 96 online'));
assert.ok(!element('#content').innerHTML.includes('SD-042 offline'));
run("equipmentDrawer('Generator A')");
assert.ok(element('#drawer').innerHTML.includes('assets/generator-a.png'));
for(const file of ['fire-safety-reference.png','fire-response-reference.png'])assert.ok(fs.existsSync(new URL('../dist/assets/'+file,import.meta.url)));
console.log('PASS: both fire references, twelve interactive cards, nine asset inspectors, scoped detector advisory and existing equipment inspector delegation.');

vm.runInContext(fs.readFileSync(new URL('../dist/building-alarms.js',import.meta.url),'utf8'),context);
for(const id of run('sites.map(s=>s.id)')){
  run(`state.site='${id}'`);
  const site=run('currentSite()'),overlay=run('buildingAlarmOverlay(currentSite())');
  assert.equal(overlay.includes('building-alarm-overlay'),run('baseAlerts.some(a=>a.site===state.site)'));
  assert.equal(run('buildingAlarmMasks[currentSite().id].length'),site.buildings);
}
run("state.site='cairo'");
assert.ok(run('campusPlan()').includes('2 source events'));
assert.equal((run('buildingAlarmOverlay(currentSite())').match(/class="building-alarm-shape"/g)||[]).length,1);
assert.ok(run('buildingAlarmOverlay(currentSite())').includes('data-building="DC-01"'));
run("state.site='suez'");
assert.ok(run('buildingAlarmOverlay(currentSite())').includes('UPS battery health declining'));
run("state.site='capital'");
assert.equal(run('buildingAlarmOverlay(currentSite())'),'');
console.log('PASS: full-building red overlays follow active alarm sources; healthy buildings remain unmarked and overlays retain building navigation.');

vm.runInContext(fs.readFileSync(new URL('../dist/building-kpi-panel.js',import.meta.url),'utf8'),context);
for(const tab of ['home','halls','bms','mechanical','electrical','fire','security']){
  run(`state.region='all';state.tab='${tab}';route('building','cairo','DC-01')`);
  assert.ok(!element('#atlas-navigation').innerHTML.includes('Selected building KPI side panel'));
  assert.ok(element('#content').innerHTML.includes('building-page-tabs'));
  assert.ok(!element('#content').innerHTML.includes('building-kpi-shell'));
  assert.ok(element('#atlas-navigation').innerHTML.includes('Building KPIs'));
  assert.ok(!/undefined|NaN/.test(element('#content').innerHTML));
}
run("route('building','cairo','DC-01')");
const powerOne=run('selectedBuildingMetrics().power');
assert.equal(run('selectedBuildingMetrics().alarms.length'),2);
run("route('building','cairo','DC-02')");
assert.notEqual(run('selectedBuildingMetrics().power'),powerOne);
assert.equal(run('selectedBuildingMetrics().alarms.length'),0);
assert.ok(run('buildingKPIPanel()').includes('No active source alarms'));
assert.ok(run('buildingKPIPanel()').includes('DC-02'));
run("route('building','aswan','DC-01')");
assert.equal(run('selectedBuildingMetrics().pue'),1.38);
assert.ok(run('buildingKPIPanel()').includes('Aswan Edge Campus'));
run("route('campus','aswan',null)");
assert.ok(!element('#content').innerHTML.includes('building-kpi-shell'));
console.log('PASS: standalone Building KPIs tab on all building screens, no embedded KPI summary or fixed right-hand panel.');

run("route('building','cairo','DC-02');route('regions')");
assert.equal(run('state.building'),'DC-02');
assert.ok(element('#page-title').textContent.includes('DC-02'));
assert.equal(run('performanceBuildings(performanceScope()).length'),1);
assert.equal(run('performanceScope().alerts.length'),0);
assert.equal(run('regionalData()[0].buildings'),1);
assert.ok(!element('#content').innerHTML.includes('building-kpi-shell'));
run("route('building','cairo','DC-01');route('regions')");
assert.equal(run('performanceScope().alerts.length'),2);
assert.equal(run('performanceScope().rackCapacity'),80);
console.log('PASS: existing performance tab retains the selected building, scopes charts/table/alarms to that building and uses the original left navigation.');

vm.runInContext(fs.readFileSync(new URL('../dist/dashboard-complete.js',import.meta.url),'utf8'),context);
let finalHTML='';
for(const tab of ['home','halls','bms','mechanical','electrical','fire','security']){
 run(`state.region='all';state.tab='${tab}';route('building','cairo','DC-01')`);
 const html=element('#content').innerHTML;
 assert.ok(!/undefined|NaN|Infinity/.test(html),tab+' final screen is complete');
 assert.ok(!html.includes('building-kpi-shell'));
 finalHTML+=html;
}
run("route('campus','cairo',null)");finalHTML+=element('#content').innerHTML;
for(const [key,[file]] of Object.entries(run('completionImages'))){
 assert.ok(finalHTML.includes('assets/'+file),file+' is reachable on a dashboard screen');
 assert.ok(fs.existsSync(new URL('../dist/assets/'+file,import.meta.url)));
}
run("state.tab='halls';route('building','cairo','DC-01')");
assert.equal((element('#content').innerHTML.match(/data-rack-select=/g)||[]).length,32);
assert.ok(element('#content').innerHTML.includes('server-rack.png'));
assert.ok(element('#content').innerHTML.includes('cold-aisle.png'));
for(const name of ['ATS','Utility transformer','Battery bank','PDU','Chiller plant','Cooling tower','Filter bank','Supply fan','Cooling coil','Administration building','Energy center','Entry gate','Main gate','Service entrance','Data hall entrance','Security corridor','Cold aisle']){
 run(`equipmentDrawer(${JSON.stringify(name)})`);
 assert.ok(element('#drawer').innerHTML.includes('completion-photo'),name+' inspector uses supplied photo');
}
run("equipmentDrawer('Supply fan VFD-01')");
assert.ok(element('#drawer').innerHTML.includes('1,450'));
assert.ok(element('#drawer').innerHTML.includes('fan-motor.png'));
run("state.tab='mechanical';route('building','aswan','DC-01')");
assert.ok(element('#content').innerHTML.includes('No active cooling alarms'));
assert.equal(run("coolingSensors['Return sensor TT-02'].status"),'operational');
run("state.tab='mechanical';route('building','cairo','DC-01')");
assert.ok(element('#content').innerHTML.includes('1 critical event'));
assert.equal(run("coolingSensors['Return sensor TT-02'].status"),'critical');
run("state.tab='electrical';route('building','cairo','DC-02')");
assert.ok(!element('#content').innerHTML.includes('76 %'));
console.log('PASS: all 18 final photos visible in matching dashboard screens, final system tabs, 32 interactive photo racks, specific equipment/sensor inspectors and scoped cooling/UPS conditions.');

run("state.tab='home';route('building','cairo','DC-02');route('regions')");
assert.ok(element('#page-title').textContent.includes('DC-02 KPIs'));
assert.ok(element('#content').innerHTML.includes('>Building KPIs</button>'));
assert.ok(element('#content').innerHTML.includes('performance-rich'));
assert.ok(!element('#atlas-navigation').innerHTML.includes('nav-building-kpis'));
assert.equal(run('performanceScope().selectedBuilding.id'),'DC-02');
console.log('PASS: Building KPIs opens as a named full-page tab with selected-building charts and no KPI content embedded in the side navigation.');

const navHistory=[],navWindowEvents={};
context.location.href='http://127.0.0.1:4173/?update=v27';
context.history={state:null,pushState(state,unused,url){this.state=state;context.location.href=url;navHistory.push({state,url})},replaceState(state,unused,url){this.state=state;context.location.href=url}};
context.window.addEventListener=(name,fn)=>navWindowEvents[name]=fn;
vm.runInContext(fs.readFileSync(new URL('../dist/navigation-ux.js',import.meta.url),'utf8'),context);
run("state.tab='security';route('building','alex','DC-03')");
let uxHTML=element('#content').innerHTML;
assert.ok(uxHTML.includes('Borg El Arab Campus'));
assert.ok(uxHTML.includes('BUILDING SYSTEMS'));
assert.ok(uxHTML.includes('These tabs monitor DC-03 at this campus'));
assert.ok(uxHTML.includes('Change selected campus'));
assert.ok(uxHTML.includes('Viewing: Security & CCTV'));
assert.equal((uxHTML.match(/class="building-page-tabs"/g)||[]).length,1);
run("changeContextBuilding('DC-02')");
assert.equal(run('state.tab'),'security');assert.equal(run('state.building'),'DC-02');
assert.ok(context.location.href.includes('building=DC-02'));
assert.ok(context.location.href.includes('system=security'));
const buildingBackState=context.history.state;
run("route('regions');changeContextBuilding('DC-01')");
assert.equal(run('state.page'),'regions');assert.equal(run('state.building'),'DC-01');
assert.equal(run('performanceScope().selectedBuilding.id'),'DC-01');
navWindowEvents.popstate({state:buildingBackState});
assert.equal(run('state.page'),'building');assert.equal(run('state.tab'),'security');assert.equal(run('state.building'),'DC-02');
run("changeContextCampus('aswan')");
assert.equal(run('state.page'),'campus');assert.equal(run('state.building'),null);
assert.ok(element('#atlas-navigation').innerHTML.includes('Next: choose a building'));
assert.ok(!element('#atlas-navigation').innerHTML.includes('data-tab="security"'));
run("changeContextBuilding('DC-09')");assert.equal(run('state.building'),null);
run("changeContextBuilding('DC-02')");assert.equal(run('state.building'),'DC-02');
assert.ok(element('#content').innerHTML.includes('Aswan Edge Campus'));
console.log('PASS: clearly labelled campus/building/system navigation, one contextual tab group, visible location selectors, preserved system/KPI tab on building switch, no invalid-building fallback, URL state and browser history restoration.');

// Regression: retaining Leaflet's node must not be followed by an HTML rewrite.
const contentNode=element('#content');let mapHTML=contentNode.innerHTML,mapWrites=0,reattached=null;
Object.defineProperty(contentNode,'innerHTML',{configurable:true,get(){return mapHTML},set(value){mapWrites++;mapHTML=value}});
const retainedMapNode={canvas:{identity:'campus markers'},remove(){}};
element('#egypt-map').replaceWith=node=>{reattached=node};
context.retainedMapNode=retainedMapNode;
run("state.page='overview';state.region='all';state.site=null;state.building=null;egyptMapMode='streets';egyptMapView={center:[27,30],zoom:6};egyptRenderedScope=JSON.stringify([state.region,state.site,egyptMapMode]);egyptMap={getContainer:()=>retainedMapNode,invalidateSize(){},getCenter:()=>({lat:27,lng:30}),getZoom:()=>6,remove(){throw Error('Retained map must not be destroyed')}};render()");
assert.equal(mapWrites,1,'Only the base render writes overview HTML; navigation enhancement must leave it untouched');
assert.equal(reattached,retainedMapNode,'Existing map and canvas reattached by identity');
assert.equal(reattached.canvas.identity,'campus markers');
assert.ok(!mapHTML.includes('location-navigation'));
run('egyptMap=null');
console.log('PASS: overview render preserves the exact Leaflet map/canvas node without a subsequent navigation HTML rewrite.');

run("state.page='building';state.site='cairo';state.building='DC-01';state.region='Greater Cairo'");
vm.runInContext(fs.readFileSync(new URL('../dist/location-hierarchy.js',import.meta.url),'utf8'),context);
for(const id of run('sites.map(s=>s.id)')){
 run(`state.region='all';state.tab='electrical';route('building','${id}','DC-01')`);
 const html=element('#content').innerHTML;
 assert.ok(html.includes('id="context-campus"'));
 assert.ok(html.includes('id="context-building"'));
 assert.ok(html.includes('id="context-data-center"'));
 assert.ok(html.includes('Data Center 01'));
 assert.ok(html.includes('Building 01'));
 assert.ok(element('#atlas-navigation').innerHTML.includes('id="nav-data-center"'));
 assert.equal(run('state.dataCenter'),id+':DC-01:dc01');
 assert.equal(run('monitoredDataCenters(state.site,state.building).length'),1);
 assert.ok(!/undefined|NaN/.test(html));
}
run("changeContextBuilding('DC-02')");
assert.equal(run('state.dataCenter'),'mansoura:DC-02:dc01');
assert.equal(run('state.tab'),'electrical');
assert.ok(context.location.href.includes('datacenter=mansoura%3ADC-02%3Adc01'));
const dcSnapshot=context.history.state;
run("changeContextCampus('aswan')");
assert.equal(run('state.dataCenter'),null);
assert.ok(run("dataCenterSelector('test-center')").includes('disabled'));
assert.equal(run("monitoredDataCenters('aswan','DC-99').length"),0);
navWindowEvents.popstate({state:dcSnapshot});
assert.equal(run('state.dataCenter'),'mansoura:DC-02:dc01');
assert.equal(run('performanceScope().rackCapacity'),80);
// The hierarchy enhancement must also respect Leaflet's ownership of the map.
mapWrites=0;reattached=null;
run("state.page='overview';state.region='all';state.site=null;state.building=null;egyptMapMode='streets';egyptMapView={center:[27,30],zoom:6};egyptRenderedScope=JSON.stringify([state.region,state.site,egyptMapMode]);egyptMap={getContainer:()=>retainedMapNode,invalidateSize(){},getCenter:()=>({lat:27,lng:30}),getZoom:()=>6,remove(){throw Error('Map must be retained')}};render()");
assert.equal(mapWrites,1);assert.equal(reattached,retainedMapNode);assert.equal(run('state.dataCenter'),null);
run('egyptMap=null');
assert.ok(fs.readFileSync(new URL('../dist/index.html',import.meta.url),'utf8').includes('half-glass.css'));
console.log('PASS: all-campus/campus/building/data-center hierarchy, three dependent selectors, one-to-one metric preservation, history restoration, data-center invalidation and unchanged Leaflet DOM ownership.');
