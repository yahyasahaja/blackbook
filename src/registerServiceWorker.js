// In production, we register a service worker to serve assets from local cache.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on the "N+1" visit to a page, since previously
// cached resources are updated in the background.

// To learn more about the benefits of this model, read https://goo.gl/KwvDNy.
// This link also includes instructions on opting out of this behavior.

import { serviceWorkerUpdate as swu } from './services/stores'
// import moment from 'moment'

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
)

export default function register() {
  if (
    /*process.env.NODE_ENV === 'production' && */ 'serviceWorker' in navigator
  ) {
    // The URL constructor is available in all browsers that support SW.
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location)
    if (publicUrl.origin !== window.location.origin) {
      // Our service worker won't work if PUBLIC_URL is on a different origin
      // from what our page is served on. This might happen if a CDN is used to
      // serve assets see https://github.com/facebookincubator/create-react-app/issues/2374
      return
    }
    if (
      window.onbeforeinstallprompt === null &&
      window.navigator.userAgent.toLowerCase().includes('chrome')
    ) {
      console.log(
        'listening beforeinstallprompt event',
        window.navigator.userAgent
      )
      window.addEventListener('beforeinstallprompt', e => {
        e.preventDefault()
        if (!localStorage.getItem('jualbli-hash-appinstalled')) {
          swu.setPrompt(e)
          e.userChoice.then(choice => {
            if (choice.outcome === 'acepted')
              localStorage.setItem('jualbli-hash-appinstalled', true)
            else {
              localStorage.setItem('jualbli-hash-appinstalled', false)
              swu.setManualGuide(true, true)
            }
          })
        }
      })
    }

    //check for first time visit
    // if (
    //   !/jualbli\.hk/gi.test(window.location.href) &&
    //   window.outerWidth <= 768
    // ) {
    //   if (!localStorage.getItem('jualbli-hash-firstvisit')) {
    //     localStorage.setItem(
    //       'jualbli-hash-firstvisit',
    //       moment()
    //         .add(10, 'minutes')
    //         .unix()
    //     )
    //   } else {
    //     if (window.location.href.includes('open=pwa'))
    //       localStorage.setItem('jualbli-hash-appinstalled', true)
    //     const now = moment().unix()
    //     const first = localStorage.getItem('jualbli-hash-firstvisit')
    //     const show = first <= now
    //     if (!localStorage.getItem('jualbli-hash-appinstalled') && show) {
    //       setTimeout(() => {
    //         swu.setManualGuide(true)
    //       }, 10000)
    //     }
    //   }
    // }

    window.addEventListener('appinstalled', () => {
      localStorage.setItem('jualbli-hash-appinstalled', true)
    })

    window.addEventListener('load', () => {
      const swUrl =
        process.env.NODE_ENV === 'production'
          ? `${process.env.PUBLIC_URL}/service-worker.js`
          : '/sw.js'
      console.log(swUrl)

      if (isLocalhost) {
        // This is running on localhost. Lets check if a service worker still exists or not.
        checkValidServiceWorker(swUrl)

        // Add some additional logging to localhost, pointing developers to the
        // service worker/PWA documentation.
        navigator.serviceWorker.ready.then(() => {
          console.log(
            'This web app is being served cache-first by a service ' +
              'worker. To learn more, visit https://goo.gl/SC7cgQ'
          )
          
        })
        
      } else {
        // Is not local host. Just register service worker
        registerValidSW(swUrl)
      }
    })
  }
}

function registerValidSW(swUrl) {
  console.log('registering service worker')
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
      console.log('successful registration')
      Notification.requestPermission().then(function(result) {
        if (result === 'denied') {
          console.log('Notif permission denied')
          return
        }
        if (result === 'default') {
          console.log('Notif permission dismissed')
          return
        }
        // Do something with the granted permission.
        console.log('Notif allowed')
      })
      registration.onupdatefound = () => {
        console.log('update found')
        const installingWorker = registration.installing
        installingWorker.onstatechange = () => {
          console.log('state changed')
          if (installingWorker.state === 'installed') {
            console.log(navigator.serviceWorker.controller)
            if (navigator.serviceWorker.controller) {
              // At this point, the old content will have been purged and
              // the fresh content will have been added to the cache.
              // It's the perfect time to display a "New content is
              // available please refresh." message in your web app.
              console.log('there is an update, we are reloading')
              swu.update()
            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a
              // "Content is cached for offline use." message.
              console.log('Content is cached for offline use.')
            }
          }
        }
      }
    })
    .catch(error => {
      console.error('Error during service worker registration:', error)
    })

  navigator.serviceWorker.ready.then(registration => {
    let activatingWorker = registration.active
    console.log(registration.active)
    
    if (activatingWorker.state === 'activated') {
      subscribeRegistration(registration)
    } else
      activatingWorker.onstatechange = () => {
        console.log(activatingWorker.state)
        if (activatingWorker.state === 'activated') {
          subscribeRegistration(registration)
        }
      }
  })
}

function subscribeRegistration(/*registration*/) {
  // if (!registration.pushManager) return
  // registration.pushManager.getSubscription().then(async subscription => {
  //   try {
  //     if (!subscription)
  //       subscription = await registration.pushManager.subscribe({
  //         userVisibleOnly: true
  //       })

  //     console.log('FROM SERVICE WORKER REGISTRATION', subscription)
  //     await user.registerPushSubscription(subscription)
  //   } catch (e) {
  //     console.log('ERROR ON REGISTRERING SERVICE WORKER AT THE FIRST TIME', e)
  //   }
  // })
}

function checkValidServiceWorker(swUrl) {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl)
    .then(response => {
      // Ensure service worker exists, and that we really are getting a JS file.
      if (
        response.status === 404 ||
        response.headers.get('content-type').indexOf('javascript') === -1
      ) {
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then(registration => {
          registration.unregister().then(() => {
            // window.location.reload()
          })
        })
      } else {
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl)
      }
    })
    .catch(() => {
      console.log(
        'No internet connection found. App is running in offline mode.'
      )
    })
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister()
    })
  }
}

console.log('CHECK FOR UPDATE')