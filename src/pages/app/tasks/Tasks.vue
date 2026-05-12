<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-6 px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="w-full mb-8">
      <div class="relative bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
        <div class="relative flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold">Tasks</h1>
            <p class="text-blue-100 mt-1">Manage and track all your tasks</p>
          </div>
          <button
              @click="openCreateModal"
              class="px-4 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition flex items-center gap-2"
          >
            <Plus class="h-4 w-4" />
            New Task
          </button>
        </div>
      </div>
    </div>

    <!-- Filters & Search -->
    <div class="bg-white rounded-2xl shadow p-4 mb-6">
      <div class="flex flex-wrap gap-4 items-end">
        <div class="flex-1 min-w-[200px]">
          <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
              v-model="filters.search"
              type="text"
              placeholder="Search by title..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select v-model="filters.status" class="px-3 py-2 border border-gray-300 rounded-lg">
            <option value="">All</option>
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="in_review">In Review</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select v-model="filters.priority" class="px-3 py-2 border border-gray-300 rounded-lg">
            <option value="">All</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>
        </div>
        <button
            @click="resetFilters"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
          Reset
        </button>
      </div>
    </div>

    <!-- Task List -->
    <div class="bg-white rounded-2xl shadow overflow-hidden">
      <div v-if="loading" class="p-8 text-center">Loading tasks...</div>
      <div v-else-if="tasks.length === 0" class="p-8 text-center text-gray-500">No tasks found.</div>
      <div v-else class="divide-y divide-gray-200">
        <div v-for="task in tasks" :key="task.id" class="p-4 hover:bg-gray-50 transition">
          <div class="flex items-start gap-4">
            <input
                type="checkbox"
                :checked="task.is_completed"
                @change="toggleComplete(task)"
                class="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div class="flex-1">
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="font-medium text-gray-900" :class="{ 'line-through text-gray-400': task.is_completed }">
                  {{ task.title }}
                </h3>
                <span :class="statusBadgeClass(task.status)" class="px-2 py-0.5 rounded text-xs font-medium">
                  {{ formatStatus(task.status) }}
                </span>
                <span :class="priorityBadgeClass(task.priority)" class="px-2 py-0.5 rounded text-xs font-medium">
                  {{ formatPriority(task.priority) }}
                </span>
              </div>
              <p v-if="task.description" class="text-sm text-gray-500 mt-1">{{ task.description }}</p>
              <div class="flex items-center gap-4 mt-2 text-xs text-gray-400">
                <span v-if="task.due_date" class="flex items-center gap-1">
                  <Calendar class="h-3 w-3" />
                  Due: {{ formatDate(task.due_date) }}
                </span>
                <span v-if="task.assignee?.name">Assignee: {{ task.assignee.name }}</span>
                <span>Project: {{ task.project?.name || '-' }}</span>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button @click="openEditModal(task)" class="text-blue-600 hover:text-blue-800">
                <Edit class="h-4 w-4" />
              </button>
              <button @click="deleteTask(task.id)" class="text-red-600 hover:text-red-800">
                <Trash2 class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
        <div class="text-sm text-gray-500">
          Showing {{ (currentPage - 1) * perPage + 1 }} to {{ Math.min(currentPage * perPage, total) }} of {{ total }}
        </div>
        <div class="flex gap-2">
          <button
              @click="prevPage"
              :disabled="currentPage === 1"
              class="px-3 py-1 border rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <button
              @click="nextPage"
              :disabled="currentPage === lastPage"
              class="px-3 py-1 border rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl w-full max-w-md p-6">
        <h2 class="text-xl font-bold mb-4">{{ editingTask ? 'Edit Task' : 'Create New Task' }}</h2>
        <form @submit.prevent="submitTask">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
                v-model="form.title"
                type="text"
                required
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea v-model="form.description" rows="3" class="w-full px-3 py-2 border rounded-lg"></textarea>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select v-model="form.status" class="w-full px-3 py-2 border rounded-lg">
              <option value="todo">Todo</option>
              <option value="in_progress">In Progress</option>
              <option value="in_review">In Review</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select v-model="form.priority" class="w-full px-3 py-2 border rounded-lg">
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input v-model="form.due_date" type="date" class="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Project ID (Optional)</label>
            <input v-model="form.project_id" type="text" placeholder="Project UUID" class="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div class="flex justify-end gap-3 mt-6">
            <button type="button" @click="closeModal" class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus, Edit, Trash2, Calendar } from 'lucide-vue-next'
import { useTasks } from './Tasks'

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
  formatStatus,
  formatPriority,
  formatDate,
  statusBadgeClass,
  priorityBadgeClass,
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