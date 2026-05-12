<template>
  <div class="bg-white dark:bg-darkmode-600 rounded-xl border border-gray-200 p-5">
    <h3 class="font-semibold mb-4">Recent Activity</h3>
    <div class="space-y-4">
      <div v-for="item in activities" :key="item.id" class="flex items-start gap-3">
        <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
          <Lucide :icon="item.icon" class="w-4 h-4 text-gray-500" />
        </div>
        <div>
          <p class="text-sm text-gray-800 dark:text-white">{{ item.user }} {{ item.action }}</p>
          <p class="text-xs text-gray-400">{{ item.time }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Lucide from '@/components/Base/Lucide/Lucide.vue'
defineProps<{ activities: any[] }>()
</script>