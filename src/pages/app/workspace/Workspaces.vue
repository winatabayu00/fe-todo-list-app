<template>
  <div class="py-6 px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between pb-6 mb-6 border-b border-gray-200 dark:border-darkmode-400">
      <div>
        <h2 class="text-2xl font-medium text-gray-800 dark:text-slate-200">Workspaces</h2>
        <div class="mt-1 text-sm text-gray-500 dark:text-slate-400">Manage all your workspaces and team members</div>
      </div>
      <Button variant="primary" @click="openCreateModal">
        <Lucide icon="Plus" class="w-4 h-4 mr-2" />
        New Workspace
      </Button>
    </div>

    <!-- Filters -->
    <div class="mb-6">
      <div class="flex flex-col gap-4 sm:flex-row">
        <div class="flex-1">
          <FormInput v-model="filters.search" type="text" placeholder="Search workspaces..." class="w-full" />
        </div>
        <Button variant="outline-secondary" @click="resetFilters">Reset</Button>
      </div>
    </div>

    <!-- Workspace Grid -->
    <div>
      <LoadingIcon v-if="loading" icon="puff" class="mx-auto" />
      <div v-else-if="workspaces.length === 0" class="text-center py-16">
        <div class="mx-auto w-24 h-24 bg-slate-100 dark:bg-darkmode-400 rounded-full flex items-center justify-center mb-4">
          <Lucide icon="Files" class="w-10 h-10 text-slate-400" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">No workspaces yet</h3>
        <p class="text-gray-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
          Create your first workspace to start organizing projects and tasks.
        </p>
        <Button variant="primary" class="mt-6" @click="openCreateModal">
          <Lucide icon="Plus" class="w-4 h-4 mr-2" />
          Create Workspace
        </Button>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
            v-for="ws in workspaces"
            :key="ws.id"
            class="bg-white dark:bg-darkmode-600 rounded-xl border border-gray-200 dark:border-darkmode-400 p-5 hover:shadow-md transition-shadow"
        >
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ ws.name }}</h3>
              <p class="text-sm text-gray-500 dark:text-slate-400 mt-1 line-clamp-2">{{ ws.description || 'No description' }}</p>
            </div>
            <div class="flex gap-1">
              <button @click="openEditModal(ws)" class="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400" title="Edit">
                <Lucide icon="Edit" class="w-4 h-4" />
              </button>
              <button
                  v-if="!ws.deleted_at"
                  @click="deleteWorkspace(ws.id)"
                  class="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                  title="Delete"
              >
                <Lucide icon="Trash2" class="w-4 h-4" />
              </button>
              <button
                  v-if="ws.deleted_at"
                  @click="restoreWorkspace(ws.id)"
                  class="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400"
                  title="Restore"
              >
                <Lucide icon="RefreshCw" class="w-4 h-4" />
              </button>
              <button @click="openMembersModal(ws)" class="p-1 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400" title="Members">
                <Lucide icon="Users" class="w-4 h-4" />
              </button>
            </div>
          </div>
          <div class="mt-4 flex items-center text-xs text-gray-400 dark:text-slate-500">
            <span>Owner: {{ ws.owner?.name || '-' }}</span>
            <span class="mx-2">•</span>
            <span>Created: {{ formatDate(ws.created_at) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="!loading && workspaces.length" class="flex items-center justify-between mt-6">
      <div class="text-sm text-gray-500">
        Showing {{ (currentPage - 1) * perPage + 1 }} to {{ Math.min(currentPage * perPage, total) }} of {{ total }}
      </div>
      <div class="flex gap-2">
        <Button variant="outline-secondary" :disabled="currentPage === 1" @click="prevPage">Previous</Button>
        <Button variant="outline-secondary" :disabled="currentPage === lastPage" @click="nextPage">Next</Button>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <Modal :show="showModal" :title="editingWorkspace ? 'Edit Workspace' : 'Create Workspace'" size="md" @close="closeModal">
      <form @submit.prevent="submitWorkspace">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Name *</label>
          <FormInput v-model="form.name" type="text" required class="w-full" />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Description</label>
          <FormTextarea v-model="form.description" rows="3" class="w-full" />
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <Button variant="outline-secondary" @click="closeModal">Cancel</Button>
          <Button type="submit" variant="primary">Save</Button>
        </div>
      </form>
    </Modal>

    <!-- Members Modal -->
    <Modal :show="showMembersModal" :title="`Members - ${selectedWorkspace?.name}`" size="lg" @close="closeMembersModal">
      <div v-if="membersLoading" class="text-center py-4">Loading members...</div>
      <div v-else>
        <ul class="divide-y divide-gray-200 dark:divide-darkmode-400 max-h-96 overflow-y-auto">
          <li v-for="member in members" :key="member.id" class="py-3 flex items-center justify-between">
            <div>
              <p class="font-medium text-gray-900 dark:text-white">{{ member.name }}</p>
              <p class="text-sm text-gray-500 dark:text-slate-400">{{ member.email }}</p>
            </div>
            <button @click="removeMember(selectedWorkspace.id, member.id)" class="text-red-500 hover:text-red-700" title="Remove">
              <Lucide icon="UserMinus" class="w-4 h-4" />
            </button>
          </li>
          <li v-if="members.length === 0" class="py-4 text-center text-gray-500">No members found.</li>
        </ul>
        <div class="mt-4 pt-4 border-t border-gray-200 dark:border-darkmode-400">
          <div class="flex gap-2">
            <FormInput v-model="newMemberId" type="text" placeholder="User ID (UUID)" class="flex-1" />
            <Button variant="primary" :disabled="!newMemberId" @click="handleAddMember">Add</Button>
          </div>
          <p class="text-xs text-gray-500 mt-2">Enter a valid user UUID (from the database).</p>
        </div>
      </div>
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
import { useWorkspaces } from './Workspaces'

const {
  workspaces,
  loading,
  currentPage,
  perPage,
  total,
  lastPage,
  filters,
  showModal,
  editingWorkspace,
  form,
  showMembersModal,
  selectedWorkspace,
  members,
  membersLoading,
  newMemberId,
  formatDate,
  submitWorkspace,
  deleteWorkspace,
  restoreWorkspace,
  openCreateModal,
  openEditModal,
  closeModal,
  openMembersModal,
  closeMembersModal,
  removeMember,
  handleAddMember,
  prevPage,
  nextPage,
  resetFilters
} = useWorkspaces()
</script>