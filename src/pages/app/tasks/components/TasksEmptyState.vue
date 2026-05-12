<template>
  <div class="p-8 text-center text-gray-500">
    <div class="mb-2">
      <Calendar class="h-12 w-12 mx-auto text-gray-300 mb-2" />
    </div>
    <p>No tasks found.</p>
    <p class="text-sm">Create a new task to get started.</p>
  </div>
</template>

<script setup lang="ts">
import { Calendar } from 'lucide-vue-next'
</script>

