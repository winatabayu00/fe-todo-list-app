<!-- @/components/common/PageHeader.vue -->
<template>
  <div class="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
    <!-- Left side: Title and description -->
    <div class="flex items-center gap-3">
      <div v-if="backButton">
        <button
          @click="$router.back()"
          class="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors p-2 hover:bg-white rounded-lg"
        >
          <ArrowLeft class="h-5 w-5" />
          <span class="hidden sm:block">Back to Accounts</span>
        </button>
      </div>
      <!-- Icon slot (optional) -->
      <slot name="icon">
        <!-- Default icon if no slot provided -->
        <div v-if="defaultIcon" class="p-2 bg-white rounded-xl shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24"
               stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
      </slot>

      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-gray-800">{{ title }}</h1>
        <p v-if="description" class="text-gray-600 mt-1 text-sm">{{ description }}</p>
        <!-- Optional subtitle slot -->
        <slot name="subtitle"></slot>
      </div>
    </div>

    <!-- Right side: Actions/content -->
    <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'

interface Props {
  title: string
  description?: string
  defaultIcon?: boolean
  backButton?: boolean
}

withDefaults(defineProps<Props>(), {
  description: '',
  defaultIcon: true,
  backButton: false,
})
</script>