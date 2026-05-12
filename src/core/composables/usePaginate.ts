import { ref } from 'vue'
import { debounce } from 'lodash-es'

interface PaginationPayload {
  data: any[]
  current_page: number
  per_page: number
  total: number
  last_page: number
  next_page_url?: string | null
  first_page_url?: string
  from?: number
  to?: number
  path?: string
  links?: Array<{ url: string | null, label: string, active: boolean }>
  prev_page_url?: string | null
}

interface PaginateResponse {
  payload: PaginationPayload
}

export default function usePaginate() {
  const items = ref<any[]>([])
  const page = ref(1)
  const perPage = ref(30)
  const total = ref(0)
  const finished = ref(false)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const reset = () => {
    items.value = []
    page.value = 1
    finished.value = false
    error.value = null
  }

  const setError = (message: string) => {
    error.value = message
  }

  const clearError = () => {
    error.value = null
  }

  const paginate = async (fetchFn: Function, isReset = false) => {
    if (loading.value) return

    loading.value = true
    clearError()

    if (isReset) reset()

    try {
      const res = await fetchFn(page.value) as PaginateResponse

      if (!res?.payload) {
        setError('Invalid API response: missing payload')
        return []
      }

      const payload = res.payload

      // Validate required fields
      if (!Array.isArray(payload.data)) {
        setError('Invalid API response: data must be an array')
        return []
      }

      // Update pagination state
      page.value = payload.current_page
      perPage.value = payload.per_page
      total.value = payload.total

      // Append or replace
      if (page.value === 1 || isReset) {
        items.value = payload.data
      } else {
        items.value = [...items.value, ...payload.data]
      }

      // Detect last page
      if (!payload.next_page_url || payload.current_page >= payload.last_page) {
        finished.value = true
      } else {
        page.value = payload.current_page + 1
      }

      return payload.data
    } catch (err: any) {
      setError(err.message || 'Failed to load data')
      return []
    } finally {
      loading.value = false
    }
  }

  /**
   * Append next page (infinite scroll)
   */
  const loadMore = async (fetchFn: Function) => {
    if (loading.value || finished.value) return

    loading.value = true
    clearError()

    try {
      const res = await fetchFn() as PaginateResponse
      const payload = res?.payload

      if (!payload) {
        setError('Invalid API response: missing payload')
        return []
      }

      if (!Array.isArray(payload.data)) {
        setError('Invalid API response: data must be an array')
        return []
      }

      // Append new items
      items.value.push(...payload.data)

      // Update pagination state
      page.value = payload.current_page + 1
      perPage.value = payload.per_page
      total.value = payload.total

      // Stop when last page
      if (!payload.next_page_url || payload.current_page >= payload.last_page) {
        finished.value = true
      }

      return payload.data
    } catch (err: any) {
      setError(err.message || 'Failed to load more data')
      return []
    } finally {
      loading.value = false
    }
  }

  /**
   * Search with debounce (for search inputs)
   */
  const search = debounce(async (fetchFn: Function, query: string) => {
    reset()
    return await paginate(fetchFn, true)
  }, 500)

  /**
   * Refresh current page
   */
  const refresh = async (fetchFn: Function) => {
    const currentPage = page.value
    reset()
    page.value = currentPage
    return await paginate(fetchFn, true)
  }

  /**
   * Check if there are items
   */
  const hasItems = () => items.value.length > 0

  /**
   * Get item count
   */
  const itemCount = () => items.value.length

  return {
    // State
    items,
    page,
    perPage,
    total,
    finished,
    loading,
    error,

    // Actions
    paginate,
    loadMore,
    search,
    refresh,
    reset,
    clearError,
    setError,

    // Getters
    hasItems,
    itemCount
  }
}