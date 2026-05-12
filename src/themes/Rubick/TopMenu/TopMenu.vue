<script setup lang="ts">
import '@/assets/css/themes/rubick/top-nav.css'
import { useRoute, useRouter } from 'vue-router'
import logoUrl from '@/assets/images/logo.svg'
import { useMenuStore } from '@/stores/menu'
import { useAuthStore } from '@/stores/auth'
import {
  type ProvideForceActiveMenu,
  forceActiveMenu,
  type Route,
  type FormattedMenu,
  nestedMenu,
  linkTo
} from './top-menu'
import Lucide from '@/components/Base/Lucide'
import Breadcrumb from '@/components/Base/Breadcrumb'
import { Menu } from '@/components/Base/Headless'
import useAuth from '@/core/composables/useAuth'
import { watch, reactive, computed, onMounted, provide, onBeforeUnmount } from 'vue'

const route: Route = useRoute()
const router = useRouter()
let formattedMenu = reactive<Array<FormattedMenu | 'divider'>>([])
const setFormattedMenu = (computedFormattedMenu: Array<FormattedMenu | 'divider'>) => {
  Object.assign(formattedMenu, computedFormattedMenu)
}

const menuStore = useMenuStore()
const authStore = useAuthStore()
const menu = computed(() => nestedMenu(menuStore.menuValue, route))
const userName = computed(() => authStore.user?.name || 'User')
const userEmail = computed(() => authStore.user?.email || '')

provide<ProvideForceActiveMenu>('forceActiveMenu', (pageName: string) => {
  forceActiveMenu(route, pageName)
  setFormattedMenu(menu.value)
})

watch(menu, () => {
  setFormattedMenu(menu.value)
})

watch(
    computed(() => route.path),
    () => {
      delete route.forceActiveMenu
    }
)

onMounted(async () => {
  try {
    await menuStore.fetchMenus()
    setFormattedMenu(menu.value)
  } catch (err) {
    console.error('Failed to load menus:', err)
  }
})

onBeforeUnmount(() => {
  //
})

const { logout } = useAuth()
const handleLogout = async () => {
  try {
    await logout()
    router.push({ name: 'login' })
  } catch (err) {
    console.error('Logout error:', err)
  }
}
</script>

<template>
  <div :class="['rubick px-5 sm:px-8 py-5', 'before:content-[\'\'] before:bg-gradient-to-b before:from-theme-1 before:to-theme-2 dark:before:from-darkmode-800 dark:before:to-darkmode-800 before:fixed before:inset-0 before:z-[-1]']">
    <!-- Top Bar -->
    <div class="border-b border-white/[0.08] mt-[2.2rem] md:-mt-5 -mx-3 sm:-mx-8 px-3 sm:px-8 pt-3 md:pt-0 mb-10">
      <div class="flex items-center h-[70px] z-[51] relative">
        <RouterLink :to="{ name: 'dashboard' }" class="hidden -intro-x md:flex">
          <img alt="Logo" class="w-6" :src="logoUrl" />
          <span class="ml-3 text-lg text-white">Todo Manager</span>
        </RouterLink>
        <Breadcrumb light class="h-full md:ml-10 md:pl-10 md:border-l border-white/[0.08] mr-auto -intro-x">
          <Breadcrumb.Link :to="{ name: 'dashboard' }">Dashboard</Breadcrumb.Link>
        </Breadcrumb>

        <!-- Account Menu -->
        <Menu>
          <Menu.Button class="block w-8 h-8 overflow-hidden scale-110 rounded-full shadow-lg image-fit zoom-in intro-x">
            <div class="w-full h-full bg-white/20 rounded-full flex items-center justify-center text-white font-bold">
              {{ userName.charAt(0).toUpperCase() }}
            </div>
          </Menu.Button>
          <Menu.Items class="w-56 mt-px relative bg-primary/80 before:block before:absolute before:bg-black before:inset-0 before:rounded-md before:z-[-1] text-white">
            <Menu.Header class="font-normal">
              <div class="font-medium">{{ userName }}</div>
              <div class="text-xs text-white/70 mt-0.5">{{ userEmail }}</div>
            </Menu.Header>
            <Menu.Divider class="bg-white/[0.08]" />
            <Menu.Item class="hover:bg-white/5" @click="router.push({ name: 'profile' })">
              <Lucide icon="User" class="w-4 h-4 mr-2" />
              Profile
            </Menu.Item>
            <Menu.Item class="hover:bg-white/5" @click="router.push({ name: 'change-password' })">
              <Lucide icon="Lock" class="w-4 h-4 mr-2" />
              Change Password
            </Menu.Item>
            <Menu.Divider class="bg-white/[0.08]" />
            <Menu.Item class="hover:bg-white/5" @click="handleLogout">
              <Lucide icon="ToggleRight" class="w-4 h-4 mr-2" />
              Logout
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>
    </div>

    <!-- Top Menu Navigation -->
    <nav class="relative z-50 hidden top-nav md:block">
      <ul class="pb-3 xl:pb-0 xl:px-[50px] flex flex-wrap">
        <template v-if="menuStore.isLoading">
          <li class="flex items-center px-5 py-2 text-white/70">
            <Lucide icon="Loader2" class="w-4 h-4 mr-2 animate-spin" />
            Loading menus...
          </li>
        </template>
        <template v-else>
          <li v-for="(menuItem, menuKey) in formattedMenu" :key="menuKey">
            <template v-if="menuItem !== 'divider'">
              <a
                  :href="menuItem.subMenu ? '#' : router.resolve({ name: menuItem.pageName }).fullPath"
                  :class="[menuItem.active ? 'top-menu top-menu--active' : 'top-menu']"
                  @click="(event) => { event.preventDefault(); linkTo(menuItem, router); }"
              >
                <div class="top-menu__icon">
                  <Lucide v-if="menuItem.icon" :icon="menuItem.icon" />
                </div>
                <div class="top-menu__title">
                  {{ menuItem.title }}
                  <Lucide v-if="menuItem.subMenu" class="top-menu__sub-icon" icon="ChevronDown" />
                </div>
              </a>
              <!-- Submenu rendering (sama seperti sebelumnya) -->
            </template>
          </li>
        </template>
      </ul>
    </nav>

    <!-- Content -->
    <div class="rounded-[30px] min-w-0 min-h-screen flex-1 pb-10 bg-slate-100 dark:bg-darkmode-700 px-4 md:px-[22px] max-w-full md:max-w-auto before:content-[''] before:w-full before:h-px before:block">
      <RouterView :key="$route.fullPath" />
    </div>
  </div>
</template>