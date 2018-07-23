const staticCacheName = 'rest-reviews-static-v1';

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(staticCacheName).then(function(cache) {
            return cache.addAll([
                '/',
                '/css/responsive.css',
                '/css/styles.css',
                '/js/dbhelper.js',
                '/js/main.js',
                '/js/restaurant_info.js',
                '/index.html',
                '/restaurant.html',
                '/data/restaurants.json'
            ]);
        })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cacheName) {
                    return cacheName.startsWith('rest-reviews-') &&
                        cacheName != staticCacheName;
                }).map(function(cacheName) {
                    return caches.delete(cacheName); 
                })
            );
        })
    );
});

self.addEventListener('fetch', function(event) {
    const requestUrl = new URL(event.request.url);
    if (requestUrl.origin === location.origin) {
        if (event.request.url.endsWith('jpg') || event.request.url.endsWith('png')) {
            event.respondWith(
                caches.match(event.request).then(function(response) {
                    if (response) {
                        return response;
                    }

                    return fetch(event.request).then(function(response) {
                        const response2 = response.clone();

                        // add to cache
                        caches.open(staticCacheName).then(function(cache) {
                            cache.put(event.request, response2);
                        });

                        return response;
                    })
                })
            );
        }
        else{

            event.respondWith(
                caches.match(event.request, {ignoreSearch:true}).then(function(response) {
                    if (response) {
                        return response;
                    }
                    return fetch(event.request);
                })
            );
        }
        
    }

    
});