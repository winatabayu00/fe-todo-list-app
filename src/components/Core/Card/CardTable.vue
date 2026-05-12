<template>
  <div>
    <!-- Grid -->
    <div :class="gridClass">
      <slot />
    </div>

    <!-- Loading more indicator in grid -->
    <div v-if="loading && items.length > 0" class="col-span-full text-center py-4">
      <div class="inline-flex items-center gap-2 text-gray-500">
        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        <span>{{ loadingText }}</span>
      </div>
    </div>

    <!-- Load More Button -->
    <div v-if="hasMore && items.length > 0" class="mt-8 text-center">
      <button
        @click="$emit('load-more')"
        :disabled="loading"
        class="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 flex items-center justify-center gap-2 mx-auto shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg v-if="loading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span v-else>{{ loadMoreText }}</span>
      </button>
      <p v-if="showCount" class="text-sm text-gray-500 mt-2">
        {{ items.length }} of {{ totalCount }} items loaded
      </p>
    </div>

    <!-- No More Data Message -->
    <div v-if="!hasMore && items.length > 0" class="mt-8 text-center">
      <div class="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <span class="text-sm font-medium">All {{ totalCount }} items loaded</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  items: any[]
  loading?: boolean
  hasMore?: boolean
  totalCount?: number
  showCount?: boolean
  loadingText?: string
  loadMoreText?: string
  gridClass?: string
}

withDefaults(defineProps<Props>(), {
  items: () => [],
  loading: false,
  hasMore: false,
  totalCount: 0,
  showCount: true,
  loadingText: 'Loading more...',
  loadMoreText: 'Load More',
  gridClass: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
})

defineEmits<{
  'load-more': []
}>()
</script>