import type { AxiosResponse } from 'axios'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { parseColor } from 'tailwindcss/lib/util/color'
import moment from 'moment'
import { useI18n } from 'vue-i18n'
import { ElLoading, ElNotification } from 'element-plus'

dayjs.extend(duration)

const cutText = (text: string, length: number) => {
  if (text.split(' ').length > 1) {
    const string = text.substring(0, length)
    const splitText = string.split(' ')
    splitText.pop()
    return splitText.join(' ') + '...'
  } else {
    return text
  }
}

const formatDate = (date: string, format: string) => {
  return dayjs(date).format(format)
}

const capitalizeFirstLetter = (string: string) => {
  if (string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  } else {
    return ''
  }
}

const onlyNumber = (string: string) => {
  if (string) {
    return string.replace(/\D/g, '')
  } else {
    return ''
  }
}

const formatCurrency = (number: number) => {
  if (number) {
    const formattedNumber = number.toString().replace(/\D/g, '')
    const rest = formattedNumber.length % 3
    let currency = formattedNumber.substr(0, rest)
    const thousand = formattedNumber.substr(rest).match(/\d{3}/g)
    let separator

    if (thousand) {
      separator = rest ? '.' : ''
      currency += separator + thousand.join('.')
    }

    return currency
  } else {
    return ''
  }
}

const timeAgo = (time: string) => {
  const date = new Date((time || '').replace(/-/g, '/').replace(/[TZ]/g, ' '))
  const diff = (new Date().getTime() - date.getTime()) / 1000
  const dayDiff = Math.floor(diff / 86400)

  if (isNaN(dayDiff) || dayDiff < 0 || dayDiff >= 31) {
    return dayjs(time).format('MMMM DD, YYYY')
  }

  return (
    (dayDiff === 0 &&
      ((diff < 60 && 'just now') ||
        (diff < 120 && '1 minute ago') ||
        (diff < 3600 && Math.floor(diff / 60) + ' minutes ago') ||
        (diff < 7200 && '1 hour ago') ||
        (diff < 86400 && Math.floor(diff / 3600) + ' hours ago'))) ||
    (dayDiff === 1 && 'Yesterday') ||
    (dayDiff < 7 && dayDiff + ' days ago') ||
    (dayDiff < 31 && Math.ceil(dayDiff / 7) + ' weeks ago')
  )
}

const diffTimeByNow = (time: string) => {
  const startDate = dayjs(dayjs().format('YYYY-MM-DD HH:mm:ss').toString())
  const endDate = dayjs(dayjs(time).format('YYYY-MM-DD HH:mm:ss').toString())

  const duration = dayjs.duration(endDate.diff(startDate))
  const milliseconds = Math.floor(duration.asMilliseconds())

  const days = Math.round(milliseconds / 86400000)
  const hours = Math.round((milliseconds % 86400000) / 3600000)
  let minutes = Math.round(((milliseconds % 86400000) % 3600000) / 60000)
  const seconds = Math.round(
    (((milliseconds % 86400000) % 3600000) % 60000) / 1000
  )

  if (seconds < 30 && seconds >= 0) {
    minutes += 1
  }

  return {
    days: days.toString().length < 2 ? '0' + days : days,
    hours: hours.toString().length < 2 ? '0' + hours : hours,
    minutes: minutes.toString().length < 2 ? '0' + minutes : minutes,
    seconds: seconds.toString().length < 2 ? '0' + seconds : seconds
  }
}

const isset = (obj: object | string) => {
  if (obj !== null && obj !== undefined) {
    if (typeof obj === 'object' || Array.isArray(obj)) {
      return Object.keys(obj).length
    } else {
      return obj.toString().length
    }
  }

  return false
}

const toRaw = (obj: object) => {
  return JSON.parse(JSON.stringify(obj))
}

const randomNumbers = (from: number, to: number, length: number) => {
  const numbers = [0]
  for (let i = 1; i < length; i++) {
    numbers.push(Math.ceil(Math.random() * (from - to) + to))
  }

  return numbers
}

const toRGB = (value: string) => {
  return parseColor(value).color.join(' ')
}

const stringToHTML = (arg: string) => {
  const parser = new DOMParser(),
    DOM = parser.parseFromString(arg, 'text/html')
  return DOM.body.childNodes[0] as HTMLElement
}

