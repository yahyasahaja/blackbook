"use strict";var precacheConfig=[["/index.html","d6454f40f6c186fa19b119186beee036"],["/static/css/main.e2b34fc5.css","5271d80ce8ead9980e712268f3469b55"],["/static/js/0.58140fb3.chunk.js","1e85314e36471aec51a91ba72865e24b"],["/static/js/1.6a4fdda9.chunk.js","b8b2c6fd4b63682f97f8d9419bde0115"],["/static/js/10.64593508.chunk.js","5484f318fce04f5be2711b6689b4ee3c"],["/static/js/11.0ab2fe47.chunk.js","f9dc0f23a6088d1a198bce06c74fa57d"],["/static/js/12.2ce1d84c.chunk.js","52a070e727dcd873e8202bb8170fdda4"],["/static/js/13.f15c71d1.chunk.js","e94db133a3a4fd9b05ced9f398b26ace"],["/static/js/14.675c58c5.chunk.js","9866c2b30f34bdb2be5c8123db62cb58"],["/static/js/15.3426c4b5.chunk.js","a0f2c9f8005c20a93bebd2b29afa83b7"],["/static/js/16.8463e820.chunk.js","b68d2db35d9d2c7b042d01a8369c448f"],["/static/js/2.95cb4fcb.chunk.js","481d444f85832942877ab3d9d9b9a0d9"],["/static/js/3.9628f116.chunk.js","a7f912ccdfe5d8e2675e43a16791b2ce"],["/static/js/4.d28c1448.chunk.js","dd6cea9ac810c2900336e1ed4dd974bd"],["/static/js/5.fe72e60a.chunk.js","e9069b26f1b3195413110a6792ec868e"],["/static/js/6.b64554bc.chunk.js","7679c4e631f9eeb433d101fd00c42b19"],["/static/js/7.f2b6a370.chunk.js","9fe29a85a2b107ef7f9d3df917e2030c"],["/static/js/8.7334c277.chunk.js","8c595c57d6dd9d9274ba1dfc586a57d6"],["/static/js/9.e988925e.chunk.js","6699df77a4713f91d167f7e007c4b444"],["/static/js/main.f926a835.js","0661be70025a9235a545665a34fd714c"],["/static/media/dress-white.055d26e0.svg","055d26e0c0af1c35478298a561bccd11"],["/static/media/smartphone-white.0076f81d.svg","0076f81df745990f22b1c2a4d9cb9c60"],["/static/media/t-shirt-white.e4bef796.svg","e4bef7966e5f16d65f11383c581ab203"]],cacheName="sw-precache-v3-blanja-hash-cra-v21-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,t){var n=new URL(e);return"/"===n.pathname.slice(-1)&&(n.pathname+=t),n.toString()},cleanResponse=function(t){return t.redirected?("body"in t?Promise.resolve(t.body):t.blob()).then(function(e){return new Response(e,{headers:t.headers,status:t.status,statusText:t.statusText})}):Promise.resolve(t)},createCacheKey=function(e,t,n,a){var c=new URL(e);return a&&c.pathname.match(a)||(c.search+=(c.search?"&":"")+encodeURIComponent(t)+"="+encodeURIComponent(n)),c.toString()},isPathWhitelisted=function(e,t){if(0===e.length)return!0;var n=new URL(t).pathname;return e.some(function(e){return n.match(e)})},stripIgnoredUrlParameters=function(e,n){var t=new URL(e);return t.hash="",t.search=t.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(t){return n.every(function(e){return!e.test(t[0])})}).map(function(e){return e.join("=")}).join("&"),t.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var t=e[0],n=e[1],a=new URL(t,self.location),c=createCacheKey(a,hashParamName,n,/\.\w{8}\./);return[a.toString(),c]}));function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(a){return setOfCachedUrls(a).then(function(n){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(t){if(!n.has(t)){var e=new Request(t,{credentials:"same-origin"});return fetch(e).then(function(e){if(!e.ok)throw new Error("Request for "+t+" returned a response with status "+e.status);return cleanResponse(e).then(function(e){return a.put(t,e)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var n=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(t){return t.keys().then(function(e){return Promise.all(e.map(function(e){if(!n.has(e.url))return t.delete(e)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(t){if("GET"===t.request.method){var e,n=stripIgnoredUrlParameters(t.request.url,ignoreUrlParametersMatching),a="index.html";(e=urlsToCacheKeys.has(n))||(n=addDirectoryIndex(n,a),e=urlsToCacheKeys.has(n));var c="/index.html";!e&&"navigate"===t.request.mode&&isPathWhitelisted(["^(?!\\/__).*"],t.request.url)&&(n=new URL(c,self.location).toString(),e=urlsToCacheKeys.has(n)),e&&t.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(n)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(e){return console.warn('Couldn\'t serve response for "%s" from cache: %O',t.request.url,e),fetch(t.request)}))}});