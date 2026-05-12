<template>
  <div class="py-6 px-4 sm:px-6 lg:px-8">
    <!-- ── Header ──────────────────────────────────────────────────────────── -->
    <div class="flex flex-wrap items-center justify-between pb-5 mb-6 border-b border-slate-200 dark:border-darkmode-400 gap-4">
      <div>
        <h2 class="text-2xl font-semibold text-slate-800 dark:text-slate-100">Tasks</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage and track all your tasks</p>
      </div>
      <button
          @click="openCreateModal"
          class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors shadow-sm"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        New Task
      </button>
    </div>

    <!-- ── Filters ─────────────────────────────────────────────────────────── -->
    <div class="flex flex-col sm:flex-row gap-3 mb-6">
      <!-- Search -->
      <div class="relative flex-1">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
            v-model="filters.search"
            type="text"
            placeholder="Search tasks…"
            class="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-darkmode-400 bg-white dark:bg-darkmode-600 focus:outline-none focus:ring-2 focus:ring-violet-400 text-slate-700 dark:text-slate-200 placeholder-slate-300"
        />
      </div>

      <!-- Status filter -->
      <select
          v-model="filters.status"
          class="text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-darkmode-400 bg-white dark:bg-darkmode-600 focus:outline-none focus:ring-2 focus:ring-violet-400 text-slate-700 dark:text-slate-200 w-full sm:w-40"
      >
        <option value="">All Status</option>
        <option value="todo">Todo</option>
        <option value="in_progress">In Progress</option>
        <option value="in_review">In Review</option>
        <option value="done">Done</option>
      </select>

      <!-- Priority filter -->
      <select
          v-model="filters.priority"
          class="text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-darkmode-400 bg-white dark:bg-darkmode-600 focus:outline-none focus:ring-2 focus:ring-violet-400 text-slate-700 dark:text-slate-200 w-full sm:w-40"
      >
        <option value="">All Priority</option>
        <option value="urgent">🔴 Urgent</option>
        <option value="high">🟠 High</option>
        <option value="normal">🔵 Normal</option>
        <option value="low">🟢 Low</option>
      </select>

      <!-- Reset -->
      <button
          v-if="filters.search || filters.status || filters.priority"
          @click="resetFilters"
          class="text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-darkmode-400 bg-white dark:bg-darkmode-600 hover:bg-slate-50 dark:hover:bg-darkmode-700 text-slate-500 transition-colors"
      >
        Reset
      </button>
    </div>

    <!-- ── Task List ────────────────────────────────────────────────────────── -->
    <div class="bg-white dark:bg-darkmode-600 rounded-xl border border-slate-200 dark:border-darkmode-400 overflow-hidden">
      <!-- Column header -->
      <div class="hidden sm:flex items-center gap-3 px-4 py-2 border-b border-slate-100 dark:border-darkmode-400 bg-slate-50 dark:bg-darkmode-700 text-xs font-semibold uppercase tracking-wider text-slate-400">
        <span class="w-4 flex-shrink-0" />
        <span class="w-2 flex-shrink-0" />
        <span class="flex-1">Task</span>
        <span class="w-40 text-right">Status / Priority</span>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-16">
        <svg class="w-8 h-8 animate-spin text-violet-400" viewBox="0 0 24 24" fill="none">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
        </svg>
      </div>

      <!-- Empty state -->
      <div v-else-if="tasks.length === 0" class="flex flex-col items-center justify-center py-20 text-center px-6">
        <div class="w-20 h-20 rounded-full bg-slate-100 dark:bg-darkmode-400 flex items-center justify-center mb-5">
          <svg class="w-10 h-10 text-slate-300 dark:text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
          </svg>
        </div>
        <h3 class="text-base font-semibold text-slate-700 dark:text-slate-200">No tasks yet</h3>
        <p class="text-sm text-slate-400 mt-1 mb-5">Create your first task to get started.</p>
        <button
            @click="openCreateModal"
            class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Create Task
        </button>
      </div>

      <!-- List -->
      <template v-else>
        <TasksListItems
            v-for="task in tasks"
            :key="task.id"
            :task="task"
            @click="openTaskDetail"
            @toggle="toggleComplete"
        />
      </template>
    </div>

    <!-- ── Pagination ───────────────────────────────────────────────────────── -->
    <div v-if="!loading && tasks.length" class="flex items-center justify-between mt-5 text-sm text-slate-500 dark:text-slate-400">
      <span>
        Showing {{ (currentPage - 1) * perPage + 1 }}–{{ Math.min(currentPage * perPage, total) }} of {{ total }}
      </span>
      <div class="flex items-center gap-2">
        <button
            :disabled="currentPage === 1"
            @click="prevPage"
            class="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-darkmode-400 bg-white dark:bg-darkmode-600 hover:bg-slate-50 dark:hover:bg-darkmode-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >Previous</button>
        <span class="px-2">{{ currentPage }} / {{ lastPage }}</span>
        <button
            :disabled="currentPage === lastPage"
            @click="nextPage"
            class="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-darkmode-400 bg-white dark:bg-darkmode-600 hover:bg-slate-50 dark:hover:bg-darkmode-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >Next</button>
      </div>
    </div>

    <!-- ── Detail Modal (slide-in panel) ───────────────────────────────────── -->
    <TaskDetailModal
        :show="showDetailModal"
        :detail-stack="detailStack"
        :task-detail-cache="taskDetailCache"
        :detail-loading="detailLoading"
        :update-task="updateTask"
        :delete-task="deleteTask"
        :toggle-complete="toggleComplete"
        :add-subtask="addSubtask"
        :toggle-subtask="toggleSubtask"
        @close="closeDetailModal"
        @pop-stack="popDetailStack"
        @jump-stack="(idx) => { detailStack.splice(idx + 1) }"
        @open-subtask="pushSubtaskDetail"
    />

    <!-- ── Create Modal ─────────────────────────────────────────────────────── -->
    <TaskModal
        :show="showCreateModal"
        @close="closeCreateModal"
        @submit="handleCreate"
    />
  </div>
</template>

<script setup lang="ts">
import { useTasks } from './Tasks'
import TasksListItems  from './components/TasksListItems.vue'
import TaskDetailModal from './components/TaskDetailModal.vue'
import TaskModal       from './components/TaskModal.vue'
import ApiService      from '@/core/services/ApiService'
import publicEndpoint  from '@/constants/publicApi'

const {
  tasks, loading, currentPage, perPage, total, lastPage, filters,
  showDetailModal, showCreateModal, detailLoading,
  detailStack, taskDetailCache,
  toggleComplete, deleteTask, updateTask,
  addSubtask, toggleSubtask,
  openTaskDetail, pushSubtaskDetail, popDetailStack, closeDetailModal,
  openCreateModal, closeCreateModal,
  fetchTasks, prevPage, nextPage, resetFilters
} = useTasks()

async function handleCreate(form: any) {
  try {
    await ApiService.post({
      resource: publicEndpoint.tasks.create,
      params: form
    })
    closeCreateModal()
    await fetchTasks()
  } catch (error) {
    console.error('Failed to create task', error)
  }
}
</script>