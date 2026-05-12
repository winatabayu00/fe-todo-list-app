import { ref } from 'vue'
import type { IMenu } from '@/api/menus/menusApiResponse'
import type { ApiError } from '@/core/types/api'
import { useMenuStore } from '@/stores/menu'

export default function useMenus() {
  const menuStore = useMenuStore()

  const menuResponse = ref(menuStore.menuValue)
  const isLoading = ref(menuStore.isLoading)
  const error = ref(menuStore.error)

  const fetchMenus = async (): Promise<void> => {
    await menuStore.fetchMenus()
  }

  return {
    menuResponse,
    error,
    isLoading,
    fetchMenus
  }
}