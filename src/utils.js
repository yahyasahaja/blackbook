export const matchLoading = (next, current, context) => {
  return next[context].loading === current[context].loading
}

export const matchProps = (next, current, context) => {
  return next[context] === current[context]
}

export const getSubscription = async () => {
  let reg, subscription

  try {
    reg = await navigator.serviceWorker.getRegistration('/sw.js')
    subscription = await reg.pushManager.getSubscription()
  } catch (e) {
    console.log('CAN\'T GET SUBSCRIPTION')
    subscription = null
  }

  return subscription
}

export const convertToMoneyFormat = (num, currency) => {
  let res = num
    .toString()
    .split('')
    .reverse()
    .reduce(function(acc, num, i) {
      return num == '-' ? acc : num + (i && !(i % 3) ? '.' : '') + acc
    }, '')

  return `${currency} ${res}`
}

export default {
  matchLoading,
  matchProps,
  convertToMoneyFormat,
}