const slideUp = (
  el: HTMLElement,
  duration = 300,
  callback = (el: HTMLElement) => {
  }
) => {
  el.style.transitionProperty = 'height, margin, padding'
  el.style.transitionDuration = duration + 'ms'
  el.style.height = el.offsetHeight + 'px'
  el.offsetHeight
  el.style.overflow = 'hidden'
  el.style.height = '0'
  el.style.paddingTop = '0'
  el.style.paddingBottom = '0'
  el.style.marginTop = '0'
  el.style.marginBottom = '0'
  window.setTimeout(() => {
    el.style.display = 'none'
    el.style.removeProperty('height')
    el.style.removeProperty('padding-top')
    el.style.removeProperty('padding-bottom')
    el.style.removeProperty('margin-top')
    el.style.removeProperty('margin-bottom')
    el.style.removeProperty('overflow')
    el.style.removeProperty('transition-duration')
    el.style.removeProperty('transition-property')
    callback(el)
  }, duration)
}

const slideDown = (
  el: HTMLElement,
  duration = 300,
  callback = (el: HTMLElement) => {
  }
) => {
  el.style.removeProperty('display')
  let display = window.getComputedStyle(el).display
  if (display === 'none') display = 'block'
  el.style.display = display
  let height = el.offsetHeight
  el.style.overflow = 'hidden'
  el.style.height = '0'
  el.style.paddingTop = '0'
  el.style.paddingBottom = '0'
  el.style.marginTop = '0'
  el.style.marginBottom = '0'
  el.offsetHeight
  el.style.transitionProperty = 'height, margin, padding'
  el.style.transitionDuration = duration + 'ms'
  el.style.height = height + 'px'
  el.style.removeProperty('padding-top')
  el.style.removeProperty('padding-bottom')
  el.style.removeProperty('margin-top')
  el.style.removeProperty('margin-bottom')
  window.setTimeout(() => {
    el.style.removeProperty('height')
    el.style.removeProperty('overflow')
    el.style.removeProperty('transition-duration')
    el.style.removeProperty('transition-property')
    callback(el)
  }, duration)
}

export {
  cutText,
  formatDate,
  capitalizeFirstLetter,
  onlyNumber,
  formatCurrency,
  timeAgo,
  diffTimeByNow,
  isset,
  toRaw,
  randomNumbers,
  toRGB,
  stringToHTML,
  slideUp,
  slideDown
}


export function formattedDate(date: any): string {
  return moment(date).format('DD MMMM YYYY')  // ex: 30 June 2023
}

export function formattedDate2(date: any): string {
  return moment(date).format('DD-MM-YYYY')  // ex: 30-07-2023
}

export function formattedDate3(date: any): string {
  return moment(date).format('MM YYYY')  // ex: 07-2023
}

export function formattedDate4(date: any): string {
  return moment(date).format('YYYY')  // ex: 2023
}

export function formattedDate5(date: any): string {
  return moment(date).format('MMMM YYYY')  // ex: June 2023
}

export function formattedDate6(date: any): string {
  return moment(date).format('dddd, DD MMMM YYYY')  // ex: June 2023
}

export function formattedDateTime(date: any): string {
  return moment(date).format('DD MMMM YYYY HH:mm:ss')  // ex: 07 Juli 2023 16:10:11
}

export function formattedTime(date: any): string {
  return moment(date).format('HH:mm:ss')  // ex: 16:10:11
}

export function formattedUTCDate(date: Date): string {
  return moment.utc(date).format()
}

export function isActiveText(isActive: boolean): string {
  const { t } = useI18n()
  return isActive ? t('generalLang.active') : t('generalLang.notActive')
}

export function idSplitter(params: string): string {
  return params.toUpperCase().split('-')[0]
}

export function orderFormat(params: string | null): string {
  return params === 'ascending' || params == null ? 'asc' : 'desc'
}

export function toTitleCase(params: string): string {
  return params.toLowerCase().replace(/(?:^|\s)\w/g, (match) => match.toUpperCase())
}

export const numberFormat = (
  number: string | number,
  decimals = 0,
  decPoint = ',',
  thousandSep = '.'
): string => {
  number = (number + '').replace(/[^0-9+\-Ee.]/g, '')
  const n = !isFinite(+number) ? 0 : +number
  const prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
  const sep = typeof thousandSep === 'undefined' ? ',' : thousandSep
  const dec = typeof decPoint === 'undefined' ? '.' : decPoint
  let s: string[] = ['']

  const toFixedFix = (n: number, prec: number) => {
    const k = 10 ** prec
    return '' + Math.round(n * k) / k
  }

  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || ''
    s[1] += new Array(prec - s[1].length + 1).join('0')
  }

  return s.join(dec)
}

export const formatRp = (number: number, withRp = true): string => {
  return (withRp ? 'Rp. ' : '') + numberFormat(number)
}

export const isEmailValid = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('email is required'))
  } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
    callback(new Error('email is not valid'))
  }
  callback()
}

export const NumbersOnly = (char: KeyboardEvent): boolean => {
  const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab']
  const isValid = /^\d$/.test(char.key) || allowedKeys.includes(char.key)
  if (!isValid) char.preventDefault()
  return isValid
}

export const SpellingMoney = (number: number): string => {
  const terbilang1to19 = [
    '', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan',
    'sepuluh', 'sebelas', 'dua belas', 'tiga belas', 'empat belas', 'lima belas', 'enam belas',
    'tujuh belas', 'delapan belas', 'sembilan belas'
  ]

  const terbilangRibuan = ['', 'ribu', 'juta', 'miliar', 'triliun']

  function terbilangSatuan(ratusan: number): string {
    let terbilang = ''
    if (ratusan >= 100) {
      terbilang += terbilang1to19[Math.floor(ratusan / 100)] + ' ratus '
      ratusan %= 100
    }
    if (ratusan >= 20) {
      terbilang += terbilang1to19[Math.floor(ratusan / 10)] + ' puluh '
      ratusan %= 10
    }
    if (ratusan > 0) {
      if (ratusan < 10 && terbilang) terbilang += 'se'
      terbilang += terbilang1to19[ratusan]
    }
    return terbilang
  }

  let terbilangTotal = ''
  let index = 0
  while (number > 0) {
    const ribuan = number % 1000
    if (ribuan > 0) {
      const terbilangRatusan = terbilangSatuan(ribuan)
      terbilangTotal = terbilangRatusan + ' ' + terbilangRibuan[index] + ' ' + terbilangTotal
    }
    number = Math.floor(number / 1000)
    index++
  }
  return terbilangTotal || 'nol'
}

export function calculateTimeDifference(startDate: string | Date): string | null {
  let startDateObj: Date
  if (startDate instanceof Date) {
    startDateObj = startDate
  } else if (typeof startDate === 'string') {
    startDateObj = new Date(startDate)
  } else {
    console.error('Invalid startDate. Please provide a valid Date object or a string representing a valid date.')
    return null
  }

  if (isNaN(startDateObj.getTime())) {
    console.error('Invalid startDate. Please provide a valid Date object or a string representing a valid date.')
    return null
  }

  const currentDate = new Date()
  const timeDifferenceInMilliseconds = currentDate.getTime() - startDateObj.getTime()

  const minutesDifference = Math.floor(timeDifferenceInMilliseconds / (1000 * 60))
  const hoursDifference = Math.floor(timeDifferenceInMilliseconds / (1000 * 60 * 60))
  const daysDifference = Math.floor(timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24))

  if (minutesDifference < 60) {
    return `${minutesDifference} mins ago`
  }

  if (hoursDifference % 24 < 24) {
    return `${hoursDifference % 24} hours ago`
  } else {
    return `${Math.floor(daysDifference)} days ago`
  }
}

// Auto translate any text based on i18n config
export function translate(text: string): string {
  const { t, te } = useI18n()
  return te(text) ? t(text) : text
}

export const saveStoreApplication = (title: string, data: any) => {
  const encodedData = encodeBase64(JSON.stringify(data))
  window.localStorage.setItem(title, encodedData)
}

export const getStoreApplication = (title: string): any => {
  const data = window.localStorage.getItem(title)
  if (data) {
    return JSON.parse(decodeBase64(data))
  }
  return null
}

export function encodeBase64(text: any): string {
  return btoa(encodeURIComponent(text))
}

export function decodeBase64(text: any): string {
  return decodeURIComponent(atob(text))
}

export function onDownload(url: string, label: string): void {
  const link = document.createElement('a')
  link.href = url
  link.target = '_blank'
  link.download = label
  link.click()
}

// Pick first letter of a word
export function extractInitials(name: string, wordCount: number = 2): string {
  const words = name.split(' ').slice(0, wordCount)
  return words.map((word) => word[0]).join('').toUpperCase()
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function convertToUTC(date: string | Date): string {
  return new Date(date).toISOString()
}

export function requestSuccess(req: any) {
  ElNotification({
    title: req.rc,
    message: req.message,
    type: 'success',
    duration: 10000
  })
}

export function requestFailed(error: any) {
  const responseData = error.response?.data || error.response || {}
  const title = responseData.rc || 'Error'
  const message = responseData.message || error.message || 'An error occurred'
  
  ElNotification({
    title: title,
    message: message,
    type: 'error',
    duration: 10000
  })
}
