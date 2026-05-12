<template>
  <aside
      :class="[
      'fixed lg:relative z-30 transition-all duration-300',
      isCollapsed ? 'w-20' : 'w-64'
    ]"
      class="h-screen bg-white dark:bg-darkmode-600 border-r border-gray-200 dark:border-darkmode-400"
  >
    <div class="flex flex-col h-full">
      <!-- Logo & Collapse Toggle -->
      <div class="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-darkmode-400">
        <div v-if="!isCollapsed" class="flex items-center gap-2">
          <img src="/logo.svg" class="w-6 h-6" alt="Logo" />
          <span class="text-lg font-bold text-gray-800 dark:text-white">TodoApp</span>
        </div>
        <button @click="toggleCollapse" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-darkmode-400">
          <Lucide :icon="isCollapsed ? 'Menu' : 'PanelLeftClose'" class="w-5 h-5" />
        </button>
      </div>

      <!-- Workspace Switcher -->
      <div class="p-3 border-b border-gray-200 dark:border-darkmode-400">
        <Dropdown v-if="!isCollapsed">
          <Dropdown.Button class="flex items-center justify-between w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-darkmode-400">
            <span class="text-sm font-medium truncate">{{ currentWorkspace?.name || 'Select Workspace' }}</span>
            <Lucide icon="ChevronDown" class="w-4 h-4" />
          </Dropdown.Button>
          <Dropdown.Items>
            <Dropdown.Item v-for="ws in workspaces" :key="ws.id" @click="selectWorkspace(ws)">
              {{ ws.name }}
            </Dropdown.Item>
          </Dropdown.Items>
        </Dropdown>
        <div v-else class="text-center">
          <span class="text-xs font-medium">{{ currentWorkspace?.name?.charAt(0) }}</span>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 py-4 overflow-y-auto">
        <ul class="space-y-1">
          <li v-for="item in navItems" :key="item.name">
            <RouterLink
                :to="item.path"
                class="flex items-center px-4 py-2 mx-2 rounded-lg transition-colors"
                :class="[
                $route.path === item.path
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-darkmode-400'
              ]"
            >
              <Lucide :icon="item.icon" class="w-5 h-5 flex-shrink-0" />
              <span v-if="!isCollapsed" class="ml-3">{{ item.name }}</span>
            </RouterLink>
          </li>
        </ul>
      </nav>

      <!-- User Profile (Bottom) -->
      <div class="p-4 border-t border-gray-200 dark:border-darkmode-400">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-semibold">
            {{ userInitials }}
          </div>
          <div v-if="!isCollapsed" class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-800 dark:text-white truncate">John Doe</p>
            <p class="text-xs text-gray-500 truncate">john@example.com</p>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import Lucide from '@/components/Base/Lucide/Lucide.vue'
import Dropdown from '@/components/Base/Dropdown'

const route = useRoute()
const isCollapsed = ref(false)
const toggleCollapse = () => (isCollapsed.value = !isCollapsed.value)

const currentWorkspace = ref({ id: 'ws1', name: 'Acme Corp' })
const workspaces = ref([
  { id: 'ws1', name: 'Acme Corp' },
  { id: 'ws2', name: 'Startup Inc' }
])
const selectWorkspace = (ws: any) => (currentWorkspace.value = ws)

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
  { name: 'Kanban', path: '/kanban', icon: 'Kanban' },
  { name: 'Calendar', path: '/calendar', icon: 'Calendar' },
  { name: 'Team', path: '/team', icon: 'Users' },
  { name: 'Workspaces', path: '/workspaces', icon: 'Grid3x3' }
]

const userInitials = computed(() => 'JD')
</script>