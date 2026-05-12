<template>
  <Modal :show="show" :title="editing ? 'Edit Project' : 'Create Project'" size="md" @close="$emit('close')">
    <form @submit.prevent="$emit('submit')">
      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Name *</label>
        <FormInput v-model="form.name" type="text" required class="w-full" />
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Description</label>
        <FormTextarea v-model="form.description" rows="3" class="w-full" />
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Visibility</label>
        <select v-model="form.visibility" class="w-full px-3 py-2 border rounded-lg dark:bg-darkmode-600">
          <option value="private">Private</option>
          <option value="team">Team</option>
          <option value="public">Public</option>
        </select>
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Workspace</label>
        <select v-model="form.workspace_id" required class="w-full px-3 py-2 border rounded-lg dark:bg-darkmode-600">
          <option v-for="ws in workspaces" :key="ws.id" :value="ws.id">{{ ws.name }}</option>
        </select>
      </div>
      <div class="flex justify-end gap-3 mt-6">
        <Button variant="outline-secondary" @click="$emit('close')">Cancel</Button>
        <Button type="submit" variant="primary">Save</Button>
      </div>
    </form>
  </Modal>
</template>

<script setup lang="ts">
import Button from '@/components/Base/Button'
import FormInput from '@/components/Base/Form/FormInput.vue'
import FormTextarea from '@/components/Base/Form/FormTextarea.vue'
import Modal from '@/components/Core/Modal/Modal.vue'
import type { ProjectForm } from '../Projects'

defineProps<{
  show: boolean
  editing: boolean
  form: ProjectForm
  workspaces: { id: string; name: string }[]
}>()

defineEmits<{
  submit: []
  close: []
}>()
</script>

