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
  // max 2 decimal point
  num = Math.round(num * 100) / 100

  let precision = null

  let loc1 = (num + '').split('.')
  if (loc1.length === 2) {
    precision = loc1[1]
  }

  num = loc1[0]
  let res = num
    .split('')
    .reverse()
    .reduce(function (acc, num, i) {
      return num == '-' ? acc : num + (i && !(i % 3) ? ',' : '') + acc
    }, '')

  return `${currency ? currency : ''} ${res}${precision !== null ? `.${precision}` : ''}`
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
      : 'RP'
}

export const convertCountryCodeToText = code => {
  return code === 'TWN'
    ? 'Taiwan'
    : code === 'HKG'
      ? 'Hong Kong'
      : 'Indonesia' 
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

export const limitString = (str, limit) => {
  return str.slice(0, limit) + (str.length < limit ? '' : '...')
}

export default {
  matchLoading,
  matchProps,
  convertToMoneyFormat,
  getSubscription,
  convertStatus,
  convertCountryCurrency,
  getQueryString,
  limitString,
}