'use strict';
// Exact user-supplied images, bundled locally. Equipment interaction remains HTML.
const equipmentPhotos={
 generator:{src:'assets/generator-a.png',name:'Generator A',alt:'Diesel generator with visible engine, alternator, controls, and exhaust'},
 ups:{src:'assets/ups-b.png',name:'UPS-B',alt:'UPS cabinets with monitoring displays and adjacent battery enclosure'},
 ahu:{src:'assets/ahu-03.png',name:'AHU-03',alt:'Open air handling unit showing pleated filters, centrifugal fan, cooling coil and piping'},
 switchgear:{src:'assets/switchgear.png',name:'Switchgear',alt:'Electrical switchgear lineup with metering, circuit breakers and exposed copper busbar section'},
 tank:{src:'assets/water-tank.png',name:'Water tank with pump',alt:'Stainless steel water tank with level gauge, blue piping, isolation valves and centrifugal pump'},
 pump:{src:'assets/water-pump.png',name:'Water tank and pump assembly',alt:'Water storage tank connected to a blue centrifugal pump, motor and valved pipework'}
};
function equipmentPhotoFor(name){
 if(/fire|suppression/i.test(name))return null;
 if(/generator|fuel/i.test(name))return equipmentPhotos.generator;
 if(/switchgear|utility/i.test(name))return equipmentPhotos.switchgear;
 if(/ups|batter|power distribution|backup power/i.test(name))return equipmentPhotos.ups;
 if(/ahu|air handling|fan|filter|coil/i.test(name))return equipmentPhotos.ahu;
 if(/pump/i.test(name))return equipmentPhotos.pump;
 if(/water|tank/i.test(name))return equipmentPhotos.tank;
 return null;
}
const equipmentOriginalScene=twinScene;
twinScene=function(kind,label,compact=false){
 const photo=equipmentPhotoFor(label);
 if(!photo)return equipmentOriginalScene(kind,label,compact);
 return `<figure class="equipment-photo twin-scene ${compact?'compact':''}"><img src="${photo.src}" alt="${esc(photo.alt)}" loading="lazy" decoding="async"><figcaption><span>${photo.name}</span><small>ILLUSTRATIVE ASSET IMAGE</small></figcaption></figure>`;
};
const equipmentPhotoInspector=equipmentDrawer;
equipmentDrawer=function(name){
 equipmentPhotoInspector(name);
 if(/water tank/i.test(name)){
  const photo=equipmentPhotos.pump;
  $('#drawer').innerHTML+=`<section class="equipment-secondary-photo"><h3>Pump and pipework</h3><img src="${photo.src}" alt="${esc(photo.alt)}" loading="lazy" decoding="async"><p>Alternative view of the tank, valves, pump, and motor assembly.</p></section>`;
 }
};
