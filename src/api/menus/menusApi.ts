import ApiService from '@/core/services/ApiService'
import publicEndpoint from '@/constants/publicApi'
import type { IMenusApiParams } from '@/api/menus/menusApiParams'

const menusApi = {
  getMenus(menu_type: string) {
    const url = publicEndpoint.menus.getMenus.replace(':menusType', menu_type)
    return ApiService.get({ resource: url })
  },
}

export default menusApi
