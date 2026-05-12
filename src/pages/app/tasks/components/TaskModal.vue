<template>
  <div v-if="show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl w-full max-w-md p-6">
      <h2 class="text-xl font-bold mb-4">{{ editing ? 'Edit Task' : 'Create New Task' }}</h2>
      <form @submit.prevent="$emit('submit')">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input
            v-model="form.title"
            type="text"
            required
            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea v-model="form.description" rows="3" class="w-full px-3 py-2 border rounded-lg"></textarea>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select v-model="form.status" class="w-full px-3 py-2 border rounded-lg">
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="in_review">In Review</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select v-model="form.priority" class="w-full px-3 py-2 border rounded-lg">
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
          <input v-model="form.due_date" type="date" class="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Project ID (Optional)</label>
          <input
            v-model="form.project_id"
            type="text"
            placeholder="Project UUID"
            class="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button type="button" @click="$emit('close')" class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
            Cancel
          </button>
          <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TaskForm } from '../Tasks'

defineProps<{
  show: boolean
  editing: boolean
  form: TaskForm
}>()

defineEmits<{
  submit: []
  close: []
}>()
</script>
