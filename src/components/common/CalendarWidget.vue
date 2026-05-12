<template>
  <div class="bg-white dark:bg-darkmode-600 rounded-xl border border-gray-200 p-5">
    <div class="flex justify-between items-center mb-4">
      <h3 class="font-semibold">Calendar</h3>
      <div class="flex gap-2">
        <button @click="prevMonth" class="p-1"><Lucide icon="ChevronLeft" class="w-4 h-4" /></button>
        <span class="text-sm">{{ currentMonth }}</span>
        <button @click="nextMonth" class="p-1"><Lucide icon="ChevronRight" class="w-4 h-4" /></button>
      </div>
    </div>
    <div class="grid grid-cols-7 gap-1 text-center text-xs text-gray-400">
      <div v-for="day in ['Su','Mo','Tu','We','Th','Fr','Sa']" :key="day">{{ day }}</div>
    </div>
    <div class="grid grid-cols-7 gap-1 mt-2">
      <div v-for="date in calendarDays" :key="date.date" class="text-center text-sm p-1 rounded-full" :class="dayClasses(date)">
        <span>{{ date.day }}</span>
        <div v-if="date.hasTask" class="w-1 h-1 bg-indigo-500 rounded-full mx-auto mt-0.5"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Lucide from '@/components/Base/Lucide/Lucide.vue'

const currentDate = ref(new Date())
const tasksByDate = ref<Record<string, boolean>>({ '2025-05-15': true }) // mock

const prevMonth = () => currentDate.value = new Date(currentDate.value.setMonth(currentDate.value.getMonth() - 1))
const nextMonth = () => currentDate.value = new Date(currentDate.value.setMonth(currentDate.value.getMonth() + 1))

const currentMonth = computed(() => currentDate.value.toLocaleString('default', { month: 'long', year: 'numeric' }))

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startOffset = firstDay.getDay()
  const days = []
  for (let i = 0; i < startOffset; i++) days.push({ day: '', date: null, hasTask: false })
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
    days.push({ day: d, date: dateStr, hasTask: !!tasksByDate.value[dateStr] })
  }
  return days
})

const dayClasses = (day: any) => {
  if (!day.date) return ''
  const today = new Date().toISOString().slice(0,10)
  return day.date === today ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700' : ''
}
</script>