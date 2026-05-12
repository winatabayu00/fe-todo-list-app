// JwtService.ts
const COOKIE_NAME = 'session_token'

function setCookie(name: string, value: string, daysOrSeconds?: { days?: number, seconds?: number }, opts: Record<string, any> = {}) {
  // build cookie string safely
  const encode = (v: string) => encodeURIComponent(v)
  let cookieStr = `${name}=${encode(value)}; Path=/;`
  // expiry
  if (daysOrSeconds?.days) {
    const d = new Date()
    d.setTime(d.getTime() + (daysOrSeconds.days * 24 * 60 * 60 * 1000))
    cookieStr += ` Expires=${d.toUTCString()};`
  } else if (daysOrSeconds?.seconds) {
    cookieStr += ` Max-Age=${daysOrSeconds.seconds};`
  }
  // secure & sameSite handling: if running on localhost, we avoid Secure cookie for dev
  const isLocalhost = location.hostname === 'localhost' || location.hostname === '127.0.0.1'
  if (opts.secure || (!isLocalhost && opts.secure !== false)) cookieStr += ' Secure;'
  const sameSite = opts.sameSite ?? 'Lax'
  cookieStr += ` SameSite=${sameSite};`
  if (opts.httpOnly) {
    // NOTE: httpOnly cannot be set via JS. Warn for developer.
    console.warn('httpOnly cookie cannot be set via JavaScript. Use server-set cookie for httpOnly.')
  }
  document.cookie = cookieStr
}

function getCookie(name: string): string | null {
  const match = document.cookie.split('; ').find(row => row.startsWith(name + '='))
  if (!match) return null
  return decodeURIComponent(match.split('=')[1] || '')
}

function deleteCookie(name: string) {
  // set expiry in the past
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`
}

export const getToken = (): string | null => {
  try {
    return getCookie(COOKIE_NAME)
  } catch (e) {
    console.error('JwtService.getToken error', e)
    return null
  }
}

export const saveToken = (token: string, opts?: { expiresSeconds?: number }) => {
  if (!token) return
  // default expiration: 2 hours (7200 seconds) if not provided
  const seconds = opts?.expiresSeconds ?? 7200
  setCookie(COOKIE_NAME, token, { seconds }, { secure: true, sameSite: 'Lax' })
}

export const destroyToken = () => {
  deleteCookie(COOKIE_NAME)
}

export default { getToken, saveToken, destroyToken }
