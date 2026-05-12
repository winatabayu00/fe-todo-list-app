<template>
  <div class="py-6 px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="w-full mb-8">
      <div class="relative bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
        <div class="relative flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold">Projects</h1>
            <p class="text-blue-100 mt-1">Manage all your projects</p>
          </div>
          <Button variant="primary" @click="openCreateModal">
            <Plus class="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>
    </div>

    <!-- Filters & Search -->
    <div class="bg-white rounded-xl shadow-md p-4 mb-6">
      <div class="flex flex-wrap gap-4 items-end">
        <div class="flex-1 min-w-[200px]">
          <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <FormInput
              v-model="filters.search"
              type="text"
              placeholder="Search by name or description..."
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Workspace</label>
          <select v-model="filters.workspace_id" class="px-3 py-2 border rounded-lg">
            <option value="">All</option>
            <!-- We'll need a list of workspaces here; can be fetched separately -->
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
          <select v-model="filters.visibility" class="px-3 py-2 border rounded-lg">
            <option value="">All</option>
            <option value="private">Private</option>
            <option value="team">Team</option>
            <option value="public">Public</option>
          </select>
        </div>
        <Button variant="secondary" @click="resetFilters">
          Reset
        </Button>
      </div>
    </div>

    <!-- Project List -->
    <div class="bg-white rounded-xl shadow overflow-hidden">
      <div v-if="loading" class="p-8 text-center">Loading projects...</div>
      <div v-else-if="projects.length === 0" class="p-8 text-center text-gray-500">No projects found.</div>
      <div v-else class="divide-y divide-gray-200">
        <div v-for="proj in projects" :key="proj.id" class="p-4 hover:bg-gray-50 transition">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="font-medium text-gray-900">{{ proj.name }}</h3>
                <span :class="visibilityBadgeClass(proj.visibility)" class="px-2 py-0.5 rounded text-xs font-medium">
                  {{ visibilityLabel(proj.visibility) }}
                </span>
              </div>
              <p v-if="proj.description" class="text-sm text-gray-500 mt-1">{{ proj.description }}</p>
              <div class="flex items-center gap-4 mt-2 text-xs text-gray-400">
                <span>Workspace: {{ proj.workspace?.name || '-' }}</span>
                <span>Created: {{ formatDate(proj.created_at) }}</span>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button @click="openEditModal(proj)" class="text-blue-600 hover:text-blue-800">
                <Edit class="h-4 w-4" />
              </button>
              <button v-if="!proj.deleted_at" @click="deleteProject(proj.id)" class="text-red-600 hover:text-red-800">
                <Trash2 class="h-4 w-4" />
              </button>
              <button v-if="proj.deleted_at" @click="restoreProject(proj.id)" class="text-green-600 hover:text-green-800">
                <RefreshCw class="h-4 w-4" />
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

    <!-- Modal (Create/Edit) -->
    <Dialog :open="showModal" @close="closeModal">
      <Dialog.Panel class="w-full max-w-md p-6">
        <Dialog.Title class="text-lg font-bold mb-4">
          {{ editingProject ? 'Edit Project' : 'Create Project' }}
        </Dialog.Title>
        <form @submit.prevent="submitProject">
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Name *</label>
            <FormInput v-model="form.name" type="text" required />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Description</label>
            <textarea v-model="form.description" rows="3" class="w-full border rounded-lg px-3 py-2"></textarea>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Visibility</label>
            <select v-model="form.visibility" class="w-full border rounded-lg px-3 py-2">
              <option value="private">Private</option>
              <option value="team">Team</option>
              <option value="public">Public</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Workspace ID</label>
            <FormInput v-model="form.workspace_id" type="text" placeholder="UUID of workspace" required />
          </div>
          <div class="flex justify-end gap-3 mt-6">
            <Button variant="secondary" @click="closeModal">Cancel</Button>
            <Button type="submit" variant="primary">Save</Button>
          </div>
        </form>
      </Dialog.Panel>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { Plus, Edit, Trash2, RefreshCw } from 'lucide-vue-next'
import Button from '@/components/Base/Button'
import { FormInput } from '@/components/Base/Form'
import { Dialog } from '@/components/Base/Headless'
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