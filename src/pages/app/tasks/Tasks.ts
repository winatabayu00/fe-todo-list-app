import { ref, watch, onMounted } from 'vue'
import ApiService from '@/core/services/ApiService'
import publicEndpoint from '@/constants/publicApi'
import type { ApiResponse } from '@/core/services/ApiService'

export interface Task {
  id: string
  title: string
  description?: string
  status: string
  priority: string
  due_date?: string
  is_completed: boolean
  assignee?: { id: string; name: string }
  project?: { id: string; name: string }
}

export function useTasks() {
  const tasks = ref<Task[]>([])
  const loading = ref(false)
  const currentPage = ref(1)
  const perPage = ref(10)
  const total = ref(0)
  const lastPage = ref(1)

  const filters = ref({
    search: '',
    status: '',
    priority: ''
  })

  const showModal = ref(false)
  const editingTask = ref<Task | null>(null)
  const form = ref({
    title: '',
    description: '',
    status: 'todo',
    priority: 'normal',
    due_date: '',
    project_id: ''
  })

  // Helper functions
  const formatStatus = (status: string) => {
    const map: Record<string, string> = {
      todo: 'Todo',
      in_progress: 'In Progress',
      in_review: 'In Review',
      done: 'Done'
    }
    return map[status] || status
  }

  const formatPriority = (priority: string) => {
    const map: Record<string, string> = {
      urgent: 'Urgent',
      high: 'High',
      normal: 'Normal',
      low: 'Low'
    }
    return map[priority] || priority
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString()
  }

  const statusBadgeClass = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-800'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800'
      case 'in_review': return 'bg-blue-100 text-blue-800'
      case 'done': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const priorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'normal': return 'bg-blue-100 text-blue-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
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
      console.error('Failed to fetch tasks', error)
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
      console.error('Failed to update task', error)
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
      console.error('Failed to delete task', error)
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
      console.error('Failed to save task', error)
    }
  }

  // Modal handlers
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

  // Pagination
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

  // Watchers
  watch(
      [() => filters.value.search, () => filters.value.status, () => filters.value.priority],
      () => {
        currentPage.value = 1
        fetchTasks()
      },
      { debounce: 500 } // Gunakan lodash atau implementasi manual
  )

  onMounted(() => {
    fetchTasks()
  })

  return {
    // State
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
    // Helpers
    formatStatus,
    formatPriority,
    formatDate,
    statusBadgeClass,
    priorityBadgeClass,
    // Actions
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