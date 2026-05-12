import { ref } from 'vue'
import type { ILoginCredentials, IRegisterCredentials } from '@/api/auth/authApiParams'
import type { ILoginApiResponse, IRegisterApiResponse } from '@/api/auth/authApiResponse'
import { useAuthStore } from '@/stores/auth'
import authApi from '@/api/auth/authApi'
import { requestSuccess } from '@/core/utils/helper'

export default function useAuth() {
  const authStore = useAuthStore()
  const loginResponse = ref<ILoginApiResponse>()
  const registerResponse = ref<IRegisterApiResponse>()
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const validationErrors = ref<Record<string, string[]>>({})

  const clearError = () => {
    error.value = null
    validationErrors.value = {}
  }

  const login = async (credentials: ILoginCredentials): Promise<void> => {
    isLoading.value = true
    error.value = null
    validationErrors.value = {}

    try {
      const response = await authApi.login(credentials)
      const payload = response.payload as ILoginApiResponse

      loginResponse.value = payload
      authStore.setAuth(payload)

      requestSuccess({ rc: 'SUCCESS', message: 'Login successful' })
    } catch (err: any) {
      const data = err.response?.data
      if (data?.rc === 'ERR_VALIDATION' && data.payload) {
        const payloadErrors = data.payload as Record<string, string[]>
        validationErrors.value = payloadErrors
        const firstErrorArray = Object.values(payloadErrors)[0]
        const firstError = Array.isArray(firstErrorArray) ? firstErrorArray[0] : undefined
        error.value = firstError || data.message || 'Login failed'
      } else {
        error.value = data?.message || err.message || 'Login failed'
      }
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const register = async (credentials: IRegisterCredentials): Promise<void> => {
    isLoading.value = true
    error.value = null
    validationErrors.value = {}

    try {
      const response = await authApi.register(credentials)
      const payload = response.payload as IRegisterApiResponse
      registerResponse.value = payload
      authStore.setAuth(payload)
      requestSuccess({ rc: 'SUCCESS', message: 'Registration successful' })
    } catch (err: any) {
      const data = err.response?.data
      if (data?.rc === 'ERR_VALIDATION' && data.payload) {
        const payloadErrors = data.payload as Record<string, string[]>
        validationErrors.value = payloadErrors
        const firstErrorArray = Object.values(payloadErrors)[0]
        const firstError = Array.isArray(firstErrorArray) ? firstErrorArray[0] : undefined
        error.value = firstError || data.message || 'Registration failed'
      } else {
        error.value = data?.message || err.message || 'Registration failed'
      }
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = async (): Promise<void> => {
    isLoading.value = true
    error.value = null
    try {
      await authApi.logout()
      authStore.clearConfig()
      requestSuccess({ rc: 'SUCCESS', message: 'Logged out' })
    } catch (err: any) {
      error.value = err.message || 'Logout failed'
    } finally {
      isLoading.value = false
    }
  }

  const isAuthenticated = (): boolean => {
    return authStore.isAuthenticated
  }

  const getUser = () => authStore.user

  return {
    loginResponse,
    registerResponse,
    isLoading,
    error,
    validationErrors,
    login,
    register,
    logout,
    clearError,
    isAuthenticated,
    getUser,
  }
}