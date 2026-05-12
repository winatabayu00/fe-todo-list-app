<template>
  <div class="py-6 px-4 sm:px-6 lg:px-8">
    <!-- Header Section -->
    <div class="flex flex-wrap items-center justify-between pb-6 mb-6 border-b border-gray-200 dark:border-darkmode-400">
      <div>
        <h2 class="text-2xl font-medium text-gray-800 dark:text-slate-200">Projects</h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-slate-400">Manage all your projects</p>
      </div>
      <Button variant="primary" @click="openCreateModal">
        <Lucide icon="Plus" class="w-4 h-4 mr-2" />
        New Project
      </Button>
    </div>

    <!-- Filters Section -->
    <div class="mb-6">
      <div class="flex flex-col gap-4 sm:flex-row">
        <FormInput
          v-model="filters.search"
          type="text"
          placeholder="Search projects..."
          class="flex-1"
        />
        <select
          v-model="filters.workspace_id"
          class="w-64 px-3 py-2 border border-gray-300 rounded-lg dark:bg-darkmode-600 dark:border-darkmode-400"
        >
          <option value="">All Workspaces</option>
          <option v-for="ws in workspaces" :key="ws.id" :value="ws.id">{{ ws.name }}</option>
        </select>
        <select
          v-model="filters.visibility"
          class="w-40 px-3 py-2 border border-gray-300 rounded-lg dark:bg-darkmode-600 dark:border-darkmode-400"
        >
          <option value="">All Visibility</option>
          <option value="private">Private</option>
          <option value="team">Team</option>
          <option value="public">Public</option>
        </select>
        <Button variant="outline-secondary" @click="resetFilters">Reset</Button>
      </div>
    </div>

    <!-- Content Section -->
    <div>
      <LoadingIcon v-if="loading" icon="puff" class="mx-auto" />
      <EmptyState v-else-if="projects.length === 0" @create="openCreateModal" />
      <ProjectsGrid v-else :projects="projects" @edit="openEditModal" @delete="deleteProject" @restore="restoreProject" />
    </div>

    <!-- Pagination Section -->
    <PaginationControls
      v-if="!loading && projects.length"
      :current-page="currentPage"
      :last-page="lastPage"
      :total="total"
      :per-page="perPage"
      @prev="prevPage"
      @next="nextPage"
    />

    <!-- Create/Edit Modal -->
    <ProjectModal
      :show="showModal"
      :editing="!!editingProject"
      :form="form"
      :workspaces="workspaces"
      @submit="submitProject"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/Base/Button'
import FormInput from '@/components/Base/Form/FormInput.vue'
import LoadingIcon from '@/components/Base/LoadingIcon'
import Lucide from '@/components/Base/Lucide/Lucide.vue'
import { useProjects } from './Projects'
import EmptyState from './components/EmptyState.vue'
import ProjectsGrid from './components/ProjectsGrid.vue'
import PaginationControls from './components/PaginationControls.vue'
import ProjectModal from './components/ProjectModal.vue'

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