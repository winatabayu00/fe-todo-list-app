<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="cu-backdrop">
      <div
          v-if="show"
          class="fixed inset-0 bg-black/40 backdrop-blur-sm z-[900]"
          @click.self="emit('close')"
      />
    </Transition>

    <!-- Slide-in panel -->
    <Transition name="cu-panel">
      <div
          v-if="show"
          class="fixed inset-y-0 right-0 z-[901] flex flex-col w-full max-w-5xl bg-white dark:bg-darkmode-600 shadow-2xl"
      >
        <!-- ── Top bar: breadcrumb + actions ───────────────────────────────── -->
        <div class="flex items-center gap-1 px-4 py-2.5 border-b border-slate-200 dark:border-darkmode-400 bg-slate-50 dark:bg-darkmode-700 min-h-[44px]">
          <!-- Breadcrumb (tidak ada lagi karena subtask tidak bisa dibuka sebagai panel terpisah) -->
          <div class="flex items-center gap-1 flex-1 min-w-0">
            <svg class="w-4 h-4 text-slate-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
            </svg>
            <span class="text-xs font-medium text-slate-700 dark:text-slate-200 truncate">
              {{ currentTask?.title || 'Loading…' }}
            </span>
            <span v-if="currentTask?.project" class="hidden sm:flex items-center gap-1 text-xs text-slate-400 ml-2 flex-shrink-0">
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
              </svg>
              {{ currentTask.project.name }}
            </span>
          </div>

          <!-- Action buttons -->
          <div class="flex items-center gap-1 flex-shrink-0 ml-2">
            <!-- Saved indicator -->
            <Transition name="fade">
              <span v-if="saveStatus" class="text-xs text-emerald-500 flex items-center gap-1 mr-1">
                <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Saved
              </span>
            </Transition>

            <!-- Toggle complete -->
            <button
                v-if="currentTask"
                @click="handleToggleComplete"
                :title="currentTask.is_completed ? 'Mark as incomplete' : 'Mark as complete'"
                class="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-darkmode-400 transition-colors"
                :class="currentTask.is_completed ? 'text-emerald-500' : 'text-slate-400 hover:text-emerald-500'"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 11 12 14 22 4"/>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
              </svg>
            </button>

            <!-- Delete -->
            <button
                v-if="currentTask"
                @click="handleDelete"
                title="Delete task"
                class="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                <path d="M10 11v6"/><path d="M14 11v6"/>
                <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
              </svg>
            </button>

            <!-- Close -->
            <button
                @click="emit('close')"
                class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-darkmode-400 transition-colors"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- ── Main content ────────────────────────────────────────────────── -->
        <div class="flex-1 overflow-y-auto">

          <!-- Loading -->
          <div v-if="detailLoading" class="flex flex-col items-center justify-center py-24 gap-3">
            <svg class="w-8 h-8 animate-spin text-violet-500" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
            </svg>
            <span class="text-sm text-slate-400">Loading task…</span>
          </div>

          <!-- Not found -->
          <div v-else-if="!currentTask" class="flex flex-col items-center justify-center py-24 text-slate-400 gap-3">
            <svg class="w-12 h-12 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p class="text-sm">Task not found</p>
          </div>

          <!-- Detail layout: left + right -->
          <div v-else class="flex flex-col lg:flex-row min-h-full">

            <!-- ── Left: editable content ──────────────────────────────────── -->
            <div class="flex-1 p-6 space-y-6 min-w-0">

              <!-- Status + Priority pills -->
              <div class="flex items-center gap-2 flex-wrap">
                <select
                    v-model="form.status"
                    @change="autoSave('status', form.status)"
                    class="text-xs font-semibold px-3 py-1.5 rounded-full border-0 ring-1 ring-inset ring-current/20 cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-400 transition-colors"
                    :class="taskHelpers.statusBadgeClass(form.status as any)"
                >
                  <option value="todo">Todo</option>
                  <option value="in_progress">In Progress</option>
                  <option value="in_review">In Review</option>
                  <option value="done">Done</option>
                </select>

                <select
                    v-model="form.priority"
                    @change="autoSave('priority', form.priority)"
                    class="text-xs font-semibold px-3 py-1.5 rounded-full border-0 ring-1 ring-inset ring-current/20 cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-400 transition-colors"
                    :class="taskHelpers.priorityBadgeClass(form.priority as any)"
                >
                  <option value="urgent">🔴 Urgent</option>
                  <option value="high">🟠 High</option>
                  <option value="normal">🔵 Normal</option>
                  <option value="low">🟢 Low</option>
                </select>

                <!-- Completed badge -->
                <span
                    v-if="currentTask.is_completed"
                    class="text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200"
                >✓ Completed</span>
              </div>

              <!-- Title -->
              <div>
                <textarea
                    v-model="form.title"
                    rows="1"
                    placeholder="Task title…"
                    @blur="autoSave('title', form.title)"
                    @keydown.enter.prevent="($event.target as HTMLTextAreaElement).blur()"
                    class="w-full text-2xl font-bold text-slate-800 dark:text-slate-100 bg-transparent border-0 resize-none focus:outline-none focus:ring-0 p-0 leading-snug placeholder-slate-300 dark:placeholder-slate-600"
                    :class="{ 'line-through text-slate-400 dark:text-slate-500': currentTask.is_completed }"
                    style="field-sizing: content;"
                />
              </div>

              <!-- Creator info -->
              <div v-if="currentTask.creator" class="flex items-center gap-2 text-xs text-slate-400">
                <span class="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 flex items-center justify-center font-semibold uppercase text-[10px]">
                  {{ currentTask.creator.name[0] }}
                </span>
                Created by {{ currentTask.creator.name }}
                <span v-if="currentTask.created_at">· {{ taskHelpers.formatDate(currentTask.created_at) }}</span>
              </div>

              <!-- Description -->
              <div>
                <p class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Description</p>
                <textarea
                    v-model="form.description"
                    rows="4"
                    placeholder="Add a description…"
                    @blur="autoSave('description', form.description)"
                    class="w-full text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-darkmode-700 rounded-xl border border-slate-200 dark:border-darkmode-400 p-3 resize-none focus:outline-none focus:ring-2 focus:ring-violet-400 placeholder-slate-300 dark:placeholder-slate-600 transition-colors"
                />
              </div>

              <!-- ── Subtasks ─────────────────────────────────────────────── -->
              <div>
                <!-- Header + progress bar -->
                <div class="flex items-center gap-3 mb-3">
                  <p class="text-xs font-semibold uppercase tracking-wider text-slate-400 flex-shrink-0">
                    Subtasks
                    <span v-if="validSubtasks.length" class="ml-1 normal-case font-normal text-slate-500">
                      {{ completedSubtaskCount }}/{{ validSubtasks.length }}
                    </span>
                  </p>
                  <div v-if="validSubtasks.length" class="flex-1 h-1.5 bg-slate-100 dark:bg-darkmode-400 rounded-full overflow-hidden">
                    <div
                        class="h-full bg-emerald-400 rounded-full transition-all duration-500"
                        :style="{ width: subtaskProgress + '%' }"
                    />
                  </div>
                </div>

                <!-- Subtask rows -->
                <div class="space-y-0.5 mb-3">
                  <TransitionGroup name="subtask-list">
                    <div
                        v-for="st in validSubtasks"
                        :key="st.id"
                        class="group flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-darkmode-700 transition-colors"
                    >
                      <!-- Checkbox -->
                      <button
                          @click="handleToggleSubtask(st)"
                          class="flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-all"
                          :class="st.is_completed
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-slate-300 dark:border-slate-600 hover:border-emerald-400'"
                      >
                        <svg v-if="st.is_completed" class="w-2.5 h-2.5" viewBox="0 0 12 10" fill="none">
                          <path d="M1 5L4.5 8.5L11 1" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>

                      <!-- Title -->
                      <span
                          class="flex-1 text-sm text-slate-700 dark:text-slate-300 select-none"
                          :class="{ 'line-through text-slate-400 dark:text-slate-500': st.is_completed }"
                      >{{ st.title }}</span>

                      <!-- Created date (subtle) -->
                      <span
                          v-if="st.created_at"
                          class="hidden sm:block text-xs text-slate-300 dark:text-slate-600 group-hover:text-slate-400 transition-colors flex-shrink-0"
                      >
                        {{ taskHelpers.formatDate(st.created_at) }}
                      </span>
                    </div>
                  </TransitionGroup>

                  <!-- Empty state -->
                  <div v-if="!validSubtasks.length" class="px-3 py-2 text-sm text-slate-400 italic">
                    No subtasks yet. Add one below.
                  </div>
                </div>

                <!-- Add subtask input -->
                <div
                    class="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed transition-colors"
                    :class="addingSubtask
                    ? 'border-violet-400 bg-violet-50 dark:bg-violet-900/10'
                    : 'border-slate-200 dark:border-darkmode-400 hover:border-violet-300 dark:hover:border-violet-700'"
                >
                  <svg
                      class="w-4 h-4 flex-shrink-0 transition-colors"
                      :class="addingSubtask ? 'text-violet-500' : 'text-slate-300'"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  >
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  <input
                      ref="subtaskInputRef"
                      v-model="newSubtaskTitle"
                      type="text"
                      placeholder="Add subtask… (Enter to save)"
                      class="flex-1 text-sm bg-transparent border-0 focus:outline-none focus:ring-0 text-slate-700 dark:text-slate-300 placeholder-slate-300 dark:placeholder-slate-600"
                      @focus="addingSubtask = true"
                      @blur="addingSubtask = false"
                      @keydown.enter="handleAddSubtask"
                      @keydown.esc="newSubtaskTitle = ''; ($event.target as HTMLInputElement).blur()"
                  />
                  <button
                      v-if="newSubtaskTitle.trim()"
                      @click="handleAddSubtask"
                      class="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-200 px-2 py-0.5 rounded transition-colors"
                  >Add</button>
                </div>
              </div>

              <!-- ── Time Logs ────────────────────────────────────────────── -->
              <div>
                <p class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Time Log</p>

                <!-- Log list -->
                <div class="space-y-1 mb-3">
                   <div
                       v-for="log in validTimeLogs"
                       :key="log.id"
                       class="flex items-center gap-3 text-sm px-3 py-2 rounded-lg bg-slate-50 dark:bg-darkmode-700"
                   >
                     <svg class="w-4 h-4 text-violet-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                       <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                     </svg>
                     <span class="font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">{{ log.minutes }} min</span>
                     <span class="flex-1 text-slate-500 truncate">{{ log.description || '—' }}</span>
                     <span class="text-xs text-slate-400 flex-shrink-0">{{ taskHelpers.formatDateTime(log.created_at) }}</span>
                   </div>
                   <p v-if="!validTimeLogs.length" class="text-sm text-slate-400 italic px-3 py-2">No time logs yet.</p>
                 </div>

                <!-- Add log -->
                <div class="flex items-center gap-2">
                  <input
                      v-model.number="logMinutes"
                      type="number"
                      min="1"
                      placeholder="Min"
                      class="w-20 text-sm px-3 py-1.5 rounded-lg border border-slate-200 dark:border-darkmode-400 bg-white dark:bg-darkmode-700 focus:outline-none focus:ring-2 focus:ring-violet-400 text-slate-700 dark:text-slate-200"
                  />
                  <input
                      v-model="logDescription"
                      type="text"
                      placeholder="What did you work on?"
                      class="flex-1 text-sm px-3 py-1.5 rounded-lg border border-slate-200 dark:border-darkmode-400 bg-white dark:bg-darkmode-700 focus:outline-none focus:ring-2 focus:ring-violet-400 text-slate-700 dark:text-slate-200"
                      @keydown.enter="handleAddTimeLog"
                  />
                  <button
                      @click="handleAddTimeLog"
                      :disabled="!logMinutes || logMinutes < 1"
                      class="px-3 py-1.5 text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >Log</button>
                </div>
              </div>
            </div>

            <!-- ── Right: properties sidebar ───────────────────────────────── -->
            <div class="w-full lg:w-60 xl:w-64 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-darkmode-400 bg-slate-50 dark:bg-darkmode-700 p-5 space-y-5 flex-shrink-0">

              <!-- Assignee -->
              <div>
                <p class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Assignee</p>
                <div v-if="currentTask.assignee" class="flex items-center gap-2.5">
                  <span class="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-300 flex items-center justify-center text-xs font-bold uppercase flex-shrink-0">
                    {{ currentTask.assignee.name[0] }}
                  </span>
                  <div class="min-w-0">
                    <p class="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{{ currentTask.assignee.name }}</p>
                    <p class="text-xs text-slate-400 truncate">{{ currentTask.assignee.email }}</p>
                  </div>
                </div>
                <p v-else class="text-sm text-slate-400 italic">Unassigned</p>
              </div>

              <!-- Dates -->
              <div>
                <p class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Dates</p>
                <div class="space-y-2">
                  <div class="flex items-center justify-between gap-2">
                    <span class="text-xs text-slate-500 flex-shrink-0">Start</span>
                    <input
                        v-model="form.start_date"
                        type="date"
                        @change="autoSave('start_date', form.start_date || null)"
                        class="text-xs text-slate-700 dark:text-slate-200 bg-white dark:bg-darkmode-600 border border-slate-200 dark:border-darkmode-400 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-violet-400 w-full max-w-[140px]"
                    />
                  </div>
                  <div class="flex items-center justify-between gap-2">
                    <span class="text-xs flex-shrink-0" :class="isOverdue ? 'text-red-500 font-medium' : 'text-slate-500'">
                      Due{{ isOverdue ? ' !' : '' }}
                    </span>
                    <input
                        v-model="form.due_date"
                        type="date"
                        @change="autoSave('due_date', form.due_date || null)"
                        class="text-xs bg-white dark:bg-darkmode-600 border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-violet-400 w-full max-w-[140px]"
                        :class="isOverdue
                        ? 'border-red-300 dark:border-red-700 text-red-500'
                        : 'border-slate-200 dark:border-darkmode-400 text-slate-700 dark:text-slate-200'"
                    />
                  </div>
                </div>
              </div>

              <!-- Time Tracking -->
              <div>
                <p class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Time Tracking</p>
                <div class="space-y-1.5">
                  <div class="flex items-center justify-between text-xs gap-2">
                    <span class="text-slate-500">Estimate</span>
                    <div class="flex items-center gap-1">
                      <input
                          v-model.number="form.time_estimate"
                          type="number"
                          min="0"
                          placeholder="—"
                          @blur="autoSave('time_estimate', form.time_estimate || null)"
                          class="w-16 text-right text-slate-700 dark:text-slate-200 bg-white dark:bg-darkmode-600 border border-slate-200 dark:border-darkmode-400 rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-violet-400"
                      />
                      <span class="text-slate-400">min</span>
                    </div>
                  </div>
                  <div class="flex items-center justify-between text-xs">
                    <span class="text-slate-500">Spent</span>
                    <span class="font-semibold text-slate-700 dark:text-slate-200">{{ currentTask.time_spent ?? 0 }} min</span>
                  </div>
                  <div class="flex items-center justify-between text-xs">
                    <span class="text-slate-500">Remaining</span>
                    <span class="font-semibold text-slate-700 dark:text-slate-200">{{ currentTask.time_remaining ?? 0 }} min</span>
                  </div>
                  <!-- Progress bar -->
                  <div v-if="form.time_estimate" class="mt-1.5 h-1.5 bg-slate-200 dark:bg-darkmode-400 rounded-full overflow-hidden">
                    <div
                        class="h-full rounded-full transition-all duration-300"
                        :class="timeProgress > 100 ? 'bg-red-400' : 'bg-violet-400'"
                        :style="{ width: Math.min(timeProgress, 100) + '%' }"
                    />
                  </div>
                </div>
              </div>

              <!-- Project -->
              <div v-if="currentTask.project">
                <p class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Project</p>
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-slate-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
                  </svg>
                  <span class="text-sm text-slate-700 dark:text-slate-200 truncate">{{ currentTask.project.name }}</span>
                </div>
              </div>

              <!-- Tags -->
              <div v-if="currentTask.tags?.length">
                <p class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Tags</p>
                <div class="flex flex-wrap gap-1">
                  <span
                      v-for="tag in currentTask.tags"
                      :key="tag.id"
                      class="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                      :style="{ backgroundColor: tag.color || '#6366f1' }"
                  >{{ tag.name }}</span>
                </div>
              </div>
              <div v-else-if="currentTask.tags !== undefined">
                <p class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Tags</p>
                <p class="text-sm text-slate-400 italic">No tags</p>
              </div>

              <!-- Meta -->
              <div class="pt-4 border-t border-slate-200 dark:border-darkmode-400 space-y-1 text-xs text-slate-400">
                <p v-if="currentTask.created_at">
                  Created {{ taskHelpers.formatDateTime(currentTask.created_at) }}
                </p>
                <p v-if="currentTask.updated_at">
                  Updated {{ taskHelpers.formatDateTime(currentTask.updated_at) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import ApiService from '@/core/services/ApiService'
import publicEndpoint from '@/constants/publicApi'
import type { ApiResponse } from '@/core/services/ApiService'
import type { Task, Subtask } from '../Tasks'
import { taskHelpers } from '../Tasks'

// ── Props ─────────────────────────────────────────────────────────────────────

const props = defineProps<{
  show: boolean
  detailStack: string[]
  taskDetailCache: Record<string, Task>
  detailLoading: boolean
  updateTask: (id: string, data: Partial<Task>) => Promise<Task>
  deleteTask: (id: string) => Promise<void>
  toggleComplete: (task: Task) => Promise<void>
  addSubtask: (parentId: string, title: string) => Promise<Subtask | null>
  toggleSubtask: (parentId: string, st: Subtask) => Promise<void>
}>()

const emit = defineEmits<{
  close: []
}>()

// ── Computed: current task ────────────────────────────────────────────────────

const currentTask = computed<Task | null>(() => {
  const id = props.detailStack[props.detailStack.length - 1]
  return id ? (props.taskDetailCache[id] ?? null) : null
})

// Filter subtasks yang valid (bukan null/undefined)
const validSubtasks = computed<Subtask[]>(() =>
    (currentTask.value?.subtasks ?? []).filter(Boolean)
)

const completedSubtaskCount = computed(() =>
    validSubtasks.value.filter(s => s.is_completed).length
)

const subtaskProgress = computed(() => {
  if (!validSubtasks.value.length) return 0
  return Math.round((completedSubtaskCount.value / validSubtasks.value.length) * 100)
})

const timeProgress = computed(() => {
  if (!form.value.time_estimate) return 0
  return Math.round(((currentTask.value?.time_spent ?? 0) / form.value.time_estimate) * 100)
})

const isOverdue = computed(() => {
  if (!form.value.due_date || currentTask.value?.is_completed) return false
  return new Date(form.value.due_date) < new Date()
})

// ── Form state ────────────────────────────────────────────────────────────────

const form = ref({
  title:         '',
  description:   '',
  status:        'todo' as Task['status'],
  priority:      'normal' as Task['priority'],
  start_date:    '',
  due_date:      '',
  time_estimate: 0 as number | null,
})

// ── Time logs (declare BEFORE watch that uses it) ─────────────────────────────

const timeLogs = ref<{ id: string; minutes: number; description: string; created_at: string }[]>([])
const validTimeLogs = computed(() => timeLogs.value.filter(log => log && log.id && log.minutes !== null && log.minutes !== undefined))
const logMinutes    = ref<number>(30)
const logDescription = ref('')

// ── Subtasks (declare BEFORE watch) ──────────────────────────────────────────

const newSubtaskTitle = ref('')
const addingSubtask   = ref(false)
const subtaskInputRef = ref<HTMLInputElement | null>(null)

// Sync form setiap kali currentTask berubah (pindah stack atau data baru)
watch(currentTask, (task) => {
  if (!task) {
    form.value = { title: '', description: '', status: 'todo', priority: 'normal', start_date: '', due_date: '', time_estimate: null }
    timeLogs.value   = []
    return
  }
  form.value = {
    title:         task.title         || '',
    description:   task.description   || '',
    status:        task.status        || 'todo',
    priority:      task.priority      || 'normal',
    start_date:    task.start_date    || '',
    due_date:      task.due_date      || '',
    time_estimate: task.time_estimate ?? null,
  }
  fetchTimeLogs()
}, { immediate: true })

// ── Auto-save ─────────────────────────────────────────────────────────────────

const saveStatus = ref(false)
let saveTimer: ReturnType<typeof setTimeout>

async function autoSave(field: string, value: any) {
  const id = props.detailStack[props.detailStack.length - 1]
  if (!id || !currentTask.value) return
  clearTimeout(saveTimer)
  try {
    await props.updateTask(id, { [field]: value })
    saveStatus.value = true
    saveTimer = setTimeout(() => { saveStatus.value = false }, 2000)
  } catch (error) {
    console.error(`Failed to auto-save ${field}:`, error)
  }
}

// ── Subtasks ──────────────────────────────────────────────────────────────────


async function handleAddSubtask() {
  const title = newSubtaskTitle.value.trim()
  const id    = props.detailStack[props.detailStack.length - 1]
  if (!title || !id) return

  newSubtaskTitle.value = ''
  await props.addSubtask(id, title)

  // Kembalikan fokus ke input supaya bisa tambah subtask berikutnya
  await nextTick()
  subtaskInputRef.value?.focus()
}

async function handleToggleSubtask(st: Subtask) {
  const id = props.detailStack[props.detailStack.length - 1]
  if (!id) return
  await props.toggleSubtask(id, st)
}

// ── Time logs functions ───────────────────────────────────────────────────────

async function fetchTimeLogs() {
   const id = props.detailStack[props.detailStack.length - 1]
   if (!id) { timeLogs.value = []; return }
   try {
     const res = await ApiService.get({
       resource: publicEndpoint.timeTracking.logs.replace(':taskId', id)
     }) as ApiResponse<any>
     const payload = res.payload || {}
     const list = payload.data && Array.isArray(payload.data) ? payload.data :
                  Array.isArray(payload) ? payload : []
     timeLogs.value = list.filter((log: any) => log && log.id && log.minutes !== undefined)
   } catch {
     timeLogs.value = []
   }
}

async function handleAddTimeLog() {
  const id = props.detailStack[props.detailStack.length - 1]
  if (!id || !logMinutes.value || logMinutes.value < 1) return
  try {
    await ApiService.post({
      resource: publicEndpoint.timeTracking.log.replace(':taskId', id),
      params: { minutes: logMinutes.value, description: logDescription.value }
    })
    logMinutes.value    = 30
    logDescription.value = ''
    await fetchTimeLogs()
  } catch (error) {
    console.error('Failed to add time log:', error)
  }
}

// ── Action handlers ───────────────────────────────────────────────────────────

async function handleToggleComplete() {
  if (!currentTask.value) return
  await props.toggleComplete(currentTask.value)
}

async function handleDelete() {
  if (!currentTask.value) return
  await props.deleteTask(currentTask.value.id)
}
</script>

<style scoped>
/* Panel slide from right */
.cu-panel-enter-active,
.cu-panel-leave-active {
  transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
}
.cu-panel-enter-from,
.cu-panel-leave-to {
  transform: translateX(100%);
}

/* Backdrop fade */
.cu-backdrop-enter-active,
.cu-backdrop-leave-active {
  transition: opacity 0.25s ease;
}
.cu-backdrop-enter-from,
.cu-backdrop-leave-to {
  opacity: 0;
}

/* Saved indicator fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Subtask list transition */
.subtask-list-enter-active {
  transition: all 0.2s ease;
}
.subtask-list-enter-from {
  opacity: 0;
  transform: translateY(-6px);
}
.subtask-list-leave-active {
  transition: all 0.15s ease;
}
.subtask-list-leave-to {
  opacity: 0;
}

/* Auto-resize textarea */
textarea {
  field-sizing: content;
}
</style>