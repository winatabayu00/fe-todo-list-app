<template>
  <div class="w-full mb-8">
    <div class="relative bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
      <div class="relative flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold">Tasks</h1>
          <p class="text-blue-100 mt-1">Manage and track all your tasks</p>
        </div>
        <button
          @click="$emit('create')"
          class="px-4 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition flex items-center gap-2"
        >
          <Plus class="h-4 w-4" />
          New Task
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus } from 'lucide-vue-next'

defineEmits<{ create: [] }>()
</script>

