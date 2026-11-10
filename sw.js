const CACHE='paper-hop-v1.1-tilt';
const FILES=['./','./index.html','./icon.png','./manifest.webmanifest'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('paper-hop-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
// HTML is always network-first, including a reload from an older Home Screen icon.
// Offline navigation still uses the most recent successfully downloaded game.
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;const url=new URL(e.request.url);const html=e.request.mode==='navigate'||url.pathname.endsWith('/index.html')||url.pathname.endsWith('/');e.respondWith(fetch(e.request,html?{cache:'no-store'}:undefined).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{})}return response}).catch(()=>caches.match(e.request).then(cached=>cached||(html?caches.match('./index.html'):Response.error()))))});
