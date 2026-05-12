// src/pages/workspaces/Workspaces.ts
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import debounce from 'lodash/debounce'
import ApiService from '@/core/services/ApiService'
import publicEndpoint from '@/constants/publicApi'
import type { ApiResponse } from '@/core/services/ApiService'

export interface Workspace {
    id: string
    name: string
    description?: string
    owner_id: string
    owner?: { id: string; name: string; email: string }
    members?: Array<{ id: string; name: string; email: string }>
    created_at: string
    updated_at: string
    deleted_at?: string
}

export function useWorkspaces() {
    const workspaces = ref<Workspace[]>([])
    const loading = ref(false)
    const currentPage = ref(1)
    const perPage = ref(10)
    const total = ref(0)
    const lastPage = ref(1)

    const filters = ref({
        search: '',
        owner_id: '',
        member_id: ''
    })

    const showModal = ref(false)
    const editingWorkspace = ref<Workspace | null>(null)
    const form = ref({
        name: '',
        description: ''
    })

    const showMembersModal = ref(false)
    const selectedWorkspace = ref<Workspace | null>(null)
    const members = ref<{ id: string; name: string; email: string }[]>([])
    const membersLoading = ref(false)

    // Helper functions
    const formatDate = (dateStr?: string) => {
        if (!dateStr) return ''
        return new Date(dateStr).toLocaleDateString()
    }

    // API calls
    async function fetchWorkspaces() {
        loading.value = true
        try {
            const params: any = {
                page: currentPage.value,
                per_page: perPage.value
            }
            if (filters.value.search) params.search = filters.value.search
            if (filters.value.owner_id) params['filter[owner_id]'] = filters.value.owner_id
            if (filters.value.member_id) params['filter[member_id]'] = filters.value.member_id

            const response = await ApiService.get({
                resource: publicEndpoint.workspaces.list,
                params
            }) as ApiResponse<{ data: Workspace[]; current_page: number; last_page: number; total: number }>

            const payload = response.payload
            workspaces.value = payload.data || []
            currentPage.value = payload.current_page
            lastPage.value = payload.last_page
            total.value = payload.total
        } catch (error) {
            console.error('Failed to fetch workspaces', error)
        } finally {
            loading.value = false
        }
    }

    async function fetchMembers(workspace: Workspace) {
        membersLoading.value = true
        try {
            const response = await ApiService.get({
                resource: publicEndpoint.workspaces.members.replace(':id', workspace.id)
            }) as ApiResponse<{ data: { id: string; name: string; email: string }[] }>
            members.value = response.payload.data || []
        } catch (error) {
            console.error('Failed to fetch members', error)
        } finally {
            membersLoading.value = false
        }
    }

    async function addMember(workspaceId: string, userId: string) {
        try {
            // Jika backend memiliki endpoint POST /workspaces/:id/members, gunakan itu.
            // Sementara kita asumsikan ada endpoint. Jika tidak, kita bisa menggunakan sync endpoint via update? Tapi lebih baik buat endpoint sendiri.
            // Karena di backend belum ada route untuk add member, kita akan menggunakan update workspace dengan members field? Tidak, lebih tepat endpoint terpisah.
            // Untuk sementara, kita lewati dulu fitur add member, karena backend belum menyediakan.
            console.warn('Add member endpoint not yet implemented in backend. Skipping.')
        } catch (error) {
            console.error('Failed to add member', error)
        }
    }

    async function removeMember(workspaceId: string, userId: string) {
        try {
            await ApiService.delete({
                resource: publicEndpoint.workspaces.memberRemove
                    .replace(':id', workspaceId)
                    .replace(':userId', userId)
            })
            // Refresh members
            if (selectedWorkspace.value) {
                await fetchMembers(selectedWorkspace.value)
            }
        } catch (error) {
            console.error('Failed to remove member', error)
        }
    }

    async function submitWorkspace() {
        try {
            if (editingWorkspace.value) {
                await ApiService.put({
                    resource: publicEndpoint.workspaces.update.replace(':id', editingWorkspace.value.id),
                    params: form.value
                })
            } else {
                await ApiService.post({
                    resource: publicEndpoint.workspaces.create,
                    params: form.value
                })
            }
            closeModal()
            await fetchWorkspaces()
        } catch (error) {
            console.error('Failed to save workspace', error)
        }
    }

    async function deleteWorkspace(id: string) {
        if (!confirm('Are you sure you want to delete this workspace?')) return
        try {
            await ApiService.delete({
                resource: publicEndpoint.workspaces.delete.replace(':id', id)
            })
            await fetchWorkspaces()
        } catch (error) {
            console.error('Failed to delete workspace', error)
        }
    }

    async function restoreWorkspace(id: string) {
        try {
            await ApiService.patch({
                resource: publicEndpoint.workspaces.restore.replace(':id', id)
            })
            await fetchWorkspaces()
        } catch (error) {
            console.error('Failed to restore workspace', error)
        }
    }

    // Modal handlers
    function openCreateModal() {
        editingWorkspace.value = null
        form.value = { name: '', description: '' }
        showModal.value = true
    }

    function openEditModal(workspace: Workspace) {
        editingWorkspace.value = workspace
        form.value = {
            name: workspace.name,
            description: workspace.description || ''
        }
        showModal.value = true
    }

    function closeModal() {
        showModal.value = false
        editingWorkspace.value = null
    }

    function openMembersModal(workspace: Workspace) {
        selectedWorkspace.value = workspace
        fetchMembers(workspace)
        showMembersModal.value = true
    }

    function closeMembersModal() {
        showMembersModal.value = false
        selectedWorkspace.value = null
        members.value = []
    }

    // Pagination
    function prevPage() {
        if (currentPage.value > 1) {
            currentPage.value--
            fetchWorkspaces()
        }
    }

    function nextPage() {
        if (currentPage.value < lastPage.value) {
            currentPage.value++
            fetchWorkspaces()
        }
    }

    function resetFilters() {
        filters.value = { search: '', owner_id: '', member_id: '' }
        currentPage.value = 1
        fetchWorkspaces()
    }

    // Watchers
    const debouncedFiltersHandler = debounce(() => {
        currentPage.value = 1
        fetchWorkspaces()
    }, 500)

    watch(
        [() => filters.value.search, () => filters.value.owner_id, () => filters.value.member_id],
        debouncedFiltersHandler
    )

    onBeforeUnmount(() => {
        debouncedFiltersHandler.cancel()
    })

    onMounted(() => {
        fetchWorkspaces()
    })

    return {
        // State
        workspaces,
        loading,
        currentPage,
        perPage,
        total,
        lastPage,
        filters,
        showModal,
        editingWorkspace,
        form,
        showMembersModal,
        selectedWorkspace,
        members,
        membersLoading,
        // Helpers
        formatDate,
        // Actions
        fetchWorkspaces,
        submitWorkspace,
        deleteWorkspace,
        restoreWorkspace,
        openCreateModal,
        openEditModal,
        closeModal,
        openMembersModal,
        closeMembersModal,
        removeMember,
        prevPage,
        nextPage,
        resetFilters
    }
}