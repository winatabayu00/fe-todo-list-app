<template>
  <div class="py-6 px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between pb-6 mb-6 border-b border-gray-200 dark:border-darkmode-400">
      <div>
        <h2 class="text-2xl font-medium text-gray-800 dark:text-slate-200">Projects</h2>
        <div class="mt-1 text-sm text-gray-500 dark:text-slate-400">Manage all your projects</div>
      </div>
      <Button variant="primary" @click="openCreateModal">
        <Lucide icon="Plus" class="w-4 h-4 mr-2" />
        New Project
      </Button>
    </div>

    <!-- Filters -->
    <div class="mb-6">
      <div class="flex flex-col gap-4 sm:flex-row">
        <div class="flex-1">
          <FormInput v-model="filters.search" type="text" placeholder="Search projects..." class="w-full" />
        </div>
        <div class="w-64">
          <select v-model="filters.workspace_id" class="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-darkmode-600 dark:border-darkmode-400">
            <option value="">All Workspaces</option>
            <option v-for="ws in workspaces" :key="ws.id" :value="ws.id">{{ ws.name }}</option>
          </select>
        </div>
        <div class="w-40">
          <select v-model="filters.visibility" class="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-darkmode-600 dark:border-darkmode-400">
            <option value="">All</option>
            <option value="private">Private</option>
            <option value="team">Team</option>
            <option value="public">Public</option>
          </select>
        </div>
        <Button variant="outline-secondary" @click="resetFilters">Reset</Button>
      </div>
    </div>

    <!-- Projects Grid -->
    <div>
      <LoadingIcon v-if="loading" class="mx-auto" />
      <div v-else-if="projects.length === 0" class="text-center py-16">
        <div class="mx-auto w-24 h-24 bg-slate-100 dark:bg-darkmode-400 rounded-full flex items-center justify-center mb-4">
          <Lucide icon="Folder" class="w-10 h-10 text-slate-400" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">No projects yet</h3>
        <p class="text-gray-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
          Create your first project to start organizing tasks.
        </p>
        <Button variant="primary" class="mt-6" @click="openCreateModal">
          <Lucide icon="Plus" class="w-4 h-4 mr-2" />
          Create Project
        </Button>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
            v-for="proj in projects"
            :key="proj.id"
            class="bg-white dark:bg-darkmode-600 rounded-xl border border-gray-200 dark:border-darkmode-400 p-5 hover:shadow-md transition-shadow"
        >
          <div class="flex justify-between items-start">
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ proj.name }}</h3>
                <span :class="visibilityBadgeClass(proj.visibility)" class="text-xs px-2 py-0.5 rounded-full font-medium">
                  {{ visibilityLabel(proj.visibility) }}
                </span>
              </div>
              <p class="text-sm text-gray-500 dark:text-slate-400 mt-1 line-clamp-2">{{ proj.description || 'No description' }}</p>
            </div>
            <div class="flex gap-1">
              <button @click="openEditModal(proj)" class="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400" title="Edit">
                <Lucide icon="Edit" class="w-4 h-4" />
              </button>
              <button
                  v-if="!proj.deleted_at"
                  @click="deleteProject(proj.id)"
                  class="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                  title="Delete"
              >
                <Lucide icon="Trash2" class="w-4 h-4" />
              </button>
              <button
                  v-if="proj.deleted_at"
                  @click="restoreProject(proj.id)"
                  class="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400"
                  title="Restore"
              >
                <Lucide icon="RefreshCw" class="w-4 h-4" />
              </button>
            </div>
          </div>
          <div class="mt-4 flex items-center text-xs text-gray-400 dark:text-slate-500">
            <span>Workspace: {{ proj.workspace?.name || '-' }}</span>
            <span class="mx-2">•</span>
            <span>Created: {{ formatDate(proj.created_at) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="!loading && projects.length" class="flex items-center justify-between mt-6">
      <div class="text-sm text-gray-500">
        Showing {{ (currentPage - 1) * perPage + 1 }} to {{ Math.min(currentPage * perPage, total) }} of {{ total }}
      </div>
      <div class="flex gap-2">
        <Button variant="outline-secondary" :disabled="currentPage === 1" @click="prevPage">Previous</Button>
        <Button variant="outline-secondary" :disabled="currentPage === lastPage" @click="nextPage">Next</Button>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <Modal :show="showModal" :title="editingProject ? 'Edit Project' : 'Create Project'" size="md" @close="closeModal">
      <form @submit.prevent="submitProject">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Name *</label>
          <FormInput v-model="form.name" type="text" required class="w-full" />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Description</label>
          <FormTextarea v-model="form.description" rows="3" class="w-full" />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Visibility</label>
          <select v-model="form.visibility" class="w-full px-3 py-2 border rounded-lg dark:bg-darkmode-600">
            <option value="private">Private</option>
            <option value="team">Team</option>
            <option value="public">Public</option>
          </select>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Workspace</label>
          <select v-model="form.workspace_id" required class="w-full px-3 py-2 border rounded-lg dark:bg-darkmode-600">
            <option v-for="ws in workspaces" :key="ws.id" :value="ws.id">{{ ws.name }}</option>
          </select>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <Button variant="outline-secondary" @click="closeModal">Cancel</Button>
          <Button type="submit" variant="primary">Save</Button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/Base/Button'
import FormInput from '@/components/Base/Form/FormInput.vue'
import FormTextarea from '@/components/Base/Form/FormTextarea.vue'
import LoadingIcon from '@/components/Base/LoadingIcon'
import Lucide from '@/components/Base/Lucide/Lucide.vue'
import Modal from '@/components/Core/Modal/Modal.vue'
import { useProjects } from './Projects'

const {
  projects,
  loading,
  currentPage,
  perPage,
  total,
  lastPage,
  filters,
  showModal,
  editingProject,
  form,
  workspaces,
  formatDate,
  visibilityBadgeClass,
  visibilityLabel,
  submitProject,
  deleteProject,
  restoreProject,
  openCreateModal,
  openEditModal,
  closeModal,
  prevPage,
  nextPage,
  resetFilters
} = useProjects()
</script>