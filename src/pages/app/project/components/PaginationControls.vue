<template>
  <div class="flex items-center justify-between mt-6">
    <div class="text-sm text-gray-500">
      Showing {{ (currentPage - 1) * perPage + 1 }} to {{ Math.min(currentPage * perPage, total) }} of {{ total }}
    </div>
    <div class="flex gap-2">
      <Button
        variant="outline-secondary"
        :disabled="currentPage === 1"
        @click="$emit('prev')"
      >
        Previous
      </Button>
      <Button
        variant="outline-secondary"
        :disabled="currentPage === lastPage"
        @click="$emit('next')"
      >
        Next
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/Base/Button'

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

