<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-6 px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="w-full mb-8">
      <div class="relative bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
        <div class="relative flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold">Dashboard</h1>
            <p class="text-blue-100 mt-1">Welcome back, {{ userName }}!</p>
          </div>
          <button @click="refresh" class="px-4 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition flex items-center gap-2">
            <RefreshCw class="h-4 w-4" :class="{ 'animate-spin': loading }" />
            Refresh
          </button>
        </div>
      </div>
    </div>

    <!-- Stat Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-2xl shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm">Total Tasks</p>
            <p class="text-3xl font-bold">{{ overallStats.total_tasks }}</p>
          </div>
          <div class="p-3 bg-blue-100 rounded-xl">
            <CheckSquare class="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>
      <div class="bg-white rounded-2xl shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm">Completed</p>
            <p class="text-3xl font-bold text-green-600">{{ overallStats.completed_tasks }}</p>
          </div>
          <div class="p-3 bg-green-100 rounded-xl">
            <Trophy class="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>
      <div class="bg-white rounded-2xl shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm">In Progress</p>
            <p class="text-3xl font-bold text-yellow-600">{{ overallStats.in_progress_tasks }}</p>
          </div>
          <div class="p-3 bg-yellow-100 rounded-xl">
            <Activity class="h-6 w-6 text-yellow-600" />
          </div>
        </div>
      </div>
      <div class="bg-white rounded-2xl shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm">Overdue</p>
            <p class="text-3xl font-bold text-red-600">{{ overallStats.overdue_tasks }}</p>
          </div>
          <div class="p-3 bg-red-100 rounded-xl">
            <AlertTriangle class="h-6 w-6 text-red-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Charts (Status & Priority) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div class="bg-white rounded-2xl shadow p-6">
        <h3 class="font-semibold text-gray-800 mb-4">Tasks by Status</h3>
        <div class="space-y-3">
          <div v-for="(count, status) in taskStats.by_status" :key="status" class="flex items-center gap-3">
            <span class="w-24 text-sm capitalize">{{ status }}</span>
            <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div class="h-full bg-blue-500 rounded-full" :style="{ width: getPercentage(count, totalTasks) + '%' }"></div>
            </div>
            <span class="text-sm font-medium">{{ count }}</span>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-2xl shadow p-6">
        <h3 class="font-semibold text-gray-800 mb-4">Tasks by Priority</h3>
        <div class="space-y-3">
          <div v-for="(count, priority) in taskStats.by_priority" :key="priority" class="flex items-center gap-3">
            <span class="w-24 text-sm capitalize">{{ priority }}</span>
            <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div class="h-full bg-purple-500 rounded-full" :style="{ width: getPercentage(count, totalTasks) + '%' }"></div>
            </div>
            <span class="text-sm font-medium">{{ count }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Task Lists -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Upcoming Tasks -->
      <div class="bg-white rounded-2xl shadow p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-semibold text-gray-800">Upcoming Tasks (next 7 days)</h3>
          <button class="text-blue-600 text-sm">View all</button>
        </div>
        <div v-if="upcomingTasks.length === 0" class="text-gray-500 text-center py-8">No upcoming tasks</div>
        <div v-else class="space-y-3">
          <div v-for="task in upcomingTasks" :key="task.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p class="font-medium">{{ task.title }}</p>
              <p class="text-xs text-gray-500">Due: {{ formatDate(task.due_date) }}</p>
            </div>
            <span :class="statusBadgeClass(task.status)" class="px-2 py-1 rounded text-xs">{{ task.status }}</span>
          </div>
        </div>
      </div>

      <!-- Overdue Tasks -->
      <div class="bg-white rounded-2xl shadow p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-semibold text-gray-800">Overdue Tasks</h3>
          <button class="text-blue-600 text-sm">View all</button>
        </div>
        <div v-if="overdueTasks.length === 0" class="text-gray-500 text-center py-8">No overdue tasks</div>
        <div v-else class="space-y-3">
          <div v-for="task in overdueTasks" :key="task.id" class="flex items-center justify-between p-3 bg-red-50 rounded-lg">
            <div>
              <p class="font-medium">{{ task.title }}</p>
              <p class="text-xs text-red-500">Due: {{ formatDate(task.due_date) }}</p>
            </div>
            <span class="px-2 py-1 rounded text-xs bg-red-100 text-red-800">{{ task.status }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Tasks (last 7 days) -->
      <div class="bg-white rounded-2xl shadow p-6">
        <h3 class="font-semibold text-gray-800 mb-4">Recent Tasks</h3>
        <div v-if="recentTasks.length === 0" class="text-gray-500 text-center py-8">No recent tasks</div>
        <div v-else class="space-y-3">
          <div v-for="task in recentTasks" :key="task.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p class="font-medium">{{ task.title }}</p>
              <p class="text-xs text-gray-500">Created: {{ formatDate(task.created_at) }}</p>
            </div>
            <span :class="statusBadgeClass(task.status)" class="px-2 py-1 rounded text-xs">{{ task.status }}</span>
          </div>
        </div>
      </div>

      <!-- My Tasks (assigned to me) -->
      <div class="bg-white rounded-2xl shadow p-6">
        <h3 class="font-semibold text-gray-800 mb-4">Tasks Assigned to Me</h3>
        <div v-if="myTasksList.length === 0" class="text-gray-500 text-center py-8">No tasks assigned</div>
        <div v-else class="space-y-3">
          <div v-for="task in myTasksList" :key="task.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p class="font-medium">{{ task.title }}</p>
              <p class="text-xs text-gray-500">Project: {{ task.project?.name || '-' }}</p>
            </div>
            <span :class="statusBadgeClass(task.status)" class="px-2 py-1 rounded text-xs">{{ task.status }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { RefreshCw, CheckSquare, Trophy, Activity, AlertTriangle } from 'lucide-vue-next'
import ApiService from '@/core/services/ApiService'
import publicEndpoint from '@/constants/publicApi'
import type { ApiResponse } from '@/core/services/ApiService'

// Interfaces
interface OverallStats {
  total_tasks: number
  completed_tasks: number
  in_progress_tasks: number
  overdue_tasks: number
  completion_rate: number
  time_spent_this_week_minutes: number
  time_spent_this_week_hours: number
}

interface TaskStats {
  by_status: Record<string, number>
  by_priority: Record<string, number>
}

interface Task {
  id: string
  title: string
  status: string
  due_date?: string
  created_at?: string
  project?: { id: string; name: string }
}

// State
const loading = ref(false)
const userName = ref('')
const overallStats = ref<OverallStats>({
  total_tasks: 0,
  completed_tasks: 0,
  in_progress_tasks: 0,
  overdue_tasks: 0,
  completion_rate: 0,
  time_spent_this_week_minutes: 0,
  time_spent_this_week_hours: 0
})
const taskStats = ref<TaskStats>({ by_status: {}, by_priority: {} })
const upcomingTasks = ref<Task[]>([])
const overdueTasks = ref<Task[]>([])
const recentTasks = ref<Task[]>([])
const myTasksList = ref<Task[]>([])

// Computed
const totalTasks = computed(() => overallStats.value.total_tasks)

// Helper
const getPercentage = (count: number, total: number) => {
  if (total === 0) return 0
  return (count / total) * 100
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString()
}

const statusBadgeClass = (status: string) => {
  switch (status) {
    case 'todo': return 'bg-gray-100 text-gray-800'
    case 'in_progress': return 'bg-yellow-100 text-yellow-800'
    case 'in_review': return 'bg-blue-100 text-blue-800'
    case 'done': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

// API calls
async function fetchDashboardData() {
  loading.value = true
  try {
    // Get overall summary
    const overallRes = await ApiService.get({ resource: publicEndpoint.dashboard.overallSummary }) as ApiResponse<OverallStats>
    overallStats.value = overallRes.payload

    // Get task stats (by status & priority)
    const statsRes = await ApiService.get({ resource: publicEndpoint.dashboard.stats }) as ApiResponse<TaskStats>
    taskStats.value = statsRes.payload

    // Upcoming tasks
    const upcomingRes = await ApiService.get({ resource: publicEndpoint.dashboard.upcomingTasks }) as ApiResponse<Task[]>
    upcomingTasks.value = upcomingRes.payload || []

    // Overdue tasks
    const overdueRes = await ApiService.get({ resource: publicEndpoint.dashboard.overdueTasks }) as ApiResponse<Task[]>
    overdueTasks.value = overdueRes.payload || []

    // Recent tasks
    const recentRes = await ApiService.get({ resource: publicEndpoint.dashboard.recentTasks }) as ApiResponse<Task[]>
    recentTasks.value = recentRes.payload || []

    // My tasks
    const myTasksRes = await ApiService.get({ resource: publicEndpoint.dashboard.myTasks }) as ApiResponse<Task[]>
    myTasksList.value = myTasksRes.payload || []
  } catch (error) {
    console.error('Failed to load dashboard:', error)
  } finally {
    loading.value = false
  }
}

const refresh = () => {
  fetchDashboardData()
}

// Get username from localStorage
const getUserName = () => {
  const userStr = localStorage.getItem('auth_user')
  if (userStr) {
    try {
      const user = JSON.parse(userStr)
      userName.value = user.name || 'User'
    } catch {
      userName.value = 'User'
    }
  } else {
    userName.value = 'User'
  }
}

onMounted(() => {
  getUserName()
  fetchDashboardData()
})
</script>