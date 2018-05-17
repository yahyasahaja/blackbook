// Set this to true for production
var doCache = self.location.hostname.indexOf('localhost') === -1

importScripts('/service-worker.js')

// Name our cache
var CACHE_NAME = 'build_cache_name' + 'buyer-pwa'
console.log(CACHE_NAME)
// // Delete old caches that are not our current one!
// self.addEventListener('activate', event => {
//   if (doCache)
//     event.waitUntil(checkAndDeleteOlderCaches())
// })

// function checkAndDeleteOlderCaches() {
//   const cacheWhitelist = [CACHE_NAME, cacheName]
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

//The first time the user starts up the PWA, 'install' is triggered.
self.addEventListener('install', function (event) {
  if (doCache) return event.waitUntil(registerCaches())
})

function registerCaches() {
  return caches.open(CACHE_NAME)
    .then(function (cache) {
      // Get the assets manifest so we can see what our js file is named
      // This is because webpack hashes it
      const urlsToCache = [
        '/static/css/style.css',
        '/manifest.json',
      ]

      cache.addAll(urlsToCache)
      console.log('cached')
    })
}

var urlConfig = {
  prod: {
    iam : 'https://api.blanja.tw/iam',
    productql : 'https://api.blanja.tw/productql',
    orderql : 'https://api.blanja.tw/orderql',
    chatql : 'https://api.blanja.tw/chatql',
    userql : 'https://api.blanja.tw/userql',
  },
  dev: {
    productql: 'https://product-hub-testing.azurewebsites.net/graphql',
    orderql : 'https://ordering-service-testing.azurewebsites.net/graphql',
    iam : 'https://iam-message-testing.azurewebsites.net',
    chatql : 'https://iam-message-testing.azurewebsites.net/chatql',
    userql :' https://iam-message-testing.azurewebsites.net/userql',
  }
}

let routers = ['/category', '/product', '/home', '/promo', '/favorite', '/chat', '/account']

// When the webpage goes to fetch files, we intercept that request and serve up the matching files
// if we have them
let htmlLocation = new URL('index.html', self.location).toString()
var finalHTMLLocation

if (doCache)
  finalHTMLLocation = urlsToCacheKeys.get(htmlLocation)
else
  finalHTMLLocation = htmlLocation

//console.log(htmlLocation, hashedHTMLLocation)

var publicPath = [
  '/static',
  '/favicon.ico',
  '/manifest.json',
  '/sw.js',
  '/web.config',
  '/service-worker.js',
  '/asset-manifest.json',
]

function checkRoute(path, router) {
  if (path.indexOf(router) !== 0) return false

  if (path.length > router.length)
    return path[router.length] === '/'

  
  return true
}

function isAPI(url) {
  for (var i in urlConfig) for (var j in urlConfig[i]) if (url === urlConfig[i][j]) {
    console.log(url, ' is public url')
    return true
  }
}

function isPublicPath(path) {
  for (var p of publicPath) if (path.indexOf(p) === 0) {
    console.log(path, ' is public path')
    return true
  }
}

function fetchData(event) {
  let url = event.request.url
  let path = new URL(url).pathname
  return fetch(event.request)
  // if (path.indexOf('/sw.js') === 0 || path.indexOf('/service-worker.js') === 0) return fetch(event.request)

  if (!isAPI(url) && !isPublicPath(path))
    for (let i in routers) if (checkRoute(path, routers[i])) {
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
  if (doCache) return event.respondWith(fetchData(event))
})

// self.addEventListener('push', function(event) {
//   var payload = event.data ? event.data.text() : 'no payload'
//   event.waitUntil(
//     self.registration.showNotification('New Notification', {
//       body: payload
//     })
//   )
// })

self.addEventListener('push', function (event) {
  // var options = {
  //   body: 'This notification was generated from a push!',
  //   icon: 'images/example.png',
  //   vibrate: [100, 50, 100],
  //   data: {
  //     dateOfArrival: Date.now(),
  //     primaryKey: '2'
  //   },
  //   actions: [
  //     {
  //       action: 'explore', title: 'Explore this new world',
  //       icon: 'images/checkmark.png'
  //     },
  //     {
  //       action: 'close', title: 'Close',
  //       icon: 'images/xmark.png'
  //     },
  //   ]
  // }

  //console.log(event)
  let context = {}

  if (event.data) {
    try {
      context = JSON.parse(event.data.text())
    } catch (e) {
      context = { body: event.data.text() }
    }
  }
  console.log('CONTEXT FROM PUSH LISTENER', context)
  ///// broadcast to Window
  if (context.body.includes('pesan') || context.threadId) {
    ///
    this.clients.matchAll({ includeUncontrolled: true }).then(function (allClients) {
      allClients.forEach(function (client) {
        client.postMessage({
          threadId: context.threadId,
          body: context.body
        })
      })
    })
  }
  ///
  const title = context.title || 'Blanja-Commerce'
  const options = {
    body: context.body || 'Pesan baru dari Blanja',
    icon: '/static/img/icons/android-chrome-192x192.png',
    vibrate: [100, 50, 100]
  }

  event.waitUntil(self.registration.showNotification(title, options))
})