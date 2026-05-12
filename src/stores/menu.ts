import { type Icon } from '@/components/Base/Lucide/Lucide.vue'
import { type Themes } from '@/stores/theme'
import { defineStore } from 'pinia'
import sideMenu from '@/main/side-menu'
import topMenu from '@/main/top-menu'

export interface Menu {
  id?: string;
  icon?: Icon | null;
  title: string;
  pageName?: string;
  subMenu?: Menu[];
  ignore?: boolean;
  route?: string;
}

export interface MenuState {
  menuValue: Array<Menu | 'divider'>;
  isLoading: boolean;
  error: string | null;
}

export const useMenuStore = defineStore('menu', {
  state: (): MenuState => ({
    menuValue: [],
    isLoading: false,
    error: null
  }),

  getters: {
    menu: (state) => (layout: Themes['layout']) => {
      if (state.menuValue.length > 0) return state.menuValue

      switch (layout) {
        case 'top-menu': return topMenu
        default: return sideMenu
      }
    },

    hasMenus: (state) => state.menuValue.length > 0,
  },

  actions: {
    /**
     * Load static menus (no API call)
     */
    async fetchMenus(): Promise<void> {
      this.isLoading = true
      this.error = null

      try {
        // You can determine layout from user preference or default to 'top-menu'
        const layout = 'top-menu' // or get from localStorage/user settings
        this.menuValue = layout === 'top-menu' ? topMenu : sideMenu
      } catch (err: any) {
        this.error = err.message || 'Failed to load menus'
        console.error('Error loading menus:', err)
        this.menuValue = sideMenu // fallback
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Clear fetched menus
     */
    clearMenus(): void {
      this.menuValue = []
      this.error = null
    },

    /**
     * Refresh menus (reload static)
     */
    async refreshMenus(): Promise<void> {
      this.clearMenus()
      await this.fetchMenus()
    }
  }
})