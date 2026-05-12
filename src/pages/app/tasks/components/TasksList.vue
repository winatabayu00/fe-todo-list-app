<template>
  <div class="divide-y divide-gray-200">
    <TaskRow
      v-for="task in tasks"
      :key="task.id"
      :task="task"
      @toggle="$emit('toggle', $event)"
      @edit="$emit('edit', $event)"
      @delete="$emit('delete', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import type { Task } from '../Tasks'
import TaskRow from './TaskRow.vue'

defineProps<{ tasks: Task[] }>()
defineEmits<{
  toggle: [task: Task]
  edit: [task: Task]
  delete: [id: string]
}>()
</script>

