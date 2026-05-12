import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import debounce from 'lodash/debounce'
import ApiService from '@/core/services/ApiService'
import publicEndpoint from '@/constants/publicApi'
import type { ApiResponse } from '@/core/services/ApiService'

export type ProjectVisibility = 'private' | 'team' | 'public'

export interface Project {
  id: string
  name: string
  description?: string
  visibility: ProjectVisibility
  workspace_id: string
  created_by: string
  workspace?: { id: string; name: string }
  creator?: { id: string; name: string }
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface ProjectFilters {
  search: string
  workspace_id: string
  visibility: string
}

interface ProjectForm {
  name: string
  description: string
  visibility: ProjectVisibility
  workspace_id: string
}

export function useProjects() {
  // State
  const projects = ref<Project[]>([])
  const loading = ref(false)
  const currentPage = ref(1)
  const perPage = ref(10)
  const total = ref(0)
  const lastPage = ref(1)
  const filters = ref<ProjectFilters>({ search: '', workspace_id: '', visibility: '' })
  const workspaces = ref<{ id: string; name: string }[]>([])

  const showModal = ref(false)
  const editingProject = ref<Project | null>(null)
  const form = ref<ProjectForm>({
    name: '',
    description: '',
    visibility: 'private',
    workspace_id: ''
  })

  // Helpers
  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString()
  }

  const visibilityBadgeClass = (visibility: ProjectVisibility): string => {
    const classes: Record<ProjectVisibility, string> = {
      private: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      team: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      public: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    }
    return classes[visibility]
  }

  const visibilityLabel = (visibility: ProjectVisibility): string => {
    const labels: Record<ProjectVisibility, string> = {
      private: 'Private',
      team: 'Team',
      public: 'Public'
    }
    return labels[visibility]
  }

  // API Calls
  async function fetchProjects() {
    loading.value = true
    try {
      const params: any = {
        page: currentPage.value,
        per_page: perPage.value
      }
      if (filters.value.search) params.search = filters.value.search
      if (filters.value.workspace_id) params['filter[workspace_id]'] = filters.value.workspace_id
      if (filters.value.visibility) params['filter[visibility]'] = filters.value.visibility

      const response = await ApiService.get({
        resource: publicEndpoint.projects.list,
        params
      }) as ApiResponse<{ data: Project[]; current_page: number; last_page: number; total: number }>

      const payload = response.payload
      projects.value = payload.data || []
      currentPage.value = payload.current_page
      lastPage.value = payload.last_page
      total.value = payload.total
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    } finally {
      loading.value = false
    }
  }

  async function fetchWorkspaces() {
    try {
      const response = await ApiService.get({
        resource: publicEndpoint.workspaces.list
      }) as ApiResponse<{ data: { id: string; name: string }[] }>
      workspaces.value = response.payload.data || []
    } catch (error) {
      console.error('Failed to fetch workspaces:', error)
    }
  }

  async function submitProject() {
    try {
      if (editingProject.value) {
        await ApiService.put({
          resource: publicEndpoint.projects.update.replace(':id', editingProject.value.id),
          params: form.value
        })
      } else {
        await ApiService.post({
          resource: publicEndpoint.projects.create,
          params: form.value
        })
      }
      closeModal()
      await fetchProjects()
    } catch (error) {
      console.error('Failed to save project:', error)
      alert('Failed to save project.')
    }
  }

  async function deleteProject(id: string) {
    if (!confirm('Are you sure you want to delete this project?')) return
    try {
      await ApiService.delete({
        resource: publicEndpoint.projects.delete.replace(':id', id)
      })
      await fetchProjects()
    } catch (error) {
      console.error('Failed to delete project:', error)
    }
  }

  async function restoreProject(id: string) {
    try {
      await ApiService.patch({
        resource: publicEndpoint.projects.restore.replace(':id', id)
      })
      await fetchProjects()
    } catch (error) {
      console.error('Failed to restore project:', error)
    }
  }

  // Modal Handlers
  function openCreateModal() {
    editingProject.value = null
    form.value = { name: '', description: '', visibility: 'private', workspace_id: '' }
    showModal.value = true
  }

  function openEditModal(project: Project) {
    editingProject.value = project
    form.value = {
      name: project.name,
      description: project.description || '',
      visibility: project.visibility,
      workspace_id: project.workspace_id
    }
    showModal.value = true
  }

  function closeModal() {
    showModal.value = false
    editingProject.value = null
  }

  // Pagination & Filters
  function prevPage() {
    if (currentPage.value > 1) {
      currentPage.value--
      fetchProjects()
    }
  }

  function nextPage() {
    if (currentPage.value < lastPage.value) {
      currentPage.value++
      fetchProjects()
    }
  }

  function resetFilters() {
    filters.value = { search: '', workspace_id: '', visibility: '' }
    currentPage.value = 1
    fetchProjects()
  }

  // Watchers & Lifecycle
  const debouncedFiltersHandler = debounce(() => {
    currentPage.value = 1
    fetchProjects()
  }, 500)

  watch(
    [() => filters.value.search, () => filters.value.workspace_id, () => filters.value.visibility],
    debouncedFiltersHandler
  )

  onBeforeUnmount(() => {
    debouncedFiltersHandler.cancel()
  })

  onMounted(() => {
    fetchWorkspaces()
    fetchProjects()
  })

  return {
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
    fetchProjects,
    submitProject,
    deleteProject,
    restoreProject,
    openCreateModal,
    openEditModal,
    closeModal,
    prevPage,
    nextPage,
    resetFilters
  }
}