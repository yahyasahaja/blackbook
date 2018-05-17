"use strict";
var precacheConfig = [
  ["/index.html", "a423b8e03a5e1edcf18212d666a29e38"],
  ["/static/css/main.12a798b0.css", "cf9b7477dea74f04ca7dc87e5426cc33"],
  ["/static/js/0.64112092.chunk.js", "3af545fd3fa95344c78c9f9db38b2af2"],
  ["/static/js/1.017fb187.chunk.js", "51de31512d877deccbc17dfa1791a17a"],
  ["/static/js/10.4d98a944.chunk.js", "64a88f010f2d956ac560de0116b0cf7b"],
  ["/static/js/11.329c5a5b.chunk.js", "5e2ce783eb8ede69fdcefb8ceaac603e"],
  ["/static/js/12.11b3d488.chunk.js", "19cf3fd07f6710ffe4adf6dc916deae5"],
  ["/static/js/13.f94008b7.chunk.js", "6ac77949bf112a64ab000dc9e88c9452"],
  ["/static/js/14.08a6b741.chunk.js", "8210ce8dc42c7f08191c713e8cdb3728"],
  ["/static/js/15.be4ebd1e.chunk.js", "e66509a590974e016507a4b49ea7a7d4"],
  ["/static/js/16.7d04ab56.chunk.js", "c647bd9198f550966799f7dae5c427be"],
  ["/static/js/2.b2e25a5d.chunk.js", "9cf5391261320cd9d463c2db08d48ed2"],
  ["/static/js/3.f99eb100.chunk.js", "5a824734bc23c81dac15b9a11526570f"],
  ["/static/js/4.2cbd6e6a.chunk.js", "0035ff4ec1143ca63e4ad709d5ff04ca"],
  ["/static/js/5.8fd30a81.chunk.js", "d4b0d6070dbf10dbc7210d94f879785a"],
  ["/static/js/6.67ac9489.chunk.js", "3254059269ac53074aedbf886b3183a6"],
  ["/static/js/7.0168bcfa.chunk.js", "a2c41fd9be8339b88807e327fc5a9338"],
  ["/static/js/8.7228752a.chunk.js", "3668b5dd70ea5ff38459ea21f024c664"],
  ["/static/js/9.10205e83.chunk.js", "cbc077055b8df671830e7dcc07862868"],
  ["/static/js/main.da2dc447.js", "2e56f25e974cf2a9f2631989bc994f56"],
  ["/static/media/dress-white.055d26e0.svg", "055d26e0c0af1c35478298a561bccd11"],
  ["/static/media/smartphone-white.0076f81d.svg", "0076f81df745990f22b1c2a4d9cb9c60"],
  ["/static/media/t-shirt-white.e4bef796.svg", "e4bef7966e5f16d65f11383c581ab203"]
],
  cacheName = "sw-precache-v3-blanja-hash-cra:1526463198736;-" + (self.registration ? self.registration.scope : ""),
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
    var n = new URL(e);
    return c && n.pathname.match(c) || (n.search += (n.search ? "&" : "") + encodeURIComponent(t) + "=" + encodeURIComponent(a)), n.toString()
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
      n = createCacheKey(c, hashParamName, a, /\.\w{8}\./);
    return [c.toString(), n]
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
    var n = "/index.html";
    !e && "navigate" === t.request.mode && isPathWhitelisted(["^(?!\\/__).*"], t.request.url) && (a = new URL(n, self.location).toString(), e = urlsToCacheKeys.has(a)), e && t.respondWith(caches.open(cacheName).then(function (e) {
      return e.match(urlsToCacheKeys.get(a)).then(function (e) {
        if (e) return e;
        throw Error("The cached response that was expected is missing.")
      })
    }).catch(function (e) {
      return console.warn('Couldn\'t serve response for "%s" from cache: %O', t.request.url, e), fetch(t.request)
    }))
  }
});