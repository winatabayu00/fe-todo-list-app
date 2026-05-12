<template>
  <div
      @click="$emit('click', task.id)"
      class="group flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-darkmode-700 transition-colors cursor-pointer border-b border-slate-100 dark:border-darkmode-400 last:border-0"
  >
    <!-- Checkbox -->
    <button
        @click.stop="$emit('toggle', task)"
        class="flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-colors"
        :class="task.is_completed
        ? 'bg-emerald-500 border-emerald-500 text-white'
        : 'border-slate-300 dark:border-slate-600 hover:border-emerald-400'"
    >
      <svg v-if="task.is_completed" class="w-2.5 h-2.5" viewBox="0 0 12 10" fill="none">
        <path d="M1 5L4.5 8.5L11 1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <!-- Priority dot -->
    <span
        class="flex-shrink-0 w-2 h-2 rounded-full"
        :class="statusDotClass(task.status)"
    />

    <!-- Title -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2 flex-wrap">
        <span
            class="text-sm font-medium text-slate-800 dark:text-slate-100 truncate"
            :class="{ 'line-through text-slate-400 dark:text-slate-500': task.is_completed }"
        >{{ task.title }}</span>
        <span
            v-if="task.subtasks?.length"
            class="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1"
        >
          <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 11 12 14 22 4"/>
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
          </svg>
          {{ task.subtasks?.filter(s => s && s.is_completed).length }}/{{ task.subtasks?.filter(s => s).length }}
        </span>
      </div>
      <div class="flex items-center gap-3 mt-0.5 text-xs text-slate-400 dark:text-slate-500 flex-wrap">
        <span v-if="task.due_date" class="flex items-center gap-1" :class="isOverdue(task) ? 'text-red-500' : ''">
          <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          {{ formatDate(task.due_date) }}
        </span>
        <span v-if="task.assignee?.name" class="flex items-center gap-1">
          <span class="w-4 h-4 rounded-full bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 flex items-center justify-center text-[9px] font-bold uppercase">
            {{ task.assignee.name[0] }}
          </span>
          {{ task.assignee.name }}
        </span>
        <span v-if="task.project?.name" class="flex items-center gap-1">
          <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
          </svg>
          {{ task.project.name }}
        </span>
      </div>
    </div>

    <!-- Right: status + priority badges -->
    <div class="hidden sm:flex items-center gap-2 flex-shrink-0">
      <span class="px-2 py-0.5 rounded text-xs font-medium" :class="statusBadgeClass(task.status)">
        {{ formatStatus(task.status) }}
      </span>
      <span class="px-2 py-0.5 rounded text-xs font-medium" :class="priorityBadgeClass(task.priority)">
        {{ formatPriority(task.priority) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '../Tasks'
import { taskHelpers } from '../Tasks'

const { statusBadgeClass, statusDotClass, priorityBadgeClass, formatStatus, formatPriority, formatDate } = taskHelpers

defineProps<{ task: Task }>()
defineEmits<{ click: [id: string]; toggle: [task: Task] }>()

function isOverdue(task: Task) {
  if (!task.due_date || task.is_completed) return false
  return new Date(task.due_date) < new Date()
}
</script>