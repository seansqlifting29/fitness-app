/* offline support: the app opens with no signal once it has been loaded one time */
const VERSION = 'fitness-v34';
const SHELL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png','./favicon.png','./firebase.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.origin!==location.origin)return; // sign-in and cloud sync go straight to the network
  const scope=new URL(self.registration.scope).pathname;
  const isApp=url.pathname===scope||url.pathname===scope+'index.html';
  if(req.mode==='navigate'&&!isApp)return; // other pages (like the preview) are never saved as the app
  // the app page: try the network for updates, fall back to the saved copy offline
  if(req.mode==='navigate'){e.respondWith(fetch(req).then(r=>{const c=r.clone();caches.open(VERSION).then(x=>x.put('./index.html',c));return r}).catch(()=>caches.match('./index.html')));return}
  // everything else (icons, fonts): saved copy first, refresh in the background
  e.respondWith(caches.match(req).then(hit=>{const net=fetch(req).then(r=>{if(r&&(r.ok||r.type==='opaque')){const c=r.clone();caches.open(VERSION).then(x=>x.put(req,c))}return r}).catch(()=>hit);return hit||net}));
});
