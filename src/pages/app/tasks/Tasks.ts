import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import debounce from 'lodash/debounce'
import ApiService from '@/core/services/ApiService'
import publicEndpoint from '@/constants/publicApi'
import type { ApiResponse } from '@/core/services/ApiService'

// Types & Constants
export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'done'
export type TaskPriority = 'urgent' | 'high' | 'normal' | 'low'

const STATUS_CONFIG: Record<TaskStatus, { label: string; badge: string }> = {
  todo: {
    label: 'Todo',
    badge: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  },
  in_progress: {
    label: 'In Progress',
    badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  },
  in_review: {
    label: 'In Review',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  },
  done: {
    label: 'Done',
    badge: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  }
}

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; badge: string }> = {
  urgent: {
    label: 'Urgent',
    badge: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  },
  high: {
    label: 'High',
    badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
  },
  normal: {
    label: 'Normal',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  },
  low: {
    label: 'Low',
    badge: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  }
}

const DEFAULT_PAGE_SIZE = 10
const FILTER_DEBOUNCE_MS = 500

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  due_date?: string
  is_completed: boolean
  assignee?: { id: string; name: string }
  project?: { id: string; name: string }
}

export interface TaskFilters {
  search: string
  status: string
  priority: string
}

interface TaskForm {
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  due_date: string
  project_id: string
}

interface ApiTaskResponse {
  data: Task[]
  current_page: number
  last_page: number
  total: number
}

// Composable
export function useTasks() {
  // State
  const tasks = ref<Task[]>([])
  const loading = ref(false)
  const currentPage = ref(1)
  const perPage = ref(DEFAULT_PAGE_SIZE)
  const total = ref(0)
  const lastPage = ref(1)
  const filters = ref<TaskFilters>({ search: '', status: '', priority: '' })
  const showModal = ref(false)
  const editingTask = ref<Task | null>(null)
  const form = ref<TaskForm>({
    title: '',
    description: '',
    status: 'todo',
    priority: 'normal',
    due_date: '',
    project_id: ''
  })

  // Helpers
  const formatStatus = (status: TaskStatus): string => STATUS_CONFIG[status].label
  const statusBadgeClass = (status: TaskStatus): string => STATUS_CONFIG[status].badge

  const formatPriority = (priority: TaskPriority): string => PRIORITY_CONFIG[priority].label
  const priorityBadgeClass = (priority: TaskPriority): string => PRIORITY_CONFIG[priority].badge

  const formatDate = (dateStr?: string): string =>
    dateStr ? new Date(dateStr).toLocaleDateString() : ''

  const buildFilterParams = () => {
    const params: Record<string, any> = {
      page: currentPage.value,
      per_page: perPage.value
    }
    if (filters.value.search) params.search = filters.value.search
    if (filters.value.status) params['filter[status]'] = filters.value.status
    if (filters.value.priority) params['filter[priority]'] = filters.value.priority
    return params
  }

  // API Calls
  async function fetchTasks() {
    loading.value = true
    try {
      const response = await ApiService.get({
        resource: publicEndpoint.tasks.list,
        params: buildFilterParams()
      }) as ApiResponse<ApiTaskResponse>

      const { data, current_page, last_page, total: totalCount } = response.payload
      tasks.value = data || []
      currentPage.value = current_page
      lastPage.value = last_page
      total.value = totalCount
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
      tasks.value = []
    } finally {
      loading.value = false
    }
  }

  async function toggleComplete(task: Task) {
    try {
      await ApiService.put({
        resource: publicEndpoint.tasks.update.replace(':id', task.id),
        params: { is_completed: !task.is_completed }
      })
      task.is_completed = !task.is_completed
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  }

  async function deleteTask(id: string) {
    if (!confirm('Are you sure you want to delete this task?')) return
    try {
      await ApiService.delete({
        resource: publicEndpoint.tasks.delete.replace(':id', id)
      })
      await fetchTasks()
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }

  async function submitTask() {
    try {
      const endpoint = editingTask.value
        ? publicEndpoint.tasks.update.replace(':id', editingTask.value.id)
        : publicEndpoint.tasks.create
      const method = editingTask.value ? 'put' : 'post'

      await ApiService[method]({ resource: endpoint, params: form.value })
      closeModal()
      await fetchTasks()
    } catch (error) {
      console.error('Failed to save task:', error)
      alert('Failed to save task.')
    }
  }

  // Modal Handlers
  function openCreateModal() {
    editingTask.value = null
    form.value = {
      title: '',
      description: '',
      status: 'todo',
      priority: 'normal',
      due_date: '',
      project_id: ''
    }
    showModal.value = true
  }

  function openEditModal(task: Task) {
    editingTask.value = task
    form.value = {
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      due_date: task.due_date || '',
      project_id: task.project?.id || ''
    }
    showModal.value = true
  }

  function closeModal() {
    showModal.value = false
    editingTask.value = null
  }

  // Pagination & Filters
  function prevPage() {
    if (currentPage.value > 1) {
      currentPage.value--
      fetchTasks()
    }
  }

  function nextPage() {
    if (currentPage.value < lastPage.value) {
      currentPage.value++
      fetchTasks()
    }
  }

  function resetFilters() {
    filters.value = { search: '', status: '', priority: '' }
    currentPage.value = 1
    fetchTasks()
  }

  // Watchers & Lifecycle
  const debouncedFiltersHandler = debounce(() => {
    currentPage.value = 1
    fetchTasks()
  }, FILTER_DEBOUNCE_MS)

  watch(
    [() => filters.value.search, () => filters.value.status, () => filters.value.priority],
    debouncedFiltersHandler
  )

  onBeforeUnmount(() => {
    debouncedFiltersHandler.cancel()
  })

  onMounted(() => {
    fetchTasks()
  })

  return {
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
    statusBadgeClass,
    formatPriority,
    priorityBadgeClass,
    formatDate,
    toggleComplete,
    deleteTask,
    submitTask,
    openCreateModal,
    openEditModal,
    closeModal,
    prevPage,
    nextPage,
    resetFilters
  }
}