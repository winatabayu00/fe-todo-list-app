import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import debounce from 'lodash/debounce'
import ApiService from '@/core/services/ApiService'
import publicEndpoint from '@/constants/publicApi'
import type { ApiResponse } from '@/core/services/ApiService'

export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'done'
export type TaskPriority = 'urgent' | 'high' | 'normal' | 'low'

export interface Subtask {
  id: string
  title: string
  is_completed: boolean
  task_id?: string
  assignee_id?: string
  created_at?: string
  updated_at?: string
  deleted_at?: string
}

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  start_date?: string
  due_date?: string
  is_completed: boolean
  time_estimate?: number
  time_spent?: number
  time_remaining?: number
  order_column?: number
  assignee?: { id: string; name: string; email: string }
  creator?: { id: string; name: string }
  project?: { id: string; name: string }
  tags?: { id: string; name: string; color?: string }[]
  subtasks?: Subtask[]
  created_at?: string
  updated_at?: string
  deleted_at?: string
}

export interface TaskFilters {
  search: string
  status: string
  priority: string
}

const DEFAULT_PAGE_SIZE = 10
const FILTER_DEBOUNCE_MS = 500

// ─── Helper configs ───────────────────────────────────────────────────────────

export const STATUS_CONFIG: Record<TaskStatus, { label: string; badge: string; dot: string }> = {
  todo:        { label: 'Todo',        badge: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200',        dot: 'bg-slate-400' },
  in_progress: { label: 'In Progress', badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200',        dot: 'bg-amber-400' },
  in_review:   { label: 'In Review',   badge: 'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-200',    dot: 'bg-violet-400' },
  done:        { label: 'Done',        badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200', dot: 'bg-emerald-400' }
}

export const PRIORITY_CONFIG: Record<TaskPriority, { label: string; badge: string; icon: string }> = {
  urgent: { label: 'Urgent', badge: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200',             icon: '🔴' },
  high:   { label: 'High',   badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200', icon: '🟠' },
  normal: { label: 'Normal', badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200',         icon: '🔵' },
  low:    { label: 'Low',    badge: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',      icon: '🟢' }
}

export const formatStatus       = (s: TaskStatus)   => STATUS_CONFIG[s]?.label   || s
export const statusBadgeClass   = (s: TaskStatus)   => STATUS_CONFIG[s]?.badge   || ''
export const statusDotClass     = (s: TaskStatus)   => STATUS_CONFIG[s]?.dot     || ''
export const formatPriority     = (p: TaskPriority) => PRIORITY_CONFIG[p]?.label || p
export const priorityBadgeClass = (p: TaskPriority) => PRIORITY_CONFIG[p]?.badge || ''
export const priorityIcon       = (p: TaskPriority) => PRIORITY_CONFIG[p]?.icon  || ''

export const formatDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : ''

export const formatDateTime = (d?: string) =>
    d ? new Date(d).toLocaleString('id-ID') : ''

export const taskHelpers = {
  formatStatus, statusBadgeClass, statusDotClass,
  formatPriority, priorityBadgeClass, priorityIcon,
  formatDate, formatDateTime
}

/**
 * Safely extract task object from API response.
 * API detail endpoint wraps result: { payload: { data: Task } }
 * API list endpoint:                { payload: { data: Task[], ... } }
 * Fallback ke payload langsung jika tidak ada .data
 */
function unwrapTask(payload: any): Task {
  return payload?.data ?? payload
}

// ─── Composable ───────────────────────────────────────────────────────────────

export function useTasks() {
  const tasks        = ref<Task[]>([])
  const loading      = ref(false)
  const currentPage  = ref(1)
  const perPage      = ref(DEFAULT_PAGE_SIZE)
  const total        = ref(0)
  const lastPage     = ref(1)
  const filters      = ref<TaskFilters>({ search: '', status: '', priority: '' })

  const detailStack     = ref<string[]>([])
  const showDetailModal = ref(false)
  // Cache: taskId -> Task (reactive object, mutasi langsung agar subtask update bereaksi)
  const taskDetailCache = ref<Record<string, Task>>({})
  const detailLoading   = ref(false)
  const showCreateModal = ref(false)

  // ── API ──────────────────────────────────────────────────────────────────────

  async function fetchTasks() {
    loading.value = true
    try {
      const params: any = { page: currentPage.value, per_page: perPage.value }
      if (filters.value.search)   params.search              = filters.value.search
      if (filters.value.status)   params['filter[status]']   = filters.value.status
      if (filters.value.priority) params['filter[priority]'] = filters.value.priority

      const response = await ApiService.get({
        resource: publicEndpoint.tasks.list,
        params
      }) as ApiResponse<{ data: Task[]; current_page: number; last_page: number; total: number }>

      const payload     = response.payload
      tasks.value       = payload.data || []
      currentPage.value = payload.current_page
      lastPage.value    = payload.last_page
      total.value       = payload.total
    } catch (error) {
      console.error('Failed to fetch tasks', error)
    } finally {
      loading.value = false
    }
  }

  async function fetchTaskDetail(id: string) {
    detailLoading.value = true
    try {
      const response = await ApiService.get({
        resource: publicEndpoint.tasks.detail.replace(':id', id)
      }) as ApiResponse<any>

      // Response: { rc, payload: { data: Task } }
      taskDetailCache.value[id] = unwrapTask(response.payload)
    } catch (error) {
      console.error('Failed to fetch task detail', error)
    } finally {
      detailLoading.value = false
    }
  }

  async function toggleComplete(task: Task) {
    try {
      await ApiService.put({
        resource: publicEndpoint.tasks.update.replace(':id', task.id),
        params: { is_completed: !task.is_completed }
      })
      task.is_completed = !task.is_completed
      if (taskDetailCache.value[task.id]) {
        taskDetailCache.value[task.id].is_completed = task.is_completed
      }
    } catch (error) {
      console.error('Failed to toggle complete', error)
    }
  }

  async function deleteTask(id: string) {
    if (!confirm('Are you sure you want to delete this task?')) return
    try {
      await ApiService.delete({ resource: publicEndpoint.tasks.delete.replace(':id', id) })
      popDetailStack()
      await fetchTasks()
    } catch (error) {
      console.error('Failed to delete task', error)
    }
  }

  async function updateTask(taskId: string, data: Partial<Task>): Promise<Task> {
    try {
      const response = await ApiService.put({
        resource: publicEndpoint.tasks.update.replace(':id', taskId),
        params: data
      }) as ApiResponse<any>

      const updated = unwrapTask(response.payload)
      const index   = tasks.value.findIndex(t => t.id === taskId)
      if (index !== -1) tasks.value[index] = updated
      taskDetailCache.value[taskId] = updated
      return updated
    } catch (error) {
      console.error('Failed to update task', error)
      throw error
    }
  }

  async function addSubtask(parentTaskId: string, title: string): Promise<Subtask | null> {
    try {
      const response = await ApiService.post({
        resource: publicEndpoint.subtasks.create,
        params: { task_id: parentTaskId, title }
      }) as ApiResponse<any>

      const subtask: Subtask = (response.payload as any)?.data ?? response.payload

      // Patch cache lokal — mutasi langsung agar Vue reaktif
      if (taskDetailCache.value[parentTaskId]) {
        const parent = taskDetailCache.value[parentTaskId]
        if (!parent.subtasks) parent.subtasks = []
        // Hindari duplikat
        if (!parent.subtasks.find(s => s.id === subtask.id)) {
          parent.subtasks.push(subtask)
        }
      }
      return subtask
    } catch (error) {
      console.error('Failed to add subtask', error)
      return null
    }
  }

  async function toggleSubtask(parentTaskId: string, subtask: Subtask) {
    const prevValue = subtask.is_completed
    // Optimistic update
    subtask.is_completed = !subtask.is_completed
    try {
      await ApiService.put({
        resource: publicEndpoint.subtasks.toggle
            .replace(':taskId', parentTaskId)
            .replace(':subtaskId', subtask.id),
        params: { is_completed: subtask.is_completed }
      })
    } catch (error) {
      // Rollback
      subtask.is_completed = prevValue
      console.error('Failed to toggle subtask', error)
    }
  }

  // ── Modal / navigation ───────────────────────────────────────────────────────

  function openTaskDetail(taskId: string) {
    detailStack.value     = [taskId]
    showDetailModal.value = true
    fetchTaskDetail(taskId)
  }

  function popDetailStack() {
    if (detailStack.value.length > 1) {
      detailStack.value.pop()
    } else {
      closeDetailModal()
    }
  }

  function jumpToStackIndex(idx: number) {
    detailStack.value = detailStack.value.slice(0, idx + 1)
  }

  function closeDetailModal() {
    showDetailModal.value = false
    detailStack.value     = []
  }

  function openCreateModal()  { showCreateModal.value = true  }
  function closeCreateModal() { showCreateModal.value = false }

  // ── Pagination & filters ─────────────────────────────────────────────────────

  function prevPage() {
    if (currentPage.value > 1) { currentPage.value--; fetchTasks() }
  }
  function nextPage() {
    if (currentPage.value < lastPage.value) { currentPage.value++; fetchTasks() }
  }
  function resetFilters() {
    filters.value     = { search: '', status: '', priority: '' }
    currentPage.value = 1
    fetchTasks()
  }

  const debouncedFiltersHandler = debounce(() => { currentPage.value = 1; fetchTasks() }, FILTER_DEBOUNCE_MS)
  watch(
      [() => filters.value.search, () => filters.value.status, () => filters.value.priority],
      debouncedFiltersHandler
  )
  onBeforeUnmount(() => debouncedFiltersHandler.cancel())
  onMounted(() => fetchTasks())

  return {
    // state
    tasks, loading, currentPage, perPage, total, lastPage, filters,
    showDetailModal, showCreateModal, detailLoading,
    detailStack, taskDetailCache,
    // actions
    fetchTasks, fetchTaskDetail,
    toggleComplete, deleteTask, updateTask,
    addSubtask, toggleSubtask,
    openTaskDetail, popDetailStack, jumpToStackIndex, closeDetailModal,
    openCreateModal, closeCreateModal,
    prevPage, nextPage, resetFilters
  }
}