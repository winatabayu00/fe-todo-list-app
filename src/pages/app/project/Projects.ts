// src/pages/projects/Projects.ts
import { ref, watch, onMounted } from 'vue'
import ApiService from '@/core/services/ApiService'
import publicEndpoint from '@/constants/publicApi'
import type { ApiResponse } from '@/core/services/ApiService'

export interface Project {
    id: string
    name: string
    description?: string
    visibility: 'private' | 'team' | 'public'
    workspace_id: string
    created_by: string
    workspace?: { id: string; name: string }
    creator?: { id: string; name: string }
    created_at: string
    updated_at: string
    deleted_at?: string
}

export function useProjects() {
    const projects = ref<Project[]>([])
    const loading = ref(false)
    const currentPage = ref(1)
    const perPage = ref(10)
    const total = ref(0)
    const lastPage = ref(1)

    const filters = ref({
        search: '',
        workspace_id: '',
        visibility: ''
    })

    const showModal = ref(false)
    const editingProject = ref<Project | null>(null)
    const form = ref({
        name: '',
        description: '',
        visibility: 'private' as 'private' | 'team' | 'public',
        workspace_id: ''
    })

    // Helper functions
    const formatDate = (dateStr?: string) => {
        if (!dateStr) return ''
        return new Date(dateStr).toLocaleDateString()
    }

    const visibilityBadgeClass = (visibility: string) => {
        switch (visibility) {
            case 'private': return 'bg-gray-100 text-gray-800'
            case 'team': return 'bg-blue-100 text-blue-800'
            case 'public': return 'bg-green-100 text-green-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const visibilityLabel = (visibility: string) => {
        switch (visibility) {
            case 'private': return 'Private'
            case 'team': return 'Team'
            case 'public': return 'Public'
            default: return visibility
        }
    }

    // API calls
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
            console.error('Failed to fetch projects', error)
        } finally {
            loading.value = false
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
            console.error('Failed to save project', error)
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
            console.error('Failed to delete project', error)
        }
    }

    async function restoreProject(id: string) {
        try {
            await ApiService.patch({
                resource: publicEndpoint.projects.restore.replace(':id', id)
            })
            await fetchProjects()
        } catch (error) {
            console.error('Failed to restore project', error)
        }
    }

    // Modal handlers
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

    // Pagination
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

    // Watchers
    watch(
        [() => filters.value.search, () => filters.value.workspace_id, () => filters.value.visibility],
        () => {
            currentPage.value = 1
            fetchProjects()
        },
        { debounce: 500 }
    )

    onMounted(() => {
        fetchProjects()
    })

    return {
        // State
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
        // Helpers
        formatDate,
        visibilityBadgeClass,
        visibilityLabel,
        // Actions
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