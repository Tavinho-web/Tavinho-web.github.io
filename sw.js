const CACHE_NAME = 'v1_ruta_gastro';

// Instalación del Service Worker
self.addEventListener('install', e => {
  console.log('Service Worker instalado');
});

// Activación
self.addEventListener('activate', e => {
  console.log('Service Worker activo');
});

// Estrategia de carga (Fetch)
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
