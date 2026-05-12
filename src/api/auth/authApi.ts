import ApiService from '@/core/services/ApiService'
import publicEndpoint from '@/constants/publicApi'
import type { ILoginCredentials, IRegisterCredentials } from './authApiParams'

const authApi = {
  login(params: ILoginCredentials) {
    return ApiService.post({ resource: publicEndpoint.auth.login, params })
  },
  register(params: IRegisterCredentials) {
    return ApiService.post({ resource: publicEndpoint.auth.register, params })
  },
  logout() {
    return ApiService.post({ resource: publicEndpoint.auth.logout, params: {} })
  },
  me() {
    return ApiService.get({ resource: publicEndpoint.auth.me })
  }
}

export default authApi