// src/pages/time-tracking/TimeTracking.ts
import { ref, watch, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import ApiService from '@/core/services/ApiService'
import publicEndpoint from '@/constants/publicApi'
import type { ApiResponse } from '@/core/services/ApiService'

export interface TimeLog {
    id: string
    minutes: number
    description?: string
    created_at: string
    user?: { id: string; name: string; email: string }
}

export interface Task {
    id: string
    title: string
    time_spent: number
    time_estimate?: number
}

export function useTimeTracking() {
    const route = useRoute()
    const taskId = computed(() => route.params.taskId as string)

    const task = ref<Task | null>(null)
    const timeLogs = ref<TimeLog[]>([])
    const loading = ref(false)
    const totalMinutes = ref(0)
    const totalHours = ref(0)

    const showLogModal = ref(false)
    const logForm = ref({
        minutes: 30,
        description: ''
    })
    const isSubmitting = ref(false)

    const showEstimateModal = ref(false)
    const estimateForm = ref({
        minutes: 0
    })

    // Fetch task details
    async function fetchTask() {
        if (!taskId.value) return
        try {
            const response = await ApiService.get({
                resource: publicEndpoint.tasks.detail.replace(':id', taskId.value)
            }) as ApiResponse<Task>
            task.value = response.payload
            totalMinutes.value = task.value.time_spent
            totalHours.value = Math.round(task.value.time_spent / 60 * 10) / 10
        } catch (error) {
            console.error('Failed to fetch task', error)
        }
    }

    // Fetch time logs
    async function fetchTimeLogs() {
        if (!taskId.value) return
        loading.value = true
        try {
            const response = await ApiService.get({
                resource: publicEndpoint.timeTracking.logs.replace(':taskId', taskId.value)
            }) as ApiResponse<TimeLog[]>
            timeLogs.value = response.payload || []
        } catch (error) {
            console.error('Failed to fetch time logs', error)
        } finally {
            loading.value = false
        }
    }

    // Log time
    async function submitLog() {
        if (!taskId.value) return
        isSubmitting.value = true
        try {
            await ApiService.post({
                resource: publicEndpoint.timeTracking.log.replace(':taskId', taskId.value),
                params: logForm.value
            })
            await Promise.all([fetchTask(), fetchTimeLogs()])
            closeLogModal()
        } catch (error) {
            console.error('Failed to log time', error)
        } finally {
            isSubmitting.value = false
        }
    }

    // Update time estimate
    async function updateEstimate() {
        if (!taskId.value) return
        try {
            await ApiService.put({
                resource: publicEndpoint.timeTracking.estimate.replace(':taskId', taskId.value),
                params: { minutes: estimateForm.value.minutes }
            })
            await fetchTask()
            closeEstimateModal()
        } catch (error) {
            console.error('Failed to update estimate', error)
        }
    }

    // Modal handlers
    function openLogModal() {
        logForm.value = { minutes: 30, description: '' }
        showLogModal.value = true
    }

    function closeLogModal() {
        showLogModal.value = false
    }

    function openEstimateModal() {
        estimateForm.value.minutes = task.value?.time_estimate || 0
        showEstimateModal.value = true
    }

    function closeEstimateModal() {
        showEstimateModal.value = false
    }

    // Format helpers
    const formatMinutes = (minutes: number) => {
        if (minutes < 60) return `${minutes} min`
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        return mins ? `${hours}h ${mins}m` : `${hours}h`
    }

    const formatDate = (dateStr: string) => {
        if (!dateStr) return ''
        return new Date(dateStr).toLocaleString()
    }

    onMounted(() => {
        fetchTask()
        fetchTimeLogs()
    })

    return {
        task,
        timeLogs,
        loading,
        totalMinutes,
        totalHours,
        showLogModal,
        logForm,
        isSubmitting,
        showEstimateModal,
        estimateForm,
        formatMinutes,
        formatDate,
        submitLog,
        updateEstimate,
        openLogModal,
        closeLogModal,
        openEstimateModal,
        closeEstimateModal
    }
}