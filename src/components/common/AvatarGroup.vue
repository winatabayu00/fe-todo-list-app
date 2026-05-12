<template>
  <div class="flex -space-x-2">
    <div
        v-for="user in users.slice(0, maxVisible)"
        :key="user.id"
        class="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-xs font-medium text-indigo-800 border-2 border-white dark:border-darkmode-600"
        :style="{ backgroundColor: user.color }"
    >
      {{ userInitials(user.name) }}
    </div>
    <div v-if="users.length > maxVisible" class="w-6 h-6 rounded-full bg-gray-200 dark:bg-darkmode-400 flex items-center justify-center text-xs font-medium border-2 border-white dark:border-darkmode-600">
      +{{ users.length - maxVisible }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  users: Array<{ id: string; name: string; color?: string }>
  maxVisible?: number
}>()
const userInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
</script>