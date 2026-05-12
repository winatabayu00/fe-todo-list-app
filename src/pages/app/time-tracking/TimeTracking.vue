<template>
  <div class="py-6">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between pb-6 mb-6 border-b border-gray-200">
      <div>
        <h2 class="text-2xl font-medium">Time Tracking</h2>
        <div class="mt-1 text-sm text-gray-600">Track time spent on tasks</div>
      </div>
      <div class="flex gap-2">
        <Button variant="outline-secondary" @click="openEstimateModal">
          <Lucide icon="Clock" class="w-4 h-4 mr-2" />
          Set Estimate
        </Button>
        <Button variant="primary" @click="openLogModal">
          <Lucide icon="Play" class="w-4 h-4 mr-2" />
          Log Time
        </Button>
      </div>
    </div>

    <!-- Task Info Card -->
    <div class="bg-white rounded-lg shadow-md p-5 mb-6">
      <h3 class="text-lg font-medium text-gray-900">Task: {{ task?.title || 'Loading...' }}</h3>
      <div class="grid grid-cols-2 gap-4 mt-4">
        <div class="bg-blue-50 rounded-lg p-3 text-center">
          <div class="text-2xl font-bold text-blue-600">{{ formatMinutes(totalMinutes) }}</div>
          <div class="text-sm text-gray-500">Time Spent</div>
        </div>
        <div class="bg-green-50 rounded-lg p-3 text-center">
          <div class="text-2xl font-bold text-green-600">
            {{ task?.time_estimate ? formatMinutes(task.time_estimate) : 'Not set' }}
          </div>
          <div class="text-sm text-gray-500">Time Estimate</div>
        </div>
      </div>
    </div>

    <!-- Time Logs List -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-200">
        <h3 class="font-medium text-gray-900">Time Log History</h3>
      </div>
      <div>
        <LoadingIcon v-if="loading" class="mx-auto py-8" />
        <div v-else-if="timeLogs.length === 0" class="text-center text-gray-500 py-8">
          No time logs yet.
        </div>
        <div v-else class="divide-y divide-gray-200">
          <div v-for="log in timeLogs" :key="log.id" class="p-4 hover:bg-gray-50 transition">
            <div class="flex justify-between items-start">
              <div>
                <div class="font-medium text-gray-900">{{ formatMinutes(log.minutes) }}</div>
                <p v-if="log.description" class="text-sm text-gray-500 mt-1">{{ log.description }}</p>
                <div class="text-xs text-gray-400 mt-2">
                  Logged by {{ log.user?.name || 'Unknown' }} • {{ formatDate(log.created_at) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: Log Time -->
    <Modal :show="showLogModal" title="Log Time" size="md" @close="closeLogModal">
      <form @submit.prevent="submitLog">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Minutes *</label>
          <FormInput
              v-model="logForm.minutes"
              type="number"
              min="1"
              required
              class="w-full"
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Description</label>
          <FormTextarea v-model="logForm.description" rows="3" class="w-full" />
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <Button type="button" variant="outline-secondary" @click="closeLogModal">Cancel</Button>
          <Button type="submit" variant="primary" :disabled="isSubmitting">
            {{ isSubmitting ? 'Saving...' : 'Log Time' }}
          </Button>
        </div>
      </form>
    </Modal>

    <!-- Modal: Set Estimate -->
    <Modal :show="showEstimateModal" title="Set Time Estimate" size="md" @close="closeEstimateModal">
      <form @submit.prevent="updateEstimate">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Estimated Minutes</label>
          <FormInput
              v-model="estimateForm.minutes"
              type="number"
              min="0"
              class="w-full"
          />
          <p class="text-xs text-gray-500 mt-1">0 = remove estimate</p>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <Button type="button" variant="outline-secondary" @click="closeEstimateModal">Cancel</Button>
          <Button type="submit" variant="primary">Save Estimate</Button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/Base/Button'
import FormInput from '@/components/Base/Form/FormInput.vue'
import FormTextarea from '@/components/Base/Form/FormTextarea.vue'
import LoadingIcon from '@/components/Base/LoadingIcon'
import Lucide from '@/components/Base/Lucide/Lucide.vue'
import Modal from '@/components/Core/Modal/Modal.vue'
import { useTimeTracking } from './TimeTracking'

const {
  task,
  timeLogs,
  loading,
  totalMinutes,
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
} = useTimeTracking()
</script>