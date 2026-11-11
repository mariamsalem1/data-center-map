'use strict';
/* Offline PDF export with vector charts; no remote services or print setup required. */
function portfolioReportSnapshot(){
 const selected=state.building?selectedBuildingMetrics():null;
 const rows=selected?[{name:selected.site.name+' / '+buildingDisplayName(state.building),pue:selected.pue,power:selected.power,racks:selected.racks,capacity:selected.rackCapacity,alarms:selected.alarms.length}]:scopedSites().map(s=>{const m=campusMetrics(s);return {name:s.name,pue:m.pue,power:m.power,racks:m.occupied,capacity:m.capacity,alarms:s.alarms}});
 return {scope:selected?rows[0].name+(state.dataCenter?' / Data Center 01':''):state.site?currentSite().name:state.region==='all'?'All Egypt campuses':state.region,rows,alerts:selected?selected.alarms:activeAlerts(),date:new Date().toLocaleString('en-GB',{timeZone:'Africa/Cairo'})};
}
function portfolioPDF(snapshot){
 const ascii=v=>String(v).replace(/\u00b0/g,' deg ').replace(/[^\x20-\x7e]/g,' ').replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)');
 const pages=[];let commands=[];
 const text=(x,y,value,size=10)=>commands.push(`0.13 0.20 0.27 rg BT /F1 ${size} Tf ${x} ${842-y} Td (${ascii(value)}) Tj ET`);
 const rect=(x,y,w,h,color)=>commands.push(`${color} rg ${x} ${842-y-h} ${w} ${h} re f`);
 const heading=title=>{commands=[];rect(0,0,595,9,'0.18 0.44 0.43');text(36,43,'Unified Operations Center | '+title,19);text(36,66,snapshot.scope,10);text(36,83,'Generated '+snapshot.date+' (Cairo) | SIMULATED DATA',9)};
 const finish=()=>{text(36,809,'Demonstration telemetry. For operational review; not verified facility measurements.',8);text(527,809,String(pages.length+1),9);pages.push(commands.join('\n'))};
 const chart=(title,key,unit,y,color)=>{text(36,y,title,13);const max=Math.max(1,...snapshot.rows.map(r=>r[key]));snapshot.rows.forEach((r,i)=>{const yy=y+20+i*20;text(36,yy+10,r.name.replace(' Campus','').slice(0,29),8);rect(211,yy,270,13,'0.91 0.94 0.95');rect(211,yy,270*r[key]/max,13,color);text(490,yy+10,r[key].toFixed(key==='racks'?0:2)+' '+unit,8)})};
 heading('Portfolio performance report');
 const power=snapshot.rows.reduce((a,r)=>a+r.power,0),it=snapshot.rows.reduce((a,r)=>a+r.power/r.pue,0),racks=snapshot.rows.reduce((a,r)=>a+r.racks,0),capacity=snapshot.rows.reduce((a,r)=>a+r.capacity,0);
 [['Facility power',power.toFixed(2)+' MW'],['Weighted PUE',it?(power/it).toFixed(2):'N/A'],['Occupied racks',racks+' / '+capacity],['Active alarms',snapshot.alerts.length]].forEach(([label,value],i)=>{rect(36+i*132,106,125,64,'0.94 0.97 0.97');text(46+i*132,126,label,9);text(46+i*132,151,value,15)});
 const h=45+snapshot.rows.length*20;
 chart('Facility power by location','power','MW',202,'0.24 0.48 0.73');chart('Power usage effectiveness (lower is better)','pue','PUE',202+h,'0.20 0.55 0.49');chart('Occupied rack positions','racks','racks',202+h*2,'0.48 0.41 0.70');finish();
 heading('Readings and source alarms');text(36,118,'Location',10);text(302,118,'PUE',10);text(352,118,'MW',10);text(409,118,'Racks / total',10);text(514,118,'Alarms',9);
 let y=143;snapshot.rows.forEach(r=>{rect(36,y-13,523,26,'0.95 0.97 0.98');text(42,y,r.name.slice(0,43),8);text(302,y,r.pue.toFixed(2),9);text(352,y,r.power.toFixed(2),9);text(409,y,r.racks+' / '+r.capacity,9);text(523,y,r.alarms,9);y+=31});
 y+=26;text(36,y,'Active source alarms',13);y+=28;if(!snapshot.alerts.length)text(36,y,'No active source alarms in this scope.',10);
 snapshot.alerts.forEach(a=>{if(y>710){finish();heading('Source alarms continued');y=125}text(36,y,(a.severity||'warning').toUpperCase()+' | '+a.id+' | '+a.title,10);text(36,y+18,(a.asset||'')+' | Reading: '+(a.reading||'')+' | '+(a.threshold||''),8);text(36,y+34,'Acknowledgment: '+(state.ack.includes(a.id)?'acknowledged; source remains active':'pending'),8);y+=62});finish();
 const objects=['<< /Type /Catalog /Pages 2 0 R >>','', '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'];const kids=[];
 pages.forEach(content=>{const page=objects.length+1,stream=page+1;kids.push(page+' 0 R');objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents ${stream} 0 R >>`,`<< /Length ${content.length} >>\nstream\n${content}\nendstream`)});
 objects[1]=`<< /Type /Pages /Count ${pages.length} /Kids [${kids.join(' ')}] >>`;let pdf='%PDF-1.4\n',offsets=[0];objects.forEach((o,i)=>{offsets.push(pdf.length);pdf+=`${i+1} 0 obj\n${o}\nendobj\n`});const start=pdf.length;pdf+=`xref\n0 ${objects.length+1}\n0000000000 65535 f \n`+offsets.slice(1).map(n=>String(n).padStart(10,'0')+' 00000 n \n').join('')+`trailer\n<< /Size ${objects.length+1} /Root 1 0 R >>\nstartxref\n${start}\n%%EOF`;return pdf;
}
exportReport=function(){const snapshot=portfolioReportSnapshot();if(!snapshot.rows.length){toast('Choose a location with monitored data.');return}const url=URL.createObjectURL(new Blob([portfolioPDF(snapshot)],{type:'application/pdf'})),link=document.createElement('a');link.href=url;link.download='unified-operations-report-'+new Date().toISOString().slice(0,10)+'.pdf';link.click();setTimeout(()=>URL.revokeObjectURL(url),30000);toast('PDF report with charts downloaded')};
if(document.getElementById('export-button'))document.getElementById('export-button').onclick=exportReport;
