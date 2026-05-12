import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import debounce from 'lodash/debounce'
import ApiService from '@/core/services/ApiService'
import publicEndpoint from '@/constants/publicApi'
import type { ApiResponse } from '@/core/services/ApiService'

// Types & Constants
export type ProjectVisibility = 'private' | 'team' | 'public'

const VISIBILITY_CONFIG: Record<ProjectVisibility, { label: string; badge: string }> = {
  private: {
    label: 'Private',
    badge: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  },
  team: {
    label: 'Team',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  },
  public: {
    label: 'Public',
    badge: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  }
}

const DEFAULT_PAGE_SIZE = 10
const FILTER_DEBOUNCE_MS = 500

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

interface ApiProjectResponse {
  data: Project[]
  current_page: number
  last_page: number
  total: number
}

// Composable
export function useProjects() {
  // State
  const projects = ref<Project[]>([])
  const loading = ref(false)
  const currentPage = ref(1)
  const perPage = ref(DEFAULT_PAGE_SIZE)
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
  const formatDate = (dateStr?: string): string =>
    dateStr ? new Date(dateStr).toLocaleDateString() : ''

  const visibilityLabel = (visibility: ProjectVisibility): string =>
    VISIBILITY_CONFIG[visibility].label

  const visibilityBadgeClass = (visibility: ProjectVisibility): string =>
    VISIBILITY_CONFIG[visibility].badge

  const buildFilterParams = () => {
    const params: Record<string, any> = {
      page: currentPage.value,
      per_page: perPage.value
    }
    if (filters.value.search) params.search = filters.value.search
    if (filters.value.workspace_id) params['filter[workspace_id]'] = filters.value.workspace_id
    if (filters.value.visibility) params['filter[visibility]'] = filters.value.visibility
    return params
  }

  // API Calls
  async function fetchProjects() {
    loading.value = true
    try {
      const response = await ApiService.get({
        resource: publicEndpoint.projects.list,
        params: buildFilterParams()
      }) as ApiResponse<ApiProjectResponse>

      const { data, current_page, last_page, total: totalCount } = response.payload
      projects.value = data || []
      currentPage.value = current_page
      lastPage.value = last_page
      total.value = totalCount
    } catch (error) {
      console.error('Failed to fetch projects:', error)
      projects.value = []
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
      workspaces.value = []
    }
  }

  async function submitProject() {
    try {
      const endpoint = editingProject.value
        ? publicEndpoint.projects.update.replace(':id', editingProject.value.id)
        : publicEndpoint.projects.create
      const method = editingProject.value ? 'put' : 'post'

      await ApiService[method]({ resource: endpoint, params: form.value })
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
  }, FILTER_DEBOUNCE_MS)

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