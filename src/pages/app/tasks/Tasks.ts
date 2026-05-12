import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import debounce from 'lodash/debounce'
import ApiService from '@/core/services/ApiService'
import publicEndpoint from '@/constants/publicApi'
import type { ApiResponse } from '@/core/services/ApiService'

export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'done'
export type TaskPriority = 'urgent' | 'high' | 'normal' | 'low'

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

export function useTasks() {
  // State
  const tasks = ref<Task[]>([])
  const loading = ref(false)
  const currentPage = ref(1)
  const perPage = ref(10)
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
  const formatStatus = (status: TaskStatus): string => {
    const map: Record<TaskStatus, string> = {
      todo: 'Todo',
      in_progress: 'In Progress',
      in_review: 'In Review',
      done: 'Done'
    }
    return map[status] || status
  }

  const formatPriority = (priority: TaskPriority): string => {
    const map: Record<TaskPriority, string> = {
      urgent: 'Urgent',
      high: 'High',
      normal: 'Normal',
      low: 'Low'
    }
    return map[priority] || priority
  }

  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString()
  }

  const statusBadgeClass = (status: TaskStatus): string => {
    const classes: Record<TaskStatus, string> = {
      todo: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      in_progress: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      in_review: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      done: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    }
    return classes[status]
  }

  const priorityBadgeClass = (priority: TaskPriority): string => {
    const classes: Record<TaskPriority, string> = {
      urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      normal: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    }
    return classes[priority]
  }

  // API Calls
  async function fetchTasks() {
    loading.value = true
    try {
      const params: any = {
        page: currentPage.value,
        per_page: perPage.value
      }
      if (filters.value.search) params.search = filters.value.search
      if (filters.value.status) params['filter[status]'] = filters.value.status
      if (filters.value.priority) params['filter[priority]'] = filters.value.priority

      const response = await ApiService.get({
        resource: publicEndpoint.tasks.list,
        params
      }) as ApiResponse<{ data: Task[]; current_page: number; last_page: number; total: number }>

      const payload = response.payload
      tasks.value = payload.data || []
      currentPage.value = payload.current_page
      lastPage.value = payload.last_page
      total.value = payload.total
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
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
      if (editingTask.value) {
        await ApiService.put({
          resource: publicEndpoint.tasks.update.replace(':id', editingTask.value.id),
          params: form.value
        })
      } else {
        await ApiService.post({
          resource: publicEndpoint.tasks.create,
          params: form.value
        })
      }
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
  }, 500)

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
  }
}