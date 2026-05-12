<!-- src/components/workspace/WorkspaceCard.vue -->
<template>
  <div
      class="bg-white dark:bg-darkmode-600 rounded-xl border border-gray-100 dark:border-darkmode-400 p-5 hover:shadow-md transition-all duration-200 group"
  >
    <div class="flex items-start justify-between mb-3">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold">
          {{ initials }}
        </div>
        <div>
          <h3 class="font-semibold text-gray-800 dark:text-gray-200">{{ workspace.name }}</h3>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Owner: {{ workspace.owner?.name || '—' }}</p>
        </div>
      </div>
      <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition">
        <button @click="$emit('edit')" class="p-1.5 text-gray-500 hover:text-indigo-600 rounded-md hover:bg-gray-50 dark:hover:bg-darkmode-400">
          <Lucide icon="Edit" class="w-4 h-4" />
        </button>
        <button @click="$emit('members')" class="p-1.5 text-gray-500 hover:text-indigo-600 rounded-md hover:bg-gray-50 dark:hover:bg-darkmode-400">
          <Lucide icon="Users" class="w-4 h-4" />
        </button>
        <button v-if="!workspace.deleted_at" @click="$emit('delete')" class="p-1.5 text-gray-500 hover:text-rose-600 rounded-md hover:bg-gray-50 dark:hover:bg-darkmode-400">
          <Lucide icon="Trash2" class="w-4 h-4" />
        </button>
        <button v-if="workspace.deleted_at" @click="$emit('restore')" class="p-1.5 text-gray-500 hover:text-emerald-600 rounded-md hover:bg-gray-50 dark:hover:bg-darkmode-400">
          <Lucide icon="RefreshCw" class="w-4 h-4" />
        </button>
      </div>
    </div>
    <p v-if="workspace.description" class="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
      {{ workspace.description }}
    </p>
    <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
      <div class="flex items-center gap-1">
        <Lucide icon="Calendar" class="w-3.5 h-3.5" />
        <span>Created {{ formatDate(workspace.created_at) }}</span>
      </div>
      <div class="flex items-center gap-1">
        <Lucide icon="Users" class="w-3.5 h-3.5" />
        <span>{{ memberCount }} members</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Lucide from '@/components/Base/Lucide/Lucide.vue'
import type { Workspace } from '@/pages/workspaces/Workspaces'

const props = defineProps<{
  workspace: Workspace
}>()

const emit = defineEmits(['edit', 'members', 'delete', 'restore'])

const initials = computed(() => {
  return props.workspace.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
})

const memberCount = computed(() => props.workspace.members?.length || 0)

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>