<template>
  <header class="bg-white dark:bg-darkmode-600 border-b border-gray-200 dark:border-darkmode-400 h-16 px-6 flex items-center justify-between">
    <div class="flex items-center gap-4">
      <!-- Breadcrumb bisa ditambahkan -->
      <h1 class="text-xl font-semibold text-gray-800 dark:text-white">{{ pageTitle }}</h1>
    </div>
    <div class="flex items-center gap-4">
      <!-- Notifications -->
      <Dropdown>
        <Dropdown.Button class="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-darkmode-400">
          <Lucide icon="Bell" class="w-5 h-5" />
          <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Dropdown.Button>
        <Dropdown.Items class="w-80">
          <div class="p-4 border-b">
            <h3 class="font-medium">Notifications</h3>
          </div>
          <div class="max-h-96 overflow-y-auto">
            <Dropdown.Item v-for="notif in notifications" :key="notif.id" class="flex gap-3">
              <Lucide :icon="notif.icon" class="w-5 h-5 text-gray-400" />
              <div>
                <p class="text-sm">{{ notif.message }}</p>
                <span class="text-xs text-gray-400">{{ notif.time }}</span>
              </div>
            </Dropdown.Item>
          </div>
        </Dropdown.Items>
      </Dropdown>

      <!-- User Menu -->
      <Dropdown placement="bottom-end">
        <Dropdown.Button class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm">
            {{ userInitials }}
          </div>
          <Lucide icon="ChevronDown" class="w-4 h-4" />
        </Dropdown.Button>
        <Dropdown.Items class="w-48">
          <Dropdown.Item>Profile</Dropdown.Item>
          <Dropdown.Item>Settings</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>Logout</Dropdown.Item>
        </Dropdown.Items>
      </Dropdown>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Lucide from '@/components/Base/Lucide/Lucide.vue'
import Dropdown from '@/components/Base/Dropdown'

defineProps<{ pageTitle?: string }>()
const userInitials = computed(() => 'JD')
const notifications = ref([
  { id: 1, icon: 'CheckCircle', message: 'Task "Design system" completed', time: '10 min ago' }
])
</script>