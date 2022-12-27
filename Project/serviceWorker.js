self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('termproject').then(function(cache) {
        return cache.addAll(["./", "./style.css", "./images/logo192.png"]);
      })
    );
  });
  
  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  });