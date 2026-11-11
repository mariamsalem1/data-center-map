'use strict';
const completionImages={
 rack:['server-rack.png','Server cabinet'],aisle:['cold-aisle.png','Cold aisle'],vehicle:['vehicle-entrance.png','Main vehicle entrance'],service:['service-entrance.png','Service entrance'],entrance:['datahall-entrance.png','Data hall entrance'],corridor:['security-corridor.png','Security corridor'],ats:['ats.png','Automatic transfer switch'],transformer:['transformer.png','Utility transformer'],battery:['battery-bank.png','Battery bank'],pdu:['pdu.png','Power distribution unit'],chiller:['chiller-plant.png','Chiller plant'],tower:['cooling-tower.png','Cooling tower'],filter:['filter-bank.png','AHU filter bank'],fan:['fan-motor.png','Supply fan and motor'],admin:['administration.png','Administration building'],coil:['cooling-coil.png','Cooling coil'],gate:['entry-gate.png','Entry gate'],energy:['energy-center.png','Energy center']
};
function completionImageKey(name){
 if(/fire|suppression|emergency/i.test(name))return null;
 if(/energy center/i.test(name))return 'energy';
 if(/administration|admin building/i.test(name))return 'admin';
 if(/cold aisle/i.test(name))return 'aisle';
 if(/vehicle entrance|main gate/i.test(name))return 'vehicle';
 if(/service entrance|loading/i.test(name))return 'service';
 if(/data hall entrance|security door/i.test(name))return 'entrance';
 if(/security corridor|control room corridor/i.test(name))return 'corridor';
 if(/entry gate|gate a/i.test(name))return 'gate';
 if(/transformer/i.test(name))return 'transformer';
 if(/\bATS\b|automatic transfer/i.test(name))return 'ats';
 if(/\bPDU\b|power distribution unit/i.test(name))return 'pdu';
 if(/battery bank|batteries/i.test(name))return 'battery';
 if(/chiller plant/i.test(name))return 'chiller';
 if(/cooling tower/i.test(name))return 'tower';
 if(/filter/i.test(name))return 'filter';
 if(/cooling coil/i.test(name))return 'coil';
 if(/supply fan|return fan|fan motor/i.test(name))return 'fan';
 return null;
}
const completionOriginalPhoto=equipmentPhotoFor;
equipmentPhotoFor=function(name){const key=completionImageKey(name);if(!key)return completionOriginalPhoto(name);const [file,label]=completionImages[key];return {src:'assets/'+file,name:label,alt:label+' equipment illustration supplied for this dashboard'}};
function completionPhoto(key,cls=''){const [file,label]=completionImages[key];return `<img class="completion-photo ${cls}" src="assets/${file}" alt="${esc(label)}" loading="lazy" decoding="async">`}
// Use the supplied rack image while retaining selection and temperature overlays.
twinRackSVG=function(n,full=false){const r=twinRackReading(n),color=r.hot?C.red:r.warm?C.amber:C.mint;return `<svg class="rack-model ${full?'full-rack':''}" viewBox="630 15 410 ${full?910:360}" role="img" aria-label="Rack R-${String(n).padStart(2,'0')} equipment view"><image href="assets/server-rack.png" width="1672" height="941"/>${state.heatmap?`<rect x="635" y="20" width="400" height="900" fill="${color}" opacity=".28"/>`:''}<circle cx="1008" cy="44" r="10" fill="${color}" stroke="#12222b" stroke-width="3"/></svg>`};
const completionOriginalHalls=dataHalls;
dataHalls=function(){const original=completionOriginalHalls();const hall=`<section class="completion-aisle"><button class="completion-image-button" data-equipment="Cold aisle" aria-label="Inspect cold aisle">${completionPhoto('aisle')}<span class="completion-hero-text"><small>${esc(currentSite().name)} / ${state.building}</small><strong>Data Hall ${twinHall} · Cold aisle containment</strong><span>32 monitored racks · Select a rack below for detailed readings</span></span></button></section>`;return original.replace('<div class="white-space-layout">',hall+'<div class="white-space-layout">')};
const completionOriginalElectrical=electrical;
electrical=function(){return completionOriginalElectrical()+`<div class="completion-section-heading"><h2>Electrical distribution equipment</h2><span class="chip">SIMULATED TELEMETRY</span></div><div class="completion-equipment-grid">${equipmentCard('Utility transformer','11 / 0.415','kV','Incoming transformer · Temperature and load monitored.','Utility transformer')}${equipmentCard('Automatic transfer switch','Auto','','Primary source available · Transfer monitoring only.','ATS')}${equipmentCard('Power distribution unit','415','V','Three-phase distribution and breaker monitoring.','PDU')}${equipmentCard('Battery bank',currentSite().id==='suez'&&state.building==='DC-01'?'76':'94','% health','Battery condition and autonomy monitoring.','Battery bank')}</div>`};
const completionOriginalMechanical=mechanical;
mechanical=function(){return completionOriginalMechanical()+`<div class="completion-section-heading"><h2>Cooling plant and AHU components</h2><span class="chip">SELECT EQUIPMENT TO INSPECT</span></div><div class="completion-equipment-grid">${equipmentCard('Chiller plant','7.0','°C water','Chilled water generation, pumps, and supply circuit.','Chiller plant')}${equipmentCard('Cooling tower','64','% fan demand','Heat rejection and condenser water monitoring.','Cooling tower')}${equipmentCard('Filter bank','125','Pa ΔP','Pleated filters · Advisory threshold 200 Pa.','Filter bank')}${equipmentCard('Fan and drive motor','1,450','RPM','Drive speed, motor load, and vibration monitored.','Supply fan')}${equipmentCard('Cooling coil','64','% valve position','Water inlet, outlet, and coil performance monitored.','Cooling coil')}</div>`};
const completionOriginalCampus=campus;
campus=function(){return completionOriginalCampus()+`<div class="completion-section-heading"><h2>Campus support facilities</h2></div><div class="completion-equipment-grid completion-facilities">${equipmentCard('Administration building','Secured','','Access and building services monitoring.','Administration building')}${equipmentCard('Energy center',currentSite().power.toFixed(1),'MW','Campus electrical and backup generation infrastructure.','Energy center')}${equipmentCard('Entry gate','Secured','','Barrier, reader, and camera monitoring.','Entry gate')}</div>`};
// Campus labels open the specific facility, rather than a similar equipment proxy.
const completionOriginalPlan=campusPlan;
campusPlan=function(){return completionOriginalPlan().replace(/data-equipment="AHU-03"/g,'data-equipment="Chiller plant"').replace(/data-equipment="Generator A"/g,'data-equipment="Energy center"').replace(/data-equipment="Control room"/g,'data-equipment="Administration building"').replace(/data-equipment="Main gate"/g,'data-equipment="Entry gate"')};
const completionCameraViews=[['aisle','Data Hall A · North aisle','Cold aisle'],['entrance','Data hall entrance','Data hall entrance'],['corridor','Security corridor','Security corridor'],['vehicle','Main vehicle entrance','Main gate'],['gate','Entry gate close-up','Entry gate'],['service','Service / loading entrance','Service entrance']];
security=function(){const advisory=typeof fireMaintenance==='function'&&fireMaintenance();const detectors=advisory?'95 / 96':'96 / 96';const note=advisory?'1 maintenance advisory · SD-042 scheduled inspection':'Fire alarm panel normal · no active alarm';return `<button type="button" class="fire-alarm-summary${advisory?' advisory':''}" data-tab="fire" aria-label="Fire alarm summary. Open the fire systems tab."><span class="fire-alarm-kicker">Fire alarms</span><span class="fire-alarm-copy"><strong>${advisory?'Maintenance advisory':'No active fire alarm'}</strong><small>${note} · ${detectors} detectors online · Simulated</small></span><em>Open fire systems</em></button><div class="kpi-grid">${kpi('Cameras available','23 / 24','','1 offline','maintenance scheduled',0,C.amber)}${kpi('Access points secured','12 / 12','','Secured','monitored doors and gates',1)}${kpi('Authorized entries today',String(100+sites.indexOf(currentSite())*7+42),'entries','Local simulation','selected campus',2,C.blue)}${kpi('Security incidents','0','active','Clear','current building',3)}</div><div class="completion-section-heading"><div><h2>Physical security</h2><p>CCTV and access control</p></div><span class="chip amber">ILLUSTRATIVE IMAGES · NO LIVE CCTV</span></div><div class="completion-camera-grid">${completionCameraViews.map(([key,label,asset],i)=>`<button class="completion-camera" data-equipment="${asset}" aria-label="Inspect ${label}">${completionPhoto(key)}<span class="completion-camera-top"><b>CAM-${String(i+1).padStart(2,'0')}</b><small>${i===5?'MAINTENANCE':'SIMULATED VIEW'}</small></span><span class="completion-camera-bottom"><strong>${label}</strong><small>${i===5?'Camera offline · Reference image retained':'Monitored access point · Open inspector ↗'}</small></span></button>`).join('')}</div>${panel('Access point status','Read-only physical access monitoring',`<div class="completion-access-grid">${['Main gate','Service entrance','Data hall entrance','Security corridor'].map(name=>`<button data-equipment="${name}"><i></i><strong>${name}</strong><span>Door / barrier secured</span><small>Controller online · Illustrative status</small></button>`).join('')}</div>`)}`};
const completionOriginalInspector=equipmentDrawer;
function completionAssetRows(key){
 const b=selectedBuildingMetrics(),power=b?b.power:currentSite().power;
 const rows={
 transformer:[['Voltage ratio','11 / 0.415 kV'],['Allocated load',power.toFixed(2)+' MW'],['Winding temperature','64 °C'],['Protection','Normal']],
 ats:[['Operating mode','Auto'],['Selected source','Utility A'],['Supply voltage','415 V'],['Frequency','50 Hz']],
 pdu:[['Output voltage','415 V'],['Frequency','50 Hz'],['Power factor','0.99'],['Branch breakers','Available']],
 battery:[['Battery health',currentSite().id==='suez'&&state.building==='DC-01'?'76 %':'94 %'],['Autonomy','18 minutes'],['Room temperature','23.6 °C'],['Inspection status',currentSite().id==='suez'?'Capacity inspection recommended':'Routine monitoring']],
 chiller:[['Chilled water supply','7.0 °C'],['Chilled water return','12.0 °C'],['Circuit pressure','3.2 bar'],['Redundancy','N+1']],
 tower:[['Fan demand','64 %'],['Condenser water supply','29.0 °C'],['Condenser water return','34.0 °C'],['Make-up supply','Available']],
 filter:[['Differential pressure','125 Pa'],['Advisory threshold','200 Pa'],['Filter stage','Pleated bank'],['Condition','Within range']],
 fan:[['Drive speed','1,450 RPM'],['Frequency','48.3 Hz'],['Motor load','72 %'],['Vibration','2.1 mm/s']],
 coil:[['Chilled water supply','7.0 °C'],['Valve position','64 %'],['Supply air','18.2 °C'],['Circuit pressure','3.2 bar']],
 admin:[['Access','Secured'],['Occupancy','Authorized personnel'],['Environment','Within configured range'],['Controllers','Online']],
 energy:[['Campus load',currentSite().power.toFixed(1)+' MW'],['Utility supply','Available'],['Backup generation','Standby'],['Distribution','Monitored']],
 gate:[['Barrier','Closed / Secured'],['Access reader','Online'],['Camera','Available'],['Control mode','Monitoring only']],
 vehicle:[['Vehicle barrier','Closed / Secured'],['Camera','Available'],['Access controller','Online'],['Last event','Authorized access']],
 service:[['Loading shutter','Closed'],['Personnel door','Secured'],['Camera','Scheduled maintenance'],['Access controller','Online']],
 entrance:[['Door','Closed / Secured'],['Reader','Online'],['Authentication','Authorized access'],['Camera','Available']],
 corridor:[['Cameras','Available'],['Door controllers','Online'],['Access state','Secured'],['Active incidents','0']],
 aisle:[['Data hall',twinHall],['Containment','Sealed'],['Average inlet','23.6 °C'],['Relative humidity','46 %RH'],['Monitored racks','32']]
 };return rows[key]||[];
}
equipmentDrawer=function(name){
 const key=completionImageKey(name);if(!key){completionOriginalInspector(name);return}
 const [file,label]=completionImages[key],attention=key==='battery'&&currentSite().id==='suez'&&state.building==='DC-01';
 openDrawer(`<div class="eyebrow">ASSET INSPECTOR / ${esc(currentSite().short)}</div><h2>${label}</h2><p>${esc(currentSite().name)}${state.building?' / '+state.building:''} · Simulated telemetry</p><figure class="equipment-photo completion-inspector-photo">${completionPhoto(key)}</figure>${status(attention?'warning':'operational')}<div class="detail-list">${completionAssetRows(key).map(([k,v])=>`<p>${k}<strong>${esc(v)}</strong></p>`).join('')}<p>Telemetry source<strong>Local demonstration</strong></p></div><p>This supplied image illustrates the monitored asset. Readings and access states are simulated; no physical equipment controls are connected.</p><button class="button primary" data-action="new-work">Create inspection work order</button>`);
};
// Retain sensor-specific readings and add the matching AHU component photograph.
const completionSensorInspector=equipmentDrawer;
equipmentDrawer=function(name){if(coolingSensors[name])completionOriginalInspector(name);else completionSensorInspector(name);const component={'Supply fan VFD-01':'fan','Filter differential DP-01':'filter','Chilled water TT-03':'coil'}[name];if(component){$('#drawer').innerHTML=$('#drawer').innerHTML.replace('</h2>',`</h2><figure class="completion-sensor-photo">${completionPhoto(component)}</figure>`)}};

