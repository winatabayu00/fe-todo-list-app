import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Workspace } from '@/pages/app/workspace/Workspaces'

export const useWorkspaceStore = defineStore('workspace', () => {
  // State
  const workspaces = ref<Workspace[]>([])
  const currentWorkspace = ref<Workspace | null>(null)
  const selectedWorkspaceId = ref<string | null>(localStorage.getItem('selectedWorkspaceId'))

  // Computed
  const hasWorkspaces = computed(() => workspaces.value.length > 0)
  const workspaceById = computed(() => (id: string) => workspaces.value.find(w => w.id === id))

  // Actions
  function setWorkspaces(items: Workspace[]) {
    workspaces.value = items
    if (items.length > 0 && !currentWorkspace.value) {
      switchWorkspace(items[0].id)
    }
  }

  function switchWorkspace(workspaceId: string) {
    const workspace = workspaces.value.find(w => w.id === workspaceId)
    if (workspace) {
      currentWorkspace.value = workspace
      selectedWorkspaceId.value = workspaceId
      localStorage.setItem('selectedWorkspaceId', workspaceId)
    }
  }

  function addWorkspace(workspace: Workspace) {
    if (!workspaces.value.find(w => w.id === workspace.id)) {
      workspaces.value.push(workspace)
    }
  }

  function removeWorkspace(workspaceId: string) {
    const index = workspaces.value.findIndex(w => w.id === workspaceId)
    if (index > -1) {
      workspaces.value.splice(index, 1)
      if (currentWorkspace.value?.id === workspaceId && workspaces.value.length > 0) {
        switchWorkspace(workspaces.value[0].id)
      }
    }
  }

  function updateWorkspace(workspaceId: string, updates: Partial<Workspace>) {
    const workspace = workspaces.value.find(w => w.id === workspaceId)
    if (workspace) {
      Object.assign(workspace, updates)
      if (currentWorkspace.value?.id === workspaceId) {
        currentWorkspace.value = { ...currentWorkspace.value, ...updates }
      }
    }
  }

  function clearWorkspaces() {
    workspaces.value = []
    currentWorkspace.value = null
    selectedWorkspaceId.value = null
    localStorage.removeItem('selectedWorkspaceId')
  }

  return {
    workspaces,
    currentWorkspace,
    selectedWorkspaceId,
    hasWorkspaces,
    workspaceById,
    setWorkspaces,
    switchWorkspace,
    addWorkspace,
    removeWorkspace,
    updateWorkspace,
    clearWorkspaces
  }
})