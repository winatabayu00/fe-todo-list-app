import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios, { type AxiosInstance } from 'axios'
import type { App } from 'vue'
import VueAxios from 'vue-axios'
import { useAuthStore } from '@/stores/auth'
import { requestFailed } from '@/core/utils/helper'
import {Prefix, type PrefixApi} from '@/core/types/prefix-api'
import JwtService from '@/core/services/JwtService'
import EventBus from '@/core/services/EventBus'
import router from '@/router/index'

// Interface untuk response wrapper API
export interface ApiResponse<T = any> {
  rc: string
  message: string
  timestamp: string
  payload: T
}

interface ApiRequestOptions {
  resource: string
  slug?: string
  params?: any
  prefixApi?: PrefixApi
  options?: AxiosRequestConfig
}

interface BaseApiConfig {
  baseURL: string
  headers: Record<string, string>
}

class ApiService {
  private static vueInstance: App
  private static controllers: Map<string, AbortController> = new Map()
  private static axiosInstance: AxiosInstance

  public static init(app: App<Element>): void {
    ApiService.vueInstance = app
    ApiService.setupAxiosInstance()
    ApiService.vueInstance.use(VueAxios, ApiService.axiosInstance)
    ApiService.setupInterceptors()
    ApiService.setupRouteChangeHandler()
  }

