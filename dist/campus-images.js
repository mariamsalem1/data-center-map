'use strict';
// Register each campus image independently; the remaining campuses retain their layouts.
const campusImages={cairo:{src:'assets/campus-cairo.png',sourceWidth:1672,sourceHeight:941,viewBox:'64 277 1265 414'}};
const campusImageOriginalPlan=campusPlan;
campusPlan=function(){
 const site=currentSite(),image=campusImages[site.id];if(!image)return campusImageOriginalPlan();if(image.full)return fullCampusPhoto(site,image);
 const buildings=Array.from({length:site.buildings},(_,i)=>`<button class="campus-image-hotspot campus-image-building building-${i}" data-building="DC-0${i+1}" aria-label="Open ${esc(site.name)} building DC-0${i+1}"><i class="${i===0&&site.alarms?'alert':''}"></i>DC-0${i+1}${i===0&&site.alarms?'<b>!</b>':''}</button>`).join('');
 const support=[['Chiller plant','AHU-03','chiller'],['Energy center','Generator A','energy'],['Admin','Control room','admin'],['Gate A','Main gate','gate']].map(([label,asset,position])=>`<button class="campus-image-hotspot support-${position}" data-equipment="${asset}" aria-label="Inspect ${label}"><i></i>${label}</button>`).join('');
 return `<div class="campus-image-layout" aria-label="${esc(site.name)} interactive campus layout"><svg class="campus-photo-window" viewBox="${image.viewBox}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="5th Settlement campus at blue hour, four data center buildings, chiller plant, energy center, administration building and entrance"><image href="${image.src}" width="${image.sourceWidth}" height="${image.sourceHeight}"/></svg>${buildings}${support}<span class="campus-image-caption">${site.short} · ILLUSTRATIVE CAMPUS VIEW · SELECT A BUILDING OR ASSET</span></div>`;
};

// Supplied image order follows the remaining campus directory order.
Object.assign(campusImages,{
 capital:{src:'assets/campus-capital.png',full:true,buildings:[[42,51],[53,40],[62,31]],chiller:[69,17],energy:[89,29],admin:[18,64],gate:[40,80]},
 october:{src:'assets/campus-october.png',full:true,buildings:[[22,42],[41,35],[61,32]],chiller:[15,24],energy:[83,24],admin:[80,59],gate:[22,79]},
 alex:{src:'assets/campus-alex.png',full:true,buildings:[[36,40],[50,39],[68,39]],chiller:[20,27],energy:[13,45],admin:[53,64],gate:[84,70]},
 suez:{src:'assets/campus-suez.png',full:true,buildings:[[25,52],[77,52]],chiller:[29,25],energy:[62,26],admin:[80,72],gate:[50,75]},
 aswan:{src:'assets/campus-aswan.png',full:true,buildings:[[22,46],[23,27]],chiller:[76,34],energy:[64,55],admin:[17,68],gate:[42,72]},
 mansoura:{src:'assets/campus-mansoura.png',full:true,buildings:[[28,51],[72,51]],chiller:[29,21],energy:[67,21],admin:[20,74],gate:[49,80]}
});
function fullCampusPhoto(site,image){
 const buildings=image.buildings.slice(0,site.buildings).map(([x,y],i)=>{const condition=i===0?site.status:'operational';return `<button class="campus-image-hotspot campus-map-building ${condition}" style="left:${x}%;top:${y}%" data-building="DC-0${i+1}" aria-label="Open ${esc(site.name)} building DC-0${i+1}"><i></i>DC-0${i+1}${i===0&&site.alarms?'<b>!</b>':''}</button>`}).join('');
 const support=[['Chiller plant','AHU-03','chiller'],['Energy center','Generator A','energy'],['Admin','Control room','admin'],['Gate A','Main gate','gate']].map(([label,asset,key])=>`<button class="campus-image-hotspot" style="left:${image[key][0]}%;top:${image[key][1]}%" data-equipment="${asset}" aria-label="Inspect ${label} at ${esc(site.name)}"><i></i>${label}</button>`).join('');
 return `<div class="campus-image-layout campus-full-image" aria-label="${esc(site.name)} interactive campus layout"><img class="campus-full-photo" src="${image.src}" alt="${esc(site.name)} illustrative campus aerial showing data center buildings and support facilities" decoding="async">${buildings}${support}<span class="campus-image-caption">${esc(site.name)} · ${site.short} · ILLUSTRATIVE CAMPUS VIEW</span></div>`;
}
