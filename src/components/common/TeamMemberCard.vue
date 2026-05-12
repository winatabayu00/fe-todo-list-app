<template>
  <div class="bg-white dark:bg-darkmode-600 rounded-xl border border-gray-200 p-4 flex items-center gap-4">
    <div class="relative">
      <div class="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-semibold">
        {{ initials }}
      </div>
      <div class="absolute bottom-0 right-0 w-3 h-3 rounded-full" :class="statusClass"></div>
    </div>
    <div class="flex-1">
      <p class="font-medium">{{ member.name }}</p>
      <p class="text-xs text-gray-500">{{ member.role }}</p>
    </div>
    <div class="text-xs bg-gray-100 dark:bg-darkmode-400 px-2 py-1 rounded-full">
      {{ member.roleBadge }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ member: any }>()
const initials = computed(() => props.member.name.split(' ').map(n => n[0]).join(''))
const statusClass = computed(() => props.member.status === 'online' ? 'bg-emerald-500' : 'bg-gray-400')
</script>