  private static setupAxiosInstance(): void {
    ApiService.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_APP_API_URL || '',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Platform': 'web'
      },
      timeout: 30000
    })
  }

  private static getConfig(prefixApi: PrefixApi): BaseApiConfig {
    const token = JwtService.getToken()
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Platform': 'web'
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    // baseURL tetap dari env, karena prefixApi tidak mempengaruhi baseURL
    return {
      baseURL: import.meta.env.VITE_APP_API_URL || '',
      headers
    }
  }

  private static prepareRequest(
      resource: string,
      prefixApi: PrefixApi = Prefix.public,
      options?: AxiosRequestConfig
  ): AxiosRequestConfig {
    const config = ApiService.getConfig(prefixApi)
    const controller = new AbortController()
    const requestId = `${resource}-${Date.now()}`

    ApiService.controllers.set(requestId, controller)

    return {
      baseURL: config.baseURL,
      headers: config.headers,
      signal: controller.signal,
      ...options
    }
  }

  private static handleResponse<T>(response: AxiosResponse<ApiResponse<T>>): ApiResponse<T> {
    if (!response.data || typeof response.data !== 'object') {
      throw new Error('Invalid API response format')
    }

    if (response.data.rc !== 'SUCCESS') {
      throw {
        message: response.data.message,
        code: response.data.rc,
        data: response.data.payload,
        response
      }
    }

    return response.data
  }

  // HTTP GET request dengan query params
  public static async get<T = any>({
                                     resource,
                                     slug = '',
                                     params = {},
                                     prefixApi = Prefix.public
                                   }: ApiRequestOptions): Promise<ApiResponse<T>> {
    const url = slug ? `${resource}/${slug}` : resource
    const config = ApiService.prepareRequest(resource, prefixApi, {
      params: params
    })

    try {
      const response = await ApiService.axiosInstance.get<ApiResponse<T>>(url, config)
      return ApiService.handleResponse(response)
    } catch (error) {
      throw ApiService.handleError(error)
    }
  }

  // HTTP POST request
  public static async post<T = any>({
                                      resource,
                                      params,
                                      prefixApi = Prefix.public,
                                      options = {}
                                    }: ApiRequestOptions): Promise<ApiResponse<T>> {
    const config = ApiService.prepareRequest(resource, prefixApi, options)

    try {
      const response = await ApiService.axiosInstance.post<ApiResponse<T>>(resource, params, config)
      return ApiService.handleResponse(response)
    } catch (error) {
      throw ApiService.handleError(error)
    }
  }

  // HTTP PUT request
  public static async put<T = any>({
                                     resource,
                                     params,
                                     prefixApi = Prefix.public
                                   }: Omit<ApiRequestOptions, 'slug'>): Promise<ApiResponse<T>> {
    const config = ApiService.prepareRequest(resource, prefixApi)

    try {
      const response = await ApiService.axiosInstance.put<ApiResponse<T>>(resource, params, config)
      return ApiService.handleResponse(response)
    } catch (error) {
      throw ApiService.handleError(error)
    }
  }

  // HTTP PATCH request
  public static async patch<T = any>({
                                       resource,
                                       params,
                                       prefixApi = Prefix.public
                                     }: Omit<ApiRequestOptions, 'slug'>): Promise<ApiResponse<T>> {
    const config = ApiService.prepareRequest(resource, prefixApi)

    try {
      const response = await ApiService.axiosInstance.patch<ApiResponse<T>>(resource, params, config)
      return ApiService.handleResponse(response)
    } catch (error) {
      throw ApiService.handleError(error)
    }
  }

  // HTTP DELETE request
  public static async delete<T = any>({
                                        resource,
                                        params,
                                        prefixApi = Prefix.public
                                      }: Omit<ApiRequestOptions, 'slug'>): Promise<ApiResponse<T>> {
    const config = ApiService.prepareRequest(resource, prefixApi)

    try {
      const response = await ApiService.axiosInstance.delete<ApiResponse<T>>(resource, {
        data: params,
        ...config
      })
      return ApiService.handleResponse(response)
    } catch (error) {
      throw ApiService.handleError(error)
    }
  }

  public static deleteBatch = ApiService.delete

  public static cancelRequest(requestId: string): void {
    const controller = ApiService.controllers.get(requestId)
    if (controller) {
      controller.abort()
      ApiService.controllers.delete(requestId)
    }
  }

  public static cancelAllRequests(): void {
    ApiService.controllers.forEach(controller => controller.abort())
    ApiService.controllers.clear()
  }

  private static setupRouteChangeHandler(): void {
    router.beforeEach(() => {
      // ApiService.cancelAllRequests()
    })
  }

  public static setHeader(): void {
    const token = JwtService.getToken()
    if (token) {
      ApiService.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete ApiService.axiosInstance.defaults.headers.common['Authorization']
    }
  }

  private static setupInterceptors(): void {
    ApiService.axiosInstance.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
          const token = JwtService.getToken()
          if (token) {
            config.headers.Authorization = `Bearer ${token}`
          }
          return config
        },
        (error) => Promise.reject(error)
    )

    ApiService.axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
          if (axios.isCancel(error)) {
            return Promise.reject(new Error('Request canceled'))
          }
          ApiService.handleErrorResponse(error)
          return Promise.reject(error)
        }
    )
  }

  private static handleErrorResponse(error: any): void {
    const status = error.response?.status
    const store = useAuthStore()

    switch (status) {
      case 401:
        if (router.currentRoute.value.name !== 'login') {
          store.clearConfig()
          router.replace({ name: 'login' })
        }
        break
      case 403:
        if (error.response.data?.rc === 'ERR_USING_DEFAULT_PASSWORD') {
          EventBus.emit('need-update-password', null)
        } else {
          router.replace({ name: '403' })
        }
        break
      case 500:
      case 503:
        router.replace({ name: '500' })
        break
      default:
        if (status >= 400 && status < 600) {
          requestFailed(error)
        }
    }
  }

  private static handleError(error: any): never {
    ApiService.handleErrorResponse(error)
    throw error
  }

  public static async request<T = any>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await ApiService.axiosInstance.request<ApiResponse<T>>(config)
      return ApiService.handleResponse(response)
    } catch (error) {
      throw ApiService.handleError(error)
    }
  }

  // Helper method untuk mendapatkan data payload langsung
  public static async getPayload<T = any>(options: ApiRequestOptions): Promise<T> {
    const response = await ApiService.get<T>(options)
    return response.payload
  }

  public static async postPayload<T = any>(options: ApiRequestOptions): Promise<T> {
    const response = await ApiService.post<T>(options)
    return response.payload
  }

  public static async putPayload<T = any>(options: Omit<ApiRequestOptions, 'slug'>): Promise<T> {
    const response = await ApiService.put<T>(options)
    return response.payload
  }

  public static async deletePayload<T = any>(options: Omit<ApiRequestOptions, 'slug'>): Promise<T> {
    const response = await ApiService.delete<T>(options)
    return response.payload
  }
}

export default ApiService