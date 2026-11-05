'use strict';
/* Expand the original chart card so hover readings and existing handlers remain intact. */
(()=>{
 let active=null,origin=null,shade=null;
 function close(){if(!active)return;active.classList.remove('card-focus-open');origin?.setAttribute('aria-expanded','false');if(origin)origin.textContent='Expand chart';shade?.remove();document.body.classList.remove('card-focus-mode');const restore=origin;active=null;origin=null;shade=null;if(restore?.isConnected)restore.focus()}
 function decorate(){
  if(active&&!active.isConnected)close();
  document.querySelectorAll('.panel').forEach(card=>{
   if(card.querySelector('.card-focus-action')||!card.querySelector('svg[data-chart-model]:not(.spark)')||card.querySelector('#egypt-map,.leaflet-container'))return;
   const button=document.createElement('button');button.className='card-focus-action';button.type='button';button.textContent='Expand chart';button.setAttribute('aria-expanded','false');
   const title=card.querySelector('.panel-title,h2,h3')?.textContent?.trim()||'Chart';button.setAttribute('aria-label','Expand '+title);
   button.addEventListener('click',()=>{if(active===card){close();return}close();active=card;origin=button;shade=document.createElement('div');shade.className='card-focus-shade';shade.addEventListener('click',close);document.body.appendChild(shade);card.classList.add('card-focus-open');document.body.classList.add('card-focus-mode');button.textContent='Close expanded chart';button.setAttribute('aria-expanded','true');button.focus()});card.appendChild(button);
  });
 }
 document.addEventListener('keydown',e=>{if(e.key==='Escape')close();if(e.key==='Tab'&&active){const nodes=Array.from(active.querySelectorAll('button,a[href],select,input,[tabindex="0"]')).filter(el=>!el.disabled&&!el.hidden);const first=nodes[0],last=nodes[nodes.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}}});
 let queued=false;new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;decorate()})}).observe(document.getElementById('content')||document.body,{childList:true,subtree:true});decorate();
})();
