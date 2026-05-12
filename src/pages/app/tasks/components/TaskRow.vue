<template>
  <div class="p-4 hover:bg-gray-50 transition">
    <div class="flex items-start gap-4">
      <input
        type="checkbox"
        :checked="task.is_completed"
        @change="$emit('toggle')"
        class="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <div class="flex-1">
        <div class="flex items-center gap-2 flex-wrap">
          <h3 class="font-medium text-gray-900" :class="{ 'line-through text-gray-400': task.is_completed }">
            {{ task.title }}
          </h3>
          <span :class="statusBadgeClass(task.status)" class="px-2 py-0.5 rounded text-xs font-medium">
            {{ formatStatus(task.status) }}
          </span>
          <span :class="priorityBadgeClass(task.priority)" class="px-2 py-0.5 rounded text-xs font-medium">
            {{ formatPriority(task.priority) }}
          </span>
        </div>
        <p v-if="task.description" class="text-sm text-gray-500 mt-1">{{ task.description }}</p>
        <div class="flex items-center gap-4 mt-2 text-xs text-gray-400">
          <span v-if="task.due_date" class="flex items-center gap-1">
            <Calendar class="h-3 w-3" />
            Due: {{ formatDate(task.due_date) }}
          </span>
          <span v-if="task.assignee?.name">Assignee: {{ task.assignee.name }}</span>
          <span>Project: {{ task.project?.name || '-' }}</span>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button @click="$emit('edit')" class="text-blue-600 hover:text-blue-800">
          <Edit class="h-4 w-4" />
        </button>
        <button @click="$emit('delete')" class="text-red-600 hover:text-red-800">
          <Trash2 class="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Edit, Trash2, Calendar } from 'lucide-vue-next'
import type { Task, TaskStatus, TaskPriority } from '../Tasks'

defineProps<{ task: Task }>()
defineEmits<{
  toggle: []
  edit: []
  delete: []
}>()

const formatStatus = (status: TaskStatus): string => {
  const map: Record<TaskStatus, string> = {
    todo: 'Todo',
    in_progress: 'In Progress',
    in_review: 'In Review',
    done: 'Done'
  }
  return map[status]
}

const formatPriority = (priority: TaskPriority): string => {
  const map: Record<TaskPriority, string> = {
    urgent: 'Urgent',
    high: 'High',
    normal: 'Normal',
    low: 'Low'
  }
  return map[priority]
}

const formatDate = (dateStr?: string): string =>
  dateStr ? new Date(dateStr).toLocaleDateString() : ''

const statusBadgeClass = (status: TaskStatus): string => {
  const classes: Record<TaskStatus, string> = {
    todo: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    in_progress: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    in_review: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    done: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  }
  return classes[status]
}

const priorityBadgeClass = (priority: TaskPriority): string => {
  const classes: Record<TaskPriority, string> = {
    urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    normal: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  }
  return classes[priority]
}
</script>
