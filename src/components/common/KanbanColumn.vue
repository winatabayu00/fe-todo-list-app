<template>
  <div class="bg-gray-50 dark:bg-darkmode-800 rounded-xl p-3 w-80 flex-shrink-0">
    <div class="flex justify-between items-center mb-3 px-1">
      <h3 class="font-semibold text-gray-700 dark:text-gray-300">
        {{ title }}
        <span class="text-xs text-gray-400 ml-1">{{ tasks.length }}</span>
      </h3>
      <button class="p-1 hover:bg-gray-200 dark:hover:bg-darkmode-600 rounded" @click="$emit('add')">
        <Lucide icon="Plus" class="w-4 h-4" />
      </button>
    </div>
    <div class="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
      <TaskCard
          v-for="task in tasks"
          :key="task.id"
          :task="task"
          draggable="true"
          @dragstart="handleDragStart($event, task)"
          @drop="handleDrop($event, task)"
          @dragover.prevent
      />
      <div v-if="!tasks.length" class="text-center py-8 text-gray-400 text-sm">
        Empty column
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Lucide from '@/components/Base/Lucide/Lucide.vue'
import TaskCard from './TaskCard.vue'

defineProps<{ title: string; tasks: any[] }>()
const emit = defineEmits(['add', 'dragStart', 'drop'])

const handleDragStart = (e: DragEvent, task: any) => {
  e.dataTransfer?.setData('text/plain', JSON.stringify(task))
}
const handleDrop = (e: DragEvent, targetTask: any) => {
  emit('drop', targetTask)
}
</script>