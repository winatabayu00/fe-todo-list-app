import { defineStore } from 'pinia'
import { ref } from 'vue'
import ApiService from '@/core/services/ApiService'
import JwtService from '@/core/services/JwtService'
import type { IUser } from '@/api/auth/authApiResponse'

export const useAuthStore = defineStore('auth', () => {
  const errors = ref({})
  const user = ref<IUser | null>(null)
  const isAuthenticated = ref(false)

  function loadAuthFromStorage() {
    const token = JwtService.getToken()
    const savedUser = localStorage.getItem('auth_user')
    if (token && savedUser) {
      try {
        user.value = JSON.parse(savedUser)
        isAuthenticated.value = true
        ApiService.setHeader()
      } catch (e) {
        purgeAuth()
      }
    } else {
      purgeAuth()
    }
  }

  function setAuth(authResponse: { user: IUser; token: string }) {
    const token = authResponse.token
    if (!token) {
      setError('Token not found')
      return
    }

    JwtService.saveToken(token, { expiresSeconds: 7200 }) // 2 jam
    user.value = authResponse.user
    isAuthenticated.value = true
    localStorage.setItem('auth_user', JSON.stringify(authResponse.user))
    ApiService.setHeader()
  }

  function setError(error: any) {
    errors.value = { error }
  }

  function purgeAuth() {
    isAuthenticated.value = false
    user.value = null
    errors.value = {}
    JwtService.destroyToken()
    localStorage.removeItem('auth_user')
  }

  function clearConfig() {
    purgeAuth()
  }

  function verifyAuth() {
    const token = JwtService.getToken()
    if (!token) return purgeAuth()
    // Opsional: verifikasi JWT expiration
    try {
      const parts = token.split('.')
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]))
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          return purgeAuth()
        }
      }
      isAuthenticated.value = true
      ApiService.setHeader()
    } catch (e) {
      purgeAuth()
    }
  }

  return {
    errors,
    user,
    isAuthenticated,
    setAuth,
    clearConfig,
    verifyAuth,
    loadAuthFromStorage,
    setError
  }
})