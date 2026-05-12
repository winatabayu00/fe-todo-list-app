<template>
  <div class="bg-white rounded-2xl shadow p-4 mb-6">
    <div class="flex flex-wrap gap-4 items-end">
      <div class="flex-1 min-w-[200px]">
        <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
        <input
          :value="filters.search"
          @input="$emit('update:search', $event.target.value)"
          type="text"
          placeholder="Search by title..."
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          :value="filters.status"
          @change="$emit('update:status', $event.target.value)"
          class="px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">All</option>
          <option value="todo">Todo</option>
          <option value="in_progress">In Progress</option>
          <option value="in_review">In Review</option>
          <option value="done">Done</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
        <select
          :value="filters.priority"
          @change="$emit('update:priority', $event.target.value)"
          class="px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">All</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="normal">Normal</option>
          <option value="low">Low</option>
        </select>
      </div>
      <button
        @click="$emit('reset')"
        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
      >
        Reset
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TaskFilters } from '../Tasks'

defineProps<{ filters: TaskFilters }>()
defineEmits<{
  'update:search': [value: string]
  'update:status': [value: string]
  'update:priority': [value: string]
  reset: []
}>()
</script>

