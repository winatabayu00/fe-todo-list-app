<template>
  <div
      class="bg-white dark:bg-darkmode-600 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-darkmode-400 cursor-grab hover:shadow-md transition"
  >
    <div class="flex justify-between items-start">
      <h4 class="text-sm font-medium text-gray-900 dark:text-white">{{ task.title }}</h4>
      <span :class="priorityBadgeClass" class="text-xs px-2 py-0.5 rounded-full font-medium">
        {{ task.priority }}
      </span>
    </div>
    <p v-if="task.description" class="text-xs text-gray-500 mt-1 line-clamp-2">{{ task.description }}</p>
    <div class="flex items-center justify-between mt-3">
      <div class="flex items-center gap-1">
        <AvatarGroup :users="task.assignees" size="sm" />
      </div>
      <div class="flex items-center gap-2 text-xs text-gray-400">
        <Lucide v-if="task.dueDate" icon="Calendar" class="w-3 h-3" />
        <span>{{ formatDueDate(task.dueDate) }}</span>
      </div>
    </div>
    <div v-if="task.tags?.length" class="flex gap-1 mt-2">
      <span v-for="tag in task.tags.slice(0, 2)" :key="tag" class="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-darkmode-400">
        {{ tag }}
      </span>
      <span v-if="task.tags.length > 2" class="text-xs text-gray-400">+{{ task.tags.length - 2 }}</span>
    </div>
    <!-- Progress (optional) -->
    <div v-if="task.progress !== undefined" class="mt-2">
      <div class="w-full bg-gray-100 rounded-full h-1">
        <div class="bg-indigo-500 h-1 rounded-full" :style="{ width: `${task.progress}%` }"></div>
      </div>
      <span class="text-[10px] text-gray-400">{{ task.progress }}%</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Lucide from '@/components/Base/Lucide/Lucide.vue'
import AvatarGroup from './AvatarGroup.vue'

const props = defineProps<{
  task: any
}>()

const priorityBadgeClass = computed(() => {
  switch (props.task.priority) {
    case 'urgent': return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400'
    case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
    case 'normal': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    default: return 'bg-gray-100 text-gray-800 dark:bg-darkmode-400 dark:text-gray-300'
  }
})

const formatDueDate = (date: string) => {
  if (!date) return ''
  const d = new Date(date)
  const today = new Date()
  if (d.toDateString() === today.toDateString()) return 'Today'
  return d.toLocaleDateString()
}
</script>