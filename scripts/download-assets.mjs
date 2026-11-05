import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const destination=fileURLToPath(new URL('../dist/assets/',import.meta.url));
await fs.mkdir(destination,{recursive:true});
const base='https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/';
const neighbors=new Set(['EGY','LBY','SDN','SAU','ISR','JOR']);
function clipRoads(features){const output=[];for(const feature of features){const lines=feature.geometry.type==='LineString'?[feature.geometry.coordinates]:feature.geometry.type==='MultiLineString'?feature.geometry.coordinates:[];for(const line of lines){let segment=[];const finish=()=>{if(segment.length>1)output.push({type:'Feature',properties:{name:feature.properties.name||'',type:feature.properties.type||''},geometry:{type:'LineString',coordinates:segment}});segment=[]};for(const point of line){if(point[0]>=24.6&&point[0]<=37&&point[1]>=21.7&&point[1]<=32.1)segment.push(point);else finish()}finish()}}return output}
const sources=[
 {remote:'ne_50m_admin_0_countries.geojson',local:'egypt-map.geojson',select:features=>features.filter(f=>neighbors.has(f.properties.ADM0_A3))},
 {remote:'ne_10m_admin_1_states_provinces.geojson',local:'egypt-governorates.geojson',select:features=>features.filter(f=>f.properties.adm0_a3==='EGY'||f.properties.admin==='Egypt')},
 {remote:'ne_10m_rivers_lake_centerlines.geojson',local:'egypt-rivers.geojson',select:features=>features.filter(f=>String(f.properties.name||'').includes('Nile'))},
 {remote:'ne_10m_roads.geojson',local:'egypt-roads.geojson',select:clipRoads},
 {remote:'ne_50m_populated_places.geojson',local:'egypt-places.geojson',select:features=>features.filter(f=>f.properties.ADM0_A3==='EGY'||f.properties.adm0_a3==='EGY'||f.properties.ADM0NAME==='Egypt'||f.properties.adm0name==='Egypt')}
];
let failed=0;
for(const item of sources){try{console.log(`Downloading ${item.remote} ...`);const response=await fetch(base+item.remote,{signal:AbortSignal.timeout(180000)});if(!response.ok)throw Error(`HTTP ${response.status}`);const data=await response.json();if(data.type!=='FeatureCollection'||!Array.isArray(data.features))throw Error('Invalid geographic data');const features=item.select(data.features);if(!features.length)throw Error('No matching features; source schema may have changed');const target=path.join(destination,item.local);await fs.writeFile(target+'.tmp',JSON.stringify({type:'FeatureCollection',source:'Natural Earth v5.1.2 — public domain',features}));await fs.rename(target+'.tmp',target);console.log(`Saved ${item.local}: ${features.length} features`)}catch(error){failed++;console.error(`${item.local}: ${error.message}. Existing files are preserved. Check your connection and rerun to refresh.`)}}
if(failed)process.exitCode=1;else console.log('Offline Egypt geography is ready. Run node scripts/serve.mjs');
