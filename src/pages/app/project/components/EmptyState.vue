<template>
  <div class="text-center py-16">
    <div class="mx-auto w-24 h-24 bg-slate-100 dark:bg-darkmode-400 rounded-full flex items-center justify-center mb-4">
      <Lucide icon="Folder" class="w-10 h-10 text-slate-400" />
    </div>
    <h3 class="text-lg font-medium text-gray-900 dark:text-white">No projects yet</h3>
    <p class="text-gray-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
      Create your first project to start organizing tasks.
    </p>
    <Button variant="primary" class="mt-6" @click="$emit('create')">
      <Lucide icon="Plus" class="w-4 h-4 mr-2" />
      Create Project
    </Button>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/Base/Button'
import Lucide from '@/components/Base/Lucide/Lucide.vue'

defineEmits<{ create: [] }>()
</script>

