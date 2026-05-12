<template>
  <div class="bg-white dark:bg-darkmode-600 rounded-xl border border-gray-200 dark:border-darkmode-400 p-5 hover:shadow-md transition-shadow">
    <div class="flex justify-between items-start">
      <div class="flex-1">
        <div class="flex items-center gap-2 flex-wrap">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ project.name }}</h3>
          <span :class="visibilityBadgeClass(project.visibility)" class="text-xs px-2 py-0.5 rounded-full font-medium">
            {{ visibilityLabel(project.visibility) }}
          </span>
        </div>
        <p class="text-sm text-gray-500 dark:text-slate-400 mt-1 line-clamp-2">{{ project.description || 'No description' }}</p>
      </div>
      <div class="flex gap-1">
        <button
          @click="$emit('edit')"
          class="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
          title="Edit"
        >
          <Lucide icon="Edit" class="w-4 h-4" />
        </button>
        <button
          v-if="!project.deleted_at"
          @click="$emit('delete')"
          class="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
          title="Delete"
        >
          <Lucide icon="Trash2" class="w-4 h-4" />
        </button>
        <button
          v-if="project.deleted_at"
          @click="$emit('restore')"
          class="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400"
          title="Restore"
        >
          <Lucide icon="RefreshCw" class="w-4 h-4" />
        </button>
      </div>
    </div>
    <div class="mt-4 flex items-center text-xs text-gray-400 dark:text-slate-500">
      <span>Workspace: {{ project.workspace?.name || '-' }}</span>
      <span class="mx-2">•</span>
      <span>Created: {{ formatDate(project.created_at) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Project, ProjectVisibility } from '../Projects'
import Lucide from '@/components/Base/Lucide/Lucide.vue'

defineProps<{ project: Project }>()
defineEmits<{
  edit: []
  delete: []
  restore: []
}>()

const formatDate = (dateStr?: string): string =>
  dateStr ? new Date(dateStr).toLocaleDateString() : ''

const visibilityLabel = (visibility: ProjectVisibility): string => {
  const labels: Record<ProjectVisibility, string> = {
    private: 'Private',
    team: 'Team',
    public: 'Public'
  }
  return labels[visibility]
}

const visibilityBadgeClass = (visibility: ProjectVisibility): string => {
  const classes: Record<ProjectVisibility, string> = {
    private: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    team: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    public: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  }
  return classes[visibility]
}
</script>

