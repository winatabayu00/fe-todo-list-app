// src/pages/tags/Tags.ts
import { ref, watch, onMounted } from 'vue'
import ApiService from '@/core/services/ApiService'
import publicEndpoint from '@/constants/publicApi'
import type { ApiResponse } from '@/core/services/ApiService'

export interface Tag {
    id: string
    name: string
    color?: string
    workspace_id: string
    workspace?: { id: string; name: string }
    created_at: string
    updated_at: string
    deleted_at?: string
}

export function useTags() {
    const tags = ref<Tag[]>([])
    const loading = ref(false)
    const currentPage = ref(1)
    const perPage = ref(10)
    const total = ref(0)
    const lastPage = ref(1)

    const filters = ref({
        search: '',
        workspace_id: ''
    })

    const showModal = ref(false)
    const editingTag = ref<Tag | null>(null)
    const form = ref({
        name: '',
        color: '#3B82F6',
        workspace_id: ''
    })

    const workspaces = ref<{ id: string; name: string }[]>([])

    // Helpers
    const formatDate = (dateStr?: string) => {
        if (!dateStr) return ''
        return new Date(dateStr).toLocaleDateString()
    }

    async function fetchWorkspaces() {
        try {
            const response = await ApiService.get({ resource: publicEndpoint.workspaces.list }) as ApiResponse<{ data: { id: string; name: string }[] }>
            workspaces.value = response.payload.data || []
        } catch (error) {
            console.error('Failed to fetch workspaces', error)
        }
    }

    async function fetchTags() {
        loading.value = true
        try {
            const params: any = {
                page: currentPage.value,
                per_page: perPage.value
            }
            if (filters.value.search) params.search = filters.value.search
            if (filters.value.workspace_id) params['filter[workspace_id]'] = filters.value.workspace_id

            const response = await ApiService.get({
                resource: publicEndpoint.tags.list,
                params
            }) as ApiResponse<{ data: Tag[]; current_page: number; last_page: number; total: number }>

            const payload = response.payload
            tags.value = payload.data || []
            currentPage.value = payload.current_page
            lastPage.value = payload.last_page
            total.value = payload.total
        } catch (error) {
            console.error('Failed to fetch tags', error)
        } finally {
            loading.value = false
        }
    }

    async function submitTag() {
        try {
            if (editingTag.value) {
                await ApiService.put({
                    resource: publicEndpoint.tags.update.replace(':id', editingTag.value.id),
                    params: form.value
                })
            } else {
                await ApiService.post({
                    resource: publicEndpoint.tags.create,
                    params: form.value
                })
            }
            closeModal()
            await fetchTags()
        } catch (error) {
            console.error('Failed to save tag', error)
        }
    }

    async function deleteTag(id: string) {
        if (!confirm('Are you sure you want to delete this tag?')) return
        try {
            await ApiService.delete({ resource: publicEndpoint.tags.delete.replace(':id', id) })
            await fetchTags()
        } catch (error) {
            console.error('Failed to delete tag', error)
        }
    }

    async function restoreTag(id: string) {
        try {
            await ApiService.patch({ resource: publicEndpoint.tags.restore.replace(':id', id) })
            await fetchTags()
        } catch (error) {
            console.error('Failed to restore tag', error)
        }
    }

    function openCreateModal() {
        editingTag.value = null
        form.value = { name: '', color: '#3B82F6', workspace_id: workspaces.value[0]?.id || '' }
        showModal.value = true
    }

    function openEditModal(tag: Tag) {
        editingTag.value = tag
        form.value = {
            name: tag.name,
            color: tag.color || '#3B82F6',
            workspace_id: tag.workspace_id
        }
        showModal.value = true
    }

    function closeModal() {
        showModal.value = false
        editingTag.value = null
    }

    function prevPage() {
        if (currentPage.value > 1) { currentPage.value--; fetchTags() }
    }

    function nextPage() {
        if (currentPage.value < lastPage.value) { currentPage.value++; fetchTags() }
    }

    function resetFilters() {
        filters.value = { search: '', workspace_id: '' }
        currentPage.value = 1
        fetchTags()
    }

    watch(
        [() => filters.value.search, () => filters.value.workspace_id],
        () => { currentPage.value = 1; fetchTags() },
        { debounce: 500 }
    )

    onMounted(() => {
        fetchWorkspaces()
        fetchTags()
    })

    return {
        tags,
        loading,
        currentPage,
        perPage,
        total,
        lastPage,
        filters,
        showModal,
        editingTag,
        form,
        workspaces,
        formatDate,
        submitTag,
        deleteTag,
        restoreTag,
        openCreateModal,
        openEditModal,
        closeModal,
        prevPage,
        nextPage,
        resetFilters
    }
}