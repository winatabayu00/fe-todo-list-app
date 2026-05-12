<template>
  <div class="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
    <div class="text-sm text-gray-500">
      Showing {{ (currentPage - 1) * perPage + 1 }} to {{ Math.min(currentPage * perPage, total) }} of {{ total }}
    </div>
    <div class="flex gap-2">
      <button
        @click="$emit('prev')"
        :disabled="currentPage === 1"
        class="px-3 py-1 border rounded-md disabled:opacity-50"
      >
        Previous
      </button>
      <button
        @click="$emit('next')"
        :disabled="currentPage === lastPage"
        class="px-3 py-1 border rounded-md disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  currentPage: number
  lastPage: number
  total: number
  perPage: number
}>()

defineEmits<{
  prev: []
  next: []
}>()
</script>
