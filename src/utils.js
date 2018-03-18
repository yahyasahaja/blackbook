export const matchLoading = (next, current, context) => {
  return next[context].loading === current[context].loading
}

export const matchProps = (next, current, context) => {
  return next[context] === current[context]
}

export const getSubscription = () => {
  return navigator.serviceWorker.getRegistration('/sw.js')
    .then(reg => reg.pushManager.getSubscription())
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