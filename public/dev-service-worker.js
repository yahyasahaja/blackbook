self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received.')

  const title = 'Push'
  const options = {
    body: 'Yay it works.',
  }

  event.waitUntil(self.registration.showNotification(title, options))
})