function completionCoolingContext(){const m=selectedBuildingMetrics();const hot=!!m?.alarms.some(a=>a.system==='mechanical');const load=(m?m.power:currentSite().power)*.29;return {hot,load,capacity:load/.64,returnAir:hot?29.4:25.8}}
coolingTrend=function(){const c=completionCoolingContext();return performanceLineChart([{label:'Return air',values:performanceDay(c.returnAir,1),color:c.hot?C.red:C.mint},{label:'Supply air',values:performanceDay(18.2,2),color:'#64e9ff'}],'°C','Supply and return air temperature · illustrative')};
const completionScopedMechanical=mechanical;
mechanical=function(){
 const c=completionCoolingContext();let html=completionScopedMechanical();
 const top=`<div class="kpi-grid">${kpi('Cooling demand',c.load.toFixed(2),'MW','Stable','selected building load',2,C.blue)}${kpi('Supply air temperature','18.2','°C','Within range','target 18–20 °C',0)}${kpi('Cooling COP','5.30','','Illustrative','operating efficiency',3)}${kpi('AHU-03 return air',c.returnAir.toFixed(1),'°C',c.hot?'Above limit':'Within range','threshold 28 °C',1,c.hot?C.red:C.mint)}</div>`;
 html=html.replace(/<div class="kpi-grid">[\s\S]*?(?=<section class="cooling-hero")/,top);
 html=html.replace(/<div class="cooling-capacity">[\s\S]*?<\/div><\/div>/,`<div class="cooling-capacity">${donut(64,'Utilization',C.mint)}<div><small>Available</small><strong>${(c.capacity-c.load).toFixed(2)} <span>MW</span></strong><p>Installed ${c.capacity.toFixed(2)} MW</p></div></div>`);
 if(!c.hot){html=html.replaceAll('29.4','25.8').replace('1 critical event','No active cooling alarms').replace('class="cooling-sensor return"','class="cooling-sensor return normal"').replaceAll('Inspect AHU-03 return sensor','Routine AHU monitoring').replace('Return air temperature (25.8 °C) is above the 28 °C threshold.','Return air temperature (25.8 °C) is within the configured operating range.')}
 return html;
};
const completionScopedElectrical=electrical;
electrical=function(){const m=selectedBuildingMetrics();if(!m)return completionScopedElectrical();const batteryWarning=m.alarms.some(a=>a.system==='electrical');const top=`<div class="kpi-grid">${kpi('Incoming utility power',m.power.toFixed(2),'MW','Grid available','selected building',2,C.blue)}${kpi('IT power',m.it.toFixed(2),'MW',(m.it/m.power*100).toFixed(1)+'%','of facility demand',0)}${kpi('UPS efficiency','96.8','%','Monitoring','current operating efficiency',3)}${kpi('Battery health',batteryWarning?'76':'94','%',batteryWarning?'Inspection recommended':'Healthy','selected building UPS bank',1,batteryWarning?C.amber:C.mint)}</div>`;let html=completionScopedElectrical().replace(/^<div class="kpi-grid">[\s\S]*?(?=<div class="split-layout")/,top);if(!batteryWarning)html=html.replace(/76 %[^<]*Attention/g,'94 % · Healthy');return html};
const completionScopedRender=render;
render=function(){const c=completionCoolingContext();Object.assign(coolingSensors['Return sensor TT-02'],{value:c.returnAir.toFixed(1),status:c.hot?'critical':'operational',note:c.hot?'Return air is above the 28 °C threshold. Verify sensor calibration, placement, and airflow.':'Return air is within the configured operating range.',rows:[['Sensor ID','TT-02'],['Location','Return duct'],['Condition',c.hot?'Above limit':'Within range']]});completionScopedRender()};
