penpot.ui.open("Material Theme Builder",`?theme=${penpot.theme}`);penpot.ui.onMessage(e=>{if(e.source=="plugin")switch(e.type){case"create-colors":{const{colors:o,ref:t}=e.data;k(o,t);break}case"create-color":{const{color:o,ref:t}=e.data;u(o,t);break}case"update-colors":{const{colors:o,ref:t}=e.data;M(o,t);break}case"update-color":{const{color:o,ref:t}=e.data;f(o,t);break}case"remove-colors":{const{colors:o,ref:t}=e.data;S(o,t);break}case"remove-color":{const{color:o,ref:t}=e.data;C(o,t);break}case"load-local-library-colors":{A(),P();break}case"update-current-page-colors":{const{mappings:o,ref:t}=e.data;E(o,t);break}case"update-current-selection-colors":{const{mappings:o,ref:t}=e.data;I(o,t);break}case"delete-library-theme":{const{themeName:o,ref:t}=e.data;v(o,t);break}}});penpot.on("selectionchange",()=>{const e=penpot.selection;penpot.ui.sendMessage({source:"penpot",type:"selection-changed",data:{shapes:e}})});penpot.on("themechange",e=>{penpot.ui.sendMessage({source:"penpot",type:"theme-changed",data:{theme:e}})});function k(e,o){e.forEach(t=>{u(t,o)})}function u(e,o){const t=penpot.library.local.createColor();g(t,e),penpot.ui.sendMessage({source:"penpot",type:"color-created",data:{color:t,ref:o}})}function M(e,o){e.forEach(t=>{f(t,o)})}function f(e,o){const t=penpot.library.local.colors.find(n=>n.id===e.id);if(!t){console.warn(`Color with ID ${e.id} not found.`);return}g(t,e),penpot.ui.sendMessage({source:"penpot",type:"color-updated",data:{color:t,ref:o}})}function S(e,o){e.forEach(t=>{C(t,o)})}function C(e,o){console.warn("Penpot API does not support removals. Skipping..."),penpot.ui.sendMessage({source:"penpot",type:"color-removed",data:{color:e,ref:o}})}function g(e,o){const t=o.name?o.name:e.name,n=o.path?o.path:e.path;o.color&&(e.color=o.color),o.opacity&&(e.opacity=o.opacity),o.gradient&&(e.gradient=o.gradient),o.image&&(e.image=o.image),e.name=t,e.path=n}function A(){penpot.ui.sendMessage({source:"penpot",type:"library-colors-fetched",data:{colors:penpot.library.local.colors}})}function P(){penpot.ui.sendMessage({source:"penpot",type:"all-library-colors-fetched",data:{colors:h().flatMap(e=>e.colors)}})}function v(e,o){console.log(`Pretending to delete all assets related to ${e} with ${o.toString()} reference.`),console.warn("Operation not supported by penpot plugin.")}function E(e,o){if(!penpot.currentPage){console.error("Current page not available.");return}R(penpot.currentPage,e,o)}function I(e,o){const t=penpot.selection;if(t.length==0){console.error("Current selection is empty.");return}p(t,e,o)}function R(e,o,t){const n=e.findShapes();p(n,o,t)}function p(e,o,t){penpot.ui.sendMessage({source:"penpot",type:"shape-color-mapping-started",data:{size:e.length,ref:t}}),e.forEach(n=>{const d=n.fills,b=n.strokes,m=n.shadows??[];let s=!1;const i=h().flatMap(r=>r.colors);G(d)&&(n.fills=d.map(r=>{if(r.fillColorRefId){const a=o[r.fillColorRefId];if(!a)return r;const c=i.find(l=>l.id==a.id);if(c)return s=!0,c.asFill()}return r})),n.strokes=b.map(r=>{if(r.strokeColorRefId){const a=o[r.strokeColorRefId];if(!a)return r;const c=i.find(l=>l.id==a.id);if(c)return s=!0,w(r,c)}return r}),n.shadows=m.map(r=>{var a;if((a=r.color)!=null&&a.id){const c=o[r.color.id];if(!c)return r;const l=i.find(y=>y.id==c.id);if(l)return s=!0,r.color=l,r}return r}),penpot.ui.sendMessage({source:"penpot",type:"shape-colors-updated",data:{id:n.id,updated:s,ref:t}}),L(n)&&p(n.children,o,t)}),penpot.ui.sendMessage({source:"penpot",type:"shape-color-mapping-completed",data:{ref:t}})}function w(e,o){const t=o.asStroke();return t.strokeAlignment=e.strokeAlignment,t.strokeStyle=e.strokeStyle,t.strokeCapStart=e.strokeCapStart,t.strokeCapEnd=e.strokeCapEnd,t.strokeWidth=e.strokeWidth,t.strokeColorGradient=e.strokeColorGradient,t}function G(e){return Array.isArray(e)}function L(e){return"children"in e}function h(){return[penpot.library.local,...penpot.library.connected]}
