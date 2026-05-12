<template>
  <Teleport to="body">
    <Transition name="cu-backdrop">
      <div
          v-if="show"
          class="fixed inset-0 bg-black/40 backdrop-blur-sm z-[950] flex items-center justify-center p-4"
          @click.self="emit('close')"
      >
        <Transition name="cu-modal">
          <div
              v-if="show"
              class="w-full max-w-lg bg-white dark:bg-darkmode-600 rounded-2xl shadow-2xl overflow-hidden"
          >
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-darkmode-400">
              <h2 class="text-base font-semibold text-slate-800 dark:text-slate-100">Create New Task</h2>
              <button
                  @click="emit('close')"
                  class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-darkmode-400 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <!-- Body -->
            <div class="p-6 space-y-4">
              <!-- Title -->
              <div>
                <input
                    v-model="localForm.title"
                    type="text"
                    placeholder="Task title *"
                    required
                    class="w-full text-lg font-medium bg-transparent border-0 border-b-2 border-slate-200 dark:border-darkmode-400 focus:border-violet-400 pb-2 focus:outline-none focus:ring-0 text-slate-800 dark:text-slate-100 placeholder-slate-300 transition-colors"
                />
              </div>

              <!-- Description -->
              <div>
                <textarea
                    v-model="localForm.description"
                    rows="3"
                    placeholder="Description (optional)"
                    class="w-full text-sm bg-slate-50 dark:bg-darkmode-700 border border-slate-200 dark:border-darkmode-400 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-violet-400 text-slate-700 dark:text-slate-300 placeholder-slate-300"
                />
              </div>

              <!-- Status + Priority -->
              <div class="flex gap-3">
                <div class="flex-1">
                  <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Status</label>
                  <select
                      v-model="localForm.status"
                      class="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-darkmode-400 bg-white dark:bg-darkmode-700 focus:outline-none focus:ring-2 focus:ring-violet-400 text-slate-700 dark:text-slate-200"
                  >
                    <option value="todo">Todo</option>
                    <option value="in_progress">In Progress</option>
                    <option value="in_review">In Review</option>
                    <option value="done">Done</option>
                  </select>
                </div>
                <div class="flex-1">
                  <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Priority</label>
                  <select
                      v-model="localForm.priority"
                      class="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-darkmode-400 bg-white dark:bg-darkmode-700 focus:outline-none focus:ring-2 focus:ring-violet-400 text-slate-700 dark:text-slate-200"
                  >
                    <option value="urgent">🔴 Urgent</option>
                    <option value="high">🟠 High</option>
                    <option value="normal">🔵 Normal</option>
                    <option value="low">🟢 Low</option>
                  </select>
                </div>
              </div>

              <!-- Due Date -->
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Due Date</label>
                <input
                    v-model="localForm.due_date"
                    type="date"
                    class="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-darkmode-400 bg-white dark:bg-darkmode-700 focus:outline-none focus:ring-2 focus:ring-violet-400 text-slate-700 dark:text-slate-200"
                />
              </div>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 dark:border-darkmode-400 bg-slate-50 dark:bg-darkmode-700">
              <button
                  @click="emit('close')"
                  class="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-darkmode-600 border border-slate-200 dark:border-darkmode-400 rounded-lg hover:bg-slate-100 dark:hover:bg-darkmode-500 transition-colors"
              >
                Cancel
              </button>
              <button
                  @click="handleSubmit"
                  :disabled="!localForm.title.trim()"
                  class="px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Create Task
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [form: typeof localForm.value]
}>()

const localForm = ref({
  title: '',
  description: '',
  status: 'todo',
  priority: 'normal',
  due_date: ''
})

watch(() => props.show, (val) => {
  if (!val) {
    localForm.value = { title: '', description: '', status: 'todo', priority: 'normal', due_date: '' }
  }
})

function handleSubmit() {
  if (!localForm.value.title.trim()) return
  emit('submit', { ...localForm.value })
}
</script>

<style scoped>
.cu-modal-enter-active,
.cu-modal-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.cu-modal-enter-from,
.cu-modal-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-8px);
}

.cu-backdrop-enter-active,
.cu-backdrop-leave-active {
  transition: opacity 0.2s ease;
}
.cu-backdrop-enter-from,
.cu-backdrop-leave-to {
  opacity: 0;
}
</style>