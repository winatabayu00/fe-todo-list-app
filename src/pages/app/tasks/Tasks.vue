<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-6 px-4 sm:px-6 lg:px-8">
    <!-- Header Section -->
    <TasksHeader @create="openCreateModal" />

    <!-- Filters Section -->
    <TasksFilters
      :filters="filters"
      @update:search="filters.search = $event"
      @update:status="filters.status = $event"
      @update:priority="filters.priority = $event"
      @reset="resetFilters"
    />

    <!-- Content Section -->
    <div class="bg-white rounded-2xl shadow overflow-hidden">
      <LoadingIcon v-if="loading" icon="puff" class="p-8 mx-auto" />
      <TasksEmptyState v-else-if="tasks.length === 0" />
      <TasksList
        v-else
        :tasks="tasks"
        @toggle="toggleComplete"
        @edit="openEditModal"
        @delete="deleteTask"
      />

      <!-- Pagination -->
      <TasksPagination
        :current-page="currentPage"
        :last-page="lastPage"
        :total="total"
        :per-page="perPage"
        @prev="prevPage"
        @next="nextPage"
      />
    </div>

    <!-- Modal -->
    <TaskModal
      :show="showModal"
      :editing="!!editingTask"
      :form="form"
      @submit="submitTask"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import LoadingIcon from '@/components/Base/LoadingIcon'
import { useTasks } from './Tasks'
import TasksHeader from './components/TasksHeader.vue'
import TasksFilters from './components/TasksFilters.vue'
import TasksEmptyState from './components/TasksEmptyState.vue'
import TasksList from './components/TasksList.vue'
import TasksPagination from './components/TasksPagination.vue'
import TaskModal from './components/TaskModal.vue'

const {
  tasks,
  loading,
  currentPage,
  perPage,
  total,
  lastPage,
  filters,
  showModal,
  editingTask,
  form,
  toggleComplete,
  deleteTask,
  submitTask,
  openCreateModal,
  openEditModal,
  closeModal,
  prevPage,
  nextPage,
  resetFilters
} = useTasks()
</script>