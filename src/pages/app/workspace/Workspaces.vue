<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-6 px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="w-full mb-8">
      <div class="relative bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
        <div class="relative flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold">Workspaces</h1>
            <p class="text-blue-100 mt-1">Manage all your workspaces</p>
          </div>
          <button
              @click="openCreateModal"
              class="px-4 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition flex items-center gap-2"
          >
            <Plus class="h-4 w-4" />
            New Workspace
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
              placeholder="Search by name or description..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
            @click="resetFilters"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Reset
        </button>
      </div>
    </div>

    <!-- Workspace List -->
    <div class="bg-white rounded-2xl shadow overflow-hidden">
      <div v-if="loading" class="p-8 text-center">Loading workspaces...</div>
      <div v-else-if="workspaces.length === 0" class="p-8 text-center text-gray-500">No workspaces found.</div>
      <div v-else class="divide-y divide-gray-200">
        <div v-for="ws in workspaces" :key="ws.id" class="p-4 hover:bg-gray-50 transition">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="font-medium text-gray-900">{{ ws.name }}</h3>
              <p v-if="ws.description" class="text-sm text-gray-500 mt-1">{{ ws.description }}</p>
              <div class="flex items-center gap-4 mt-2 text-xs text-gray-400">
                <span>Owner: {{ ws.owner?.name || '-' }}</span>
                <span>Created: {{ formatDate(ws.created_at) }}</span>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button @click="openMembersModal(ws)" class="text-indigo-600 hover:text-indigo-800">
                <Users class="h-4 w-4" />
              </button>
              <button @click="openEditModal(ws)" class="text-blue-600 hover:text-blue-800">
                <Edit class="h-4 w-4" />
              </button>
              <button v-if="!ws.deleted_at" @click="deleteWorkspace(ws.id)" class="text-red-600 hover:text-red-800">
                <Trash2 class="h-4 w-4" />
              </button>
              <button v-if="ws.deleted_at" @click="restoreWorkspace(ws.id)" class="text-green-600 hover:text-green-800">
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

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl w-full max-w-md p-6">
        <h2 class="text-xl font-bold mb-4">{{ editingWorkspace ? 'Edit Workspace' : 'Create Workspace' }}</h2>
        <form @submit.prevent="submitWorkspace">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
                v-model="form.name"
                type="text"
                required
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea v-model="form.description" rows="3" class="w-full px-3 py-2 border rounded-lg"></textarea>
          </div>
          <div class="flex justify-end gap-3 mt-6">
            <button type="button" @click="closeModal" class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Members Modal -->
    <div v-if="showMembersModal && selectedWorkspace" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl w-full max-w-md p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">Members - {{ selectedWorkspace.name }}</h2>
          <button @click="closeMembersModal" class="text-gray-500 hover:text-gray-700">
            <X class="h-5 w-5" />
          </button>
        </div>
        <div v-if="membersLoading" class="text-center py-4">Loading members...</div>
        <div v-else>
          <ul class="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            <li v-for="member in members" :key="member.id" class="py-3 flex items-center justify-between">
              <div>
                <p class="font-medium">{{ member.name }}</p>
                <p class="text-sm text-gray-500">{{ member.email }}</p>
              </div>
              <button
                  @click="removeMember(selectedWorkspace.id, member.id)"
                  class="text-red-600 hover:text-red-800"
              >
                <UserMinus class="h-4 w-4" />
              </button>
            </li>
            <li v-if="members.length === 0" class="py-4 text-center text-gray-500">No members found.</li>
          </ul>
          <!-- Add member button (akan diimplementasikan jika backend tersedia) -->
          <div class="mt-4 pt-4 border-t">
            <button
                @click="addMember(selectedWorkspace.id, 'temp')"
                class="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Member (preview)
            </button>
            <p class="text-xs text-gray-400 mt-2">Note: Endpoint for adding member is not yet implemented.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus, Edit, Trash2, RefreshCw, Users, X, UserMinus } from 'lucide-vue-next'
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
  prevPage,
  nextPage,
  resetFilters
} = useWorkspaces()

// Dummy add member (backend belum ada)
const addMember = (workspaceId: string, userId: string) => {
  alert('Add member feature coming soon. Backend endpoint needed.')
}
</script>