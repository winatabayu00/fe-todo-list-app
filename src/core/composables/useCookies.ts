import { ref, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'

import { decodeBase64, encodeBase64 } from '@/core/utils/helper'

export default function useCookie(cookieName: string, options = {}) {
  const defaultOptions = {
    httpOnly: false,
    secure: false,
  }

  const finalOptions = { ...defaultOptions, ...options }

  const cookieData = ref(getCookie())

  function setCookie(value: any, hours = 2) {
    const d = new Date()
    d.setTime(d.getTime() + hours * 60 * 60 * 1000)
    const expires = 'expires=' + d.toUTCString()

    const encodedValue = encodeBase64(JSON.stringify(value))

    document.cookie = `${cookieName}=${encodedValue};${expires};path=/;${
      finalOptions.secure ? 'secure' : ''
    }${finalOptions.httpOnly ? ';httponly' : ''}`
  }

  function getCookie() {
    const name = cookieName + '='
    const decodedCookie = decodeURIComponent(document.cookie)
    const ca = decodedCookie.split(';')

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) == ' ') {
        c = c.substring(1)
      }
      if (c.indexOf(name) == 0) {
        const decodedValue = decodeBase64(c.substring(name.length, c.length))
        return JSON.parse(decodedValue)
      }
    }
    return ''
  }

  function clearCookie() {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
  }

  // On init, fetch any existing cookie data
  getCookie()

  return {
    cookieData,
    setCookie,
    clearCookie,
  }
}
