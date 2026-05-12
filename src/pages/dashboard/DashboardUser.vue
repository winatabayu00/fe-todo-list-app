<template>
  <div class="p-6">
    <div class="grid grid-cols-4 gap-6">
      <StatsCard v-for="stat in stats" :key="stat.title" v-bind="stat" />
    </div>
    <div class="grid grid-cols-2 gap-6 mt-6">
      <ActivityFeed :activities="activities" />
      <CalendarWidget />
    </div>
  </div>
</template>

<script setup>
import { useDashboardStore } from '@/stores/dashboard'
import StatsCard from "@/components/common/StatsCard.vue";
import ActivityFeed from "@/components/common/ActivityFeed.vue";
import CalendarWidget from "@/components/common/CalendarWidget.vue";
const { stats, activities } = useDashboardStore()
</script>