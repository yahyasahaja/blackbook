"use strict";
var precacheConfig = [
  ["/index.html", "3f4b721a02d0996e782f4d091cb40129"],
  ["/manifest.json", "ce49890b32d1b8c8f51d4c347765113e"],
  ["/static/css/main.12a798b0.css", "cf9b7477dea74f04ca7dc87e5426cc33"],
  ["/static/css/style.css", "63c890b83d2dde91fd30487e57d9ce0f"],
  ["/static/js/0.0e22b03e.chunk.js", "3e4a30531f146fc1e37af428a5820c81"],
  ["/static/js/1.a42f41b6.chunk.js", "bcecd0a1c730582efae36eafb3af311b"],
  ["/static/js/10.4d98a944.chunk.js", "64a88f010f2d956ac560de0116b0cf7b"],
  ["/static/js/11.329c5a5b.chunk.js", "5e2ce783eb8ede69fdcefb8ceaac603e"],
  ["/static/js/12.aa523c36.chunk.js", "3f955062ba4da48a0ac525dc1016a2a6"],
  ["/static/js/13.104a8943.chunk.js", "448b914253a71ebd8796fcd4703028bf"],
  ["/static/js/14.6bf9e6ee.chunk.js", "47f406ca3067c094787d4d62ca92252e"],
  ["/static/js/15.6072b4f0.chunk.js", "3acaf200935f9fee4dca6b18aa51efd3"],
  ["/static/js/16.1d862203.chunk.js", "9ec9f479580f07807f4f03169f80aea5"],
  ["/static/js/2.4341101d.chunk.js", "442ff142f3c12072ef71267a0920b5f3"],
  ["/static/js/3.b9aa2f58.chunk.js", "5e34c7dd73ed9d6e61a107e404f06158"],
  ["/static/js/4.b94592c7.chunk.js", "bdb75c1ab05b576715660689eb591366"],
  ["/static/js/5.bd32af9b.chunk.js", "5d78572d14534df587bd39d3d6580b39"],
  ["/static/js/6.2785cc35.chunk.js", "9aac7598d0684095903c32e0762b4f5b"],
  ["/static/js/7.0168bcfa.chunk.js", "a2c41fd9be8339b88807e327fc5a9338"],
  ["/static/js/8.3daebc75.chunk.js", "3a1045ff8723fe16bc0c6cb6ed32961a"],
  ["/static/js/9.54419d63.chunk.js", "751f622c1af08a42600c96aeb3cc8be7"],
  ["/static/js/main.70ae48af.js", "7cb23fd34ed67d0810ef166b9f0f0383"],
  ["/static/media/dress-white.055d26e0.svg", "055d26e0c0af1c35478298a561bccd11"],
  ["/static/media/smartphone-white.0076f81d.svg", "0076f81df745990f22b1c2a4d9cb9c60"],
  ["/static/media/t-shirt-white.e4bef796.svg", "e4bef7966e5f16d65f11383c581ab203"]
],
  cacheName = "sw-precache-v3-blanja-hash-cra:1526567287889;-" + (self.registration ? self.registration.scope : ""),
  ignoreUrlParametersMatching = [/^utm_/],
  addDirectoryIndex = function (e, t) {
    var a = new URL(e);
    return "/" === a.pathname.slice(-1) && (a.pathname += t), a.toString()
  },
  cleanResponse = function (t) {
    return t.redirected ? ("body" in t ? Promise.resolve(t.body) : t.blob()).then(function (e) {
      return new Response(e, {
        headers: t.headers,
        status: t.status,
        statusText: t.statusText
      })
    }) : Promise.resolve(t)
  },
  createCacheKey = function (e, t, a, c) {
    var s = new URL(e);
    return c && s.pathname.match(c) || (s.search += (s.search ? "&" : "") + encodeURIComponent(t) + "=" + encodeURIComponent(a)), s.toString()
  },
  isPathWhitelisted = function (e, t) {
    if (0 === e.length) return !0;
    var a = new URL(t).pathname;
    return e.some(function (e) {
      return a.match(e)
    })
  },
  stripIgnoredUrlParameters = function (e, a) {
    var t = new URL(e);
    return t.hash = "", t.search = t.search.slice(1).split("&").map(function (e) {
      return e.split("=")
    }).filter(function (t) {
      return a.every(function (e) {
        return !e.test(t[0])
      })
    }).map(function (e) {
      return e.join("=")
    }).join("&"), t.toString()
  },
  hashParamName = "_sw-precache",
  urlsToCacheKeys = new Map(precacheConfig.map(function (e) {
    var t = e[0],
      a = e[1],
      c = new URL(t, self.location),
      s = createCacheKey(c, hashParamName, a, /\.\w{8}\./);
    return [c.toString(), s]
  }));

function setOfCachedUrls(e) {
  return e.keys().then(function (e) {
    return e.map(function (e) {
      return e.url
    })
  }).then(function (e) {
    return new Set(e)
  })
}
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(cacheName).then(function (c) {
    return setOfCachedUrls(c).then(function (a) {
      return Promise.all(Array.from(urlsToCacheKeys.values()).map(function (t) {
        if (!a.has(t)) {
          var e = new Request(t, {
            credentials: "same-origin"
          });
          return fetch(e).then(function (e) {
            if (!e.ok) throw new Error("Request for " + t + " returned a response with status " + e.status);
            return cleanResponse(e).then(function (e) {
              return c.put(t, e)
            })
          })
        }
      }))
    })
  }).then(function () {
    return self.skipWaiting()
  }))
}), self.addEventListener("activate", function (e) {
  var a = new Set(urlsToCacheKeys.values());
  e.waitUntil(caches.open(cacheName).then(function (t) {
    return t.keys().then(function (e) {
      return Promise.all(e.map(function (e) {
        if (!a.has(e.url)) return t.delete(e)
      }))
    })
  }).then(function () {
    return self.clients.claim()
  }))
}), self.addEventListener("fetch", function (t) {
  if ("GET" === t.request.method) {
    var e, a = stripIgnoredUrlParameters(t.request.url, ignoreUrlParametersMatching),
      c = "index.html";
    (e = urlsToCacheKeys.has(a)) || (a = addDirectoryIndex(a, c), e = urlsToCacheKeys.has(a));
    var s = "/index.html";
    !e && "navigate" === t.request.mode && isPathWhitelisted(["^(?!\\/__).*"], t.request.url) && (a = new URL(s, self.location).toString(), e = urlsToCacheKeys.has(a)), e && t.respondWith(caches.open(cacheName).then(function (e) {
      return e.match(urlsToCacheKeys.get(a)).then(function (e) {
        if (e) return e;
        throw Error("The cached response that was expected is missing.")
      })
    }).catch(function (e) {
      return console.warn('Couldn\'t serve response for "%s" from cache: %O', t.request.url, e), fetch(t.request)
    }))
  }
}), importScripts("/sw.js", "/public/sw.js", "/public/sw.js");