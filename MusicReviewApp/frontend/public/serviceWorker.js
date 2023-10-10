//from lecture

function log(...data) {
  console.log("SWv1.0", ...data);
}

log("SW Script executing");


const STATIC_CACHE_NAME = 'musify-static-v0';

self.addEventListener('install', event => {
  log('install', event);
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then(cache => {
      return cache.addAll([
        '/offline',
        '/api/offline',
        '/static/js/bundle.js',
        '/static/media/bootstrap-icons.b2e5aab643c6f0fd2da6.woff2',
        '/'
      ]);
    })
  );
});

self.addEventListener('activate', event => {
  log('activate', event);
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName.startsWith('musify-') && cacheName != STATIC_CACHE_NAME;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  var requestUrl = new URL(event.request.url);

  // check if request is made by chrome extensions or web page
  // from InSantoshMahto https://github.com/iamshaunjp/pwa-tutorial/issues/1
  // if request is made for web page url must contains http.
  if (!(event.request.url.indexOf('http') === 0)) return; // skip the request. if request is not made with http protocol

  //Treat API calls (to our API) differently
  if(requestUrl.origin === location.origin && requestUrl.pathname.startsWith('/api')) {
    //If we are here, we are intercepting a call to our API
    if(event.request.method === "GET") {
      //Only intercept (and cache) GET API requests
      event.respondWith(
        networkFirst(event.request)
      );
    
    // all not GET's should get redirected to /offline
    } else {
      event.respondWith(
        checkOnline(event.request)
      );
    }
  }
  else {
    //If we are here, this was not a call to our API
    event.respondWith(
      networkFirst(event.request)
    );
  }

});


function networkFirst(request) {
  return fetch(request)
    .then(response => {
      var requestUrl = new URL(request.url);
      //Cache everything except login
      if(response.ok && !requestUrl.pathname.startsWith('/login')) {
        caches.open(STATIC_CACHE_NAME).then((cache) => {
          cache.put(request, response);
        });
      }
      return response.clone();
    })
    .catch(() => {
      return caches.match(request)
        .then(response => {
          //Return a response if we have one cached. Otherwise, fallback to offline page
          return response || caches.match('/api/offline');
        });
    });
}

//for not get's to go to the offline route
function checkOnline(request) {
  return fetch(request)
    .then(response => {
      return response.clone();
    })
    .catch(() => {
      return caches.match('/api/offline');
    });
}

self.addEventListener('message', event => {
  log('message', event.data);
  if(event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
