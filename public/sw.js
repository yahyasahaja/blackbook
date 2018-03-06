// Set this to true for production
var doCache = self.location.hostname.indexOf('localhost') === -1

// Name our cache
var CACHE_NAME = 'hash-pwa-15'

// // Delete old caches that are not our current one!
// self.addEventListener('activate', event => {
//   event.waitUntil(checkAndDeleteOlderCaches())
// })

// function checkAndDeleteOlderCaches() {
//   const cacheWhitelist = [CACHE_NAME]
//   caches.keys()
//     .then(keyList =>
//       Promise.all(keyList.map(key => {
//         if (!cacheWhitelist.includes(key)) {
//           console.log('Deleting cache: ' + key)
//           return caches.delete(key)
//         }
//       }))
//     )
// }

importScripts('/service-worker.js')
//The first time the user starts up the PWA, 'install' is triggered.
self.addEventListener('install', function (event) {
  if (doCache) event.waitUntil(registerCaches())
})

function registerCaches() {
  return caches.open(CACHE_NAME)
    .then(function (cache) {
      // Get the assets manifest so we can see what our js file is named
      // This is because webpack hashes it
      const urlsToCache = [
        '/static/css/style.css',
        '/manifest.json',
        'https://cdn.materialdesignicons.com/2.1.19/css/materialdesignicons.min.css',
        'https://fonts.googleapis.com/css?family=Raleway:300,400,500,700',
      ]

      cache.addAll(urlsToCache)
      console.log('cached')
    })
}

let routers = ['/home', '/promo', '/disukai', '/chat', '/account']

// When the webpage goes to fetch files, we intercept that request and serve up the matching files
// if we have them
let htmlLocation = new URL('index.html', self.location).toString()
var finalHTMLLocation

if (doCache) 
  finalHTMLLocation = urlsToCacheKeys.get(htmlLocation)
else 
  finalHTMLLocation = htmlLocation

//console.log(htmlLocation, hashedHTMLLocation)
function fetchData(event) {
  let path = new URL(event.request.url).pathname
  if (path.indexOf('/api') !== 0)
    for (let i in routers) if (path.indexOf(routers[i]) === 0) {
      //console.log('DI FETCH', hashedHTMLLocation)
      return caches.match(finalHTMLLocation)
    }

  return caches.match(event.request).then(function (response) {
    //response can be undefined if no cache found
    // if (response) {
    //   console.log('result:', event.request, response)
    //   caches.open(CACHE_NAME)
    //   .then(function (cache) {
    //     cache.keys().then(function(keys) {
    //       console.log('CACHE: ', keys)
    //     })
    //   })
    // }

    //console.log(path, response)
    return response || fetch(event.request)
  }).catch(err => {
    console.log('error', event.request, err)
  })
}

self.addEventListener('fetch', function (event) {
  if (doCache) event.respondWith(fetchData(event))
})

// self.addEventListener('push', function(event) {
//   var payload = event.data ? event.data.text() : 'no payload'
//   event.waitUntil(
//     self.registration.showNotification('New Notification', {
//       body: payload
//     })
//   )
// })

self.addEventListener('push', function (e) {
  var options = {
    body: 'This notification was generated from a push!',
    icon: 'images/example.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2'
    },
    actions: [
      {
        action: 'explore', title: 'Explore this new world',
        icon: 'images/checkmark.png'
      },
      {
        action: 'close', title: 'Close',
        icon: 'images/xmark.png'
      },
    ]
  }
  e.waitUntil(
    self.registration.showNotification('Hello world!', options)
  )
})