<template>
  <div class="py-6">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between pb-6 mb-6 border-b border-gray-200">
      <div>
        <h2 class="text-2xl font-medium">Tags</h2>
        <div class="mt-1 text-sm text-gray-600">Manage tags to organize tasks</div>
      </div>
      <Button variant="primary" @click="openCreateModal">
        <Lucide icon="Plus" class="w-4 h-4 mr-2" />
        New Tag
      </Button>
    </div>

    <!-- Filters -->
    <div class="mb-6">
      <div class="flex flex-col gap-4 sm:flex-row">
        <div class="flex-1">
          <FormInput
              v-model="filters.search"
              type="text"
              placeholder="Search tags..."
              class="w-full"
          />
        </div>
        <div class="w-64">
          <select
              v-model="filters.workspace_id"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Workspaces</option>
            <option v-for="ws in workspaces" :key="ws.id" :value="ws.id">{{ ws.name }}</option>
          </select>
        </div>
        <Button variant="outline-secondary" @click="resetFilters">Reset</Button>
      </div>
    </div>

    <!-- Tags Grid -->
    <div>
      <LoadingIcon v-if="loading" class="mx-auto" />
      <div v-else-if="tags.length === 0" class="text-center text-gray-500 py-8">No tags found.</div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div v-for="tag in tags" :key="tag.id" class="bg-white rounded-lg shadow-md p-4 border border-gray-100 hover:shadow-lg transition">
          <div class="flex justify-between items-start">
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 rounded-full" :style="{ backgroundColor: tag.color }"></div>
              <h3 class="font-medium text-gray-900">{{ tag.name }}</h3>
            </div>
            <div class="flex gap-1">
              <button @click="openEditModal(tag)" class="text-blue-500 hover:text-blue-700" title="Edit">
                <Lucide icon="Edit" class="w-4 h-4" />
              </button>
              <button v-if="!tag.deleted_at" @click="deleteTag(tag.id)" class="text-red-500 hover:text-red-700" title="Delete">
                <Lucide icon="Trash2" class="w-4 h-4" />
              </button>
              <button v-if="tag.deleted_at" @click="restoreTag(tag.id)" class="text-green-500 hover:text-green-700" title="Restore">
                <Lucide icon="RefreshCw" class="w-4 h-4" />
              </button>
            </div>
          </div>
          <div class="mt-2 text-sm text-gray-500">
            Workspace: {{ tag.workspace?.name || '-' }}
          </div>
          <div class="mt-1 text-xs text-gray-400">
            Created: {{ formatDate(tag.created_at) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between mt-6">
      <div class="text-sm text-gray-500">
        Showing {{ (currentPage - 1) * perPage + 1 }} to {{ Math.min(currentPage * perPage, total) }} of {{ total }}
      </div>
      <div class="flex gap-2">
        <Button variant="outline-secondary" :disabled="currentPage === 1" @click="prevPage">Previous</Button>
        <Button variant="outline-secondary" :disabled="currentPage === lastPage" @click="nextPage">Next</Button>
      </div>
    </div>

    <!-- Modal Create/Edit -->
    <Modal :show="showModal" :title="editingTag ? 'Edit Tag' : 'Create Tag'" size="md" @close="closeModal">
      <form @submit.prevent="submitTag">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Name *</label>
          <FormInput v-model="form.name" type="text" required class="w-full" />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Color</label>
          <div class="flex items-center gap-2">
            <FormInput v-model="form.color" type="color" class="w-16 h-10 p-1" />
            <span class="text-sm text-gray-500">{{ form.color }}</span>
          </div>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Workspace *</label>
          <select
              v-model="form.workspace_id"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option v-for="ws in workspaces" :key="ws.id" :value="ws.id">{{ ws.name }}</option>
          </select>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <Button type="button" variant="outline-secondary" @click="closeModal">Cancel</Button>
          <Button type="submit" variant="primary">Save</Button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/Base/Button'
import FormInput from '@/components/Base/Form/FormInput.vue'
import LoadingIcon from '@/components/Base/LoadingIcon'
import Lucide from '@/components/Base/Lucide/Lucide.vue'
import Modal from '@/components/Core/Modal/Modal.vue'
import { useTags } from './Tags'

const {
  tags,
  loading,
  currentPage,
  perPage,
  total,
  lastPage,
  filters,
  showModal,
  editingTag,
  form,
  workspaces,
  formatDate,
  submitTag,
  deleteTag,
  restoreTag,
  openCreateModal,
  openEditModal,
  closeModal,
  prevPage,
  nextPage,
  resetFilters
} = useTags()
</script>