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
    .reduce(function (acc, num, i) {
      return num == '-' ? acc : num + (i && !(i % 3) ? '.' : '') + acc
    }, '')

  return `${currency} ${res}`
}

export const convertStatus = (status) => {
  return status === 'COMPLETE'
    ? 'SELESAI'
    : status === 'UNPAID'
      ? 'BELUM LUNAS'
      : status === 'PAID'
        ? 'SUDAH LUNAS'
        : 'DALAM PROSES'
}

export const convertPaymentStatus = (status) => {
  return status === 'COMPLETE'
    ? 'SELESAI'
    : status === 'UNPAID'
      ? 'BELUM LUNAS'
      : status === 'PAID'
        ? 'SUDAH LUNAS'
        : 'KADALUARSA'
}

export const convertCountryCurrency = country => {
  return country === 'TWN'
    ? 'NTD'
    : country === 'HKG'
      ? 'HKD'
      : 'Rp'
}

export const getQueryString =  variable => {
  var query = window.location.search.substring(1)
  var vars = query.split('&')
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=')
    if (decodeURIComponent(pair[0]) == variable) {
      return decodeURIComponent(pair[1])
    }
  }
}

export default {
  matchLoading,
  matchProps,
  convertToMoneyFormat,
  getSubscription,
  convertStatus,
  convertCountryCurrency,
  getQueryString,
}