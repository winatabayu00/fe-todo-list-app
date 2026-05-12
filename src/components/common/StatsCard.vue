<template>
  <div class="bg-white dark:bg-darkmode-600 rounded-xl border border-gray-200 dark:border-darkmode-400 p-5 shadow-sm">
    <div class="flex justify-between items-start">
      <div>
        <p class="text-sm text-gray-500">{{ title }}</p>
        <p class="text-2xl font-bold mt-1">{{ value }}</p>
      </div>
      <div class="p-2 rounded-lg" :class="iconBg">
        <Lucide :icon="icon" class="w-5 h-5 text-white" />
      </div>
    </div>
    <div v-if="trend" class="mt-3 text-xs text-gray-400">
      <span :class="trend > 0 ? 'text-green-600' : 'text-red-600'">
        {{ trend > 0 ? '+' : '' }}{{ trend }}%
      </span> from last week
    </div>
  </div>
</template>

<script setup lang="ts">
import Lucide from '@/components/Base/Lucide/Lucide.vue'
defineProps<{
  title: string
  value: string | number
  icon: string
  iconBg: string
  trend?: number
}>()
</script>