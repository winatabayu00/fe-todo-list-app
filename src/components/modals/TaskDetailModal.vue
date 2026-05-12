<template>
  <Modal :show="show" size="lg" @close="emit('close')">
    <div class="p-6">
      <div class="flex justify-between items-start">
        <h2 class="text-xl font-bold">Task Details</h2>
        <button @click="emit('close')">✕</button>
      </div>
      <div class="mt-4">
        <!-- Editable Title -->
        <input v-model="task.title" class="text-lg font-semibold w-full border-b border-gray-200 focus:outline-none" />

        <div class="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label class="text-xs text-gray-400">Status</label>
            <select v-model="task.status" class="block w-full mt-1 border rounded-md">
              <option>todo</option><option>in_progress</option><option>done</option>
            </select>
          </div>
          <div>
            <label class="text-xs text-gray-400">Priority</label>
            <select v-model="task.priority" class="block w-full mt-1 border rounded-md">
              <option>low</option><option>normal</option><option>high</option><option>urgent</option>
            </select>
          </div>
        </div>

        <div class="mt-4">
          <label class="text-xs text-gray-400">Description</label>
          <textarea v-model="task.description" rows="4" class="w-full border rounded-md p-2"></textarea>
        </div>

        <!-- Checklist -->
        <div class="mt-4">
          <h4 class="font-medium">Checklist</h4>
          <div v-for="(item, idx) in task.checklist" :key="idx" class="flex items-center gap-2">
            <input type="checkbox" v-model="item.completed" />
            <span>{{ item.text }}</span>
          </div>
          <button class="text-indigo-600 text-sm mt-2">+ Add item</button>
        </div>

        <!-- Comments (simulated) -->
        <div class="mt-4">
          <h4 class="font-medium">Comments</h4>
          <div class="space-y-2 max-h-48 overflow-y-auto">
            <div v-for="comment in task.comments" :key="comment.id" class="bg-gray-50 p-2 rounded">
              <p class="text-sm">{{ comment.text }}</p>
              <p class="text-xs text-gray-400">{{ comment.author }} • {{ comment.time }}</p>
            </div>
          </div>
          <textarea placeholder="Write a comment..." class="w-full border rounded-md p-2 mt-2"></textarea>
        </div>

        <!-- Activity Timeline -->
        <div class="mt-4">
          <h4 class="font-medium">Activity</h4>
          <div v-for="act in task.activities" :key="act.id" class="text-xs text-gray-500 flex gap-2 py-1 border-t">
            <Lucide :icon="act.icon" class="w-3 h-3 mt-1" />
            <span>{{ act.description }} • {{ act.time }}</span>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '@/components/Base/Modal'
import Lucide from '@/components/Base/Lucide/Lucide.vue'

defineProps<{ show: boolean; task: any }>()
const emit = defineEmits(['close'])
</script>