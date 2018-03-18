export const matchLoading = (next, current, context) => {
  return next[context].loading === current[context].loading
}

export const matchProps = (next, current, context) => {
  return next[context] === current[context]
}

export const getSubscription = () => {
  return navigator.serviceWorker.getRegistration('/service-worker.js')
    .then(reg => reg.pushManager.getSubscription())
}

export default {
  matchLoading,
  matchProps, 
}

navigator.serviceWorker.getRegistration('/service-worker.js')
  .then(reg => {
    reg.pushManager.getSubscription()
    reg.getNotifications()
  })