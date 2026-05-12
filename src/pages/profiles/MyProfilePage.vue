<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-6 px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="w-full mb-8">
      <div class="relative bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
        <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div class="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>

        <div class="relative flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-3">
              <div class="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <User class="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 class="text-2xl font-bold">Profile Settings</h1>
                <p class="text-blue-100 mt-1">Manage your account and task management preferences</p>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="flex items-center gap-4 text-sm text-blue-100">
              <div class="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Member since {{ joinDate }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="w-full space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column - Profile Overview -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Profile Card -->
          <div class="group bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div class="text-center">
              <!-- Profile Avatar -->
              <div class="relative inline-block mb-4">
                <div class="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                  {{ userInitials }}
                </div>
                <button
                    @click="editAvatar"
                    class="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <Camera class="h-4 w-4 text-gray-600" />
                </button>
                <div class="absolute top-0 right-0">
                  <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Check class="h-3 w-3 text-white" />
                  </div>
                </div>
              </div>

              <!-- User Info -->
              <h2 class="text-xl font-bold text-gray-900">{{ userProfile.fullName }}</h2>
              <p class="text-gray-600 mt-1">{{ userProfile.title }}</p>
              <p class="text-sm text-gray-500 mt-2">{{ userProfile.bio }}</p>

              <!-- Verification Status -->
              <div class="mt-4 flex items-center justify-center gap-2">
                <div class="flex items-center gap-1 text-sm text-green-600">
                  <BadgeCheck class="h-4 w-4" />
                  <span>Verified User</span>
                </div>
              </div>

              <!-- Stats -->
              <div class="mt-6 grid grid-cols-3 gap-4">
                <div class="text-center">
                  <div class="text-lg font-bold text-gray-900">{{ userStats.projectsCount }}</div>
                  <div class="text-xs text-gray-500">Projects</div>
                </div>
                <div class="text-center">
                  <div class="text-lg font-bold text-gray-900">{{ userStats.tasksCount }}</div>
                  <div class="text-xs text-gray-500">Tasks</div>
                </div>
                <div class="text-center">
                  <div class="text-lg font-bold text-gray-900">{{ userStats.workspacesCount }}</div>
                  <div class="text-xs text-gray-500">Workspaces</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Task Statistics -->
          <div class="group bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <h3 class="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <BarChart3 class="h-5 w-5 text-blue-600" />
              Task Statistics
            </h3>

            <div class="space-y-4">
              <div v-for="stat in taskStats" :key="stat.label" class="flex items-center justify-between">
                <span class="text-sm text-gray-600">{{ stat.label }}</span>
                <span :class="['text-sm font-semibold', stat.color]">{{ stat.value }}</span>
              </div>
            </div>

            <div class="mt-6 pt-4 border-t border-gray-200">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Completion Rate</span>
                <div class="flex items-center gap-2">
                  <div class="w-16 bg-gray-200 rounded-full h-2">
                    <div
                        class="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-1000"
                        :style="{ width: `${completionRate}%` }"
                    ></div>
                  </div>
                  <span class="font-semibold text-gray-900">{{ completionRate }}%</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Account Status -->
          <div class="group bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <h3 class="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Shield class="h-5 w-5 text-green-600" />
              Account Status
            </h3>

            <div class="space-y-3">
              <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span class="text-sm text-green-700">Account Level</span>
                <span class="font-semibold text-green-600">{{ accountStatus.level }}</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span class="text-sm text-blue-700">Verification</span>
                <span class="font-semibold text-blue-600">{{ accountStatus.verification }}</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span class="text-sm text-purple-700">Member Since</span>
                <span class="font-semibold text-purple-600">{{ accountStatus.memberSince }}</span>
              </div>
            </div>

            <button class="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">
              Upgrade Account
            </button>
          </div>
        </div>

        <!-- Right Column - Settings & Details -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Personal Information -->
          <div class="group bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div class="flex items-center justify-between mb-6">
              <h3 class="font-semibold text-gray-800 flex items-center gap-2 text-lg">
                <User class="h-5 w-5 text-blue-600" />
                Personal Information
              </h3>
              <button
                  @click="editPersonalInfo"
                  class="px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-2"
              >
                <Edit class="h-4 w-4" />
                Edit
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div class="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span class="text-gray-900">{{ userProfile.fullName }}</span>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <div class="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span class="text-gray-900">@{{ userProfile.username }}</span>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div class="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span class="text-gray-900">{{ userProfile.email }}</span>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <div class="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span class="text-gray-900">{{ userProfile.phone }}</span>
                </div>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <div class="p-3 bg-gray-50 rounded-lg border border-gray-200 min-h-[80px]">
                  <span class="text-gray-900">{{ userProfile.bio }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Task Management Preferences -->
          <div class="group bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div class="flex items-center justify-between mb-6">
              <h3 class="font-semibold text-gray-800 flex items-center gap-2 text-lg">
                <Settings class="h-5 w-5 text-orange-600" />
                Task Preferences
              </h3>
              <button
                  @click="editPreferences"
                  class="px-4 py-2 text-orange-600 hover:text-orange-800 transition-colors flex items-center gap-2"
              >
                <Edit class="h-4 w-4" />
                Edit
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Default Task View</label>
                <div class="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span class="text-gray-900">{{ preferences.defaultView }}</span>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Default Priority</label>
                <div class="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span class="text-gray-900">{{ preferences.defaultPriority }}</span>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Favorite Tags</label>
                <div class="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div class="flex flex-wrap gap-1">
                    <span
                        v-for="tag in preferences.favoriteTags"
                        :key="tag"
                        class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Working Hours</label>
                <div class="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span class="text-gray-900">{{ preferences.workingHours }}</span>
                </div>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">Notifications</label>
                <div class="space-y-2">
                  <div
                      v-for="notification in preferences.notifications"
                      :key="notification.type"
                      class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div>
                      <div class="font-medium text-gray-900">{{ notification.type }}</div>
                      <div class="text-sm text-gray-500">{{ notification.description }}</div>
                    </div>
                    <div class="flex items-center">
                      <button
                          @click="toggleNotification(notification.type)"
                          :class="[
                          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                          notification.enabled ? 'bg-green-500' : 'bg-gray-200'
                        ]"
                      >
                        <span
                            :class="[
                            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                            notification.enabled ? 'translate-x-5' : 'translate-x-0'
                          ]"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Security Settings -->
          <div class="group bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <h3 class="font-semibold text-gray-800 mb-6 flex items-center gap-2 text-lg">
              <Shield class="h-5 w-5 text-red-600" />
              Security Settings
            </h3>

            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <div class="font-medium text-gray-900">Two-Factor Authentication</div>
                  <div class="text-sm text-gray-500 mt-1">Add an extra layer of security to your account</div>
                </div>
                <button
                    @click="toggleTwoFactor"
                    :class="[
                    'px-4 py-2 rounded-lg font-medium transition-colors',
                    securitySettings.twoFactorEnabled
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  ]"
                >
                  {{ securitySettings.twoFactorEnabled ? 'Disable' : 'Enable' }}
                </button>
              </div>

              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <div class="font-medium text-gray-900">Change Password</div>
                  <div class="text-sm text-gray-500 mt-1">Last changed {{ securitySettings.lastPasswordChange }}</div>
                </div>
                <button
                    @click="changePassword"
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Change
                </button>
              </div>

              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <div class="font-medium text-gray-900">Login Activity</div>
                  <div class="text-sm text-gray-500 mt-1">Recent account access</div>
                </div>
                <button
                    @click="viewLoginActivity"
                    class="px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors font-medium flex items-center gap-2"
                >
                  View
                  <ArrowRight class="h-4 w-4" />
                </button>
              </div>

              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <div class="font-medium text-gray-900">Connected Devices</div>
                  <div class="text-sm text-gray-500 mt-1">{{ securitySettings.connectedDevices }} devices</div>
                </div>
                <button
                    @click="manageDevices"
                    class="px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors font-medium"
                >
                  Manage
                </button>
              </div>
            </div>
          </div>

          <!-- Subscription & Billing -->
          <div class="group bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div class="flex items-center justify-between mb-6">
              <h3 class="font-semibold text-gray-800 flex items-center gap-2 text-lg">
                <CreditCard class="h-5 w-5 text-purple-600" />
                Subscription & Billing
              </h3>
              <button class="px-4 py-2 text-purple-600 hover:text-purple-800 transition-colors flex items-center gap-2">
                <Plus class="h-4 w-4" />
                Upgrade
              </button>
            </div>

            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                <div>
                  <div class="font-medium text-gray-900">{{ subscriptionPlan.name }}</div>
                  <div class="text-sm text-gray-500 mt-1">{{ subscriptionPlan.description }}</div>
                </div>
                <div class="text-right">
                  <div class="text-lg font-bold text-purple-600">{{ subscriptionPlan.price }}</div>
                  <div class="text-sm text-gray-500">per month</div>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div class="text-lg font-bold text-gray-900">{{ billingInfo.remainingDays }}</div>
                  <div class="text-xs text-gray-500">Days Remaining</div>
                </div>
                <div class="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div class="text-lg font-bold text-gray-900">{{ billingInfo.nextBilling }}</div>
                  <div class="text-xs text-gray-500">Next Billing</div>
                </div>
              </div>

              <div class="flex gap-3">
                <button class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                  Renew Now
                </button>
                <button class="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium">
                  Cancel
                </button>
              </div>
            </div>
          </div>

          <!-- Danger Zone -->
          <div class="group bg-white rounded-2xl shadow-lg border border-red-200 p-6 hover:shadow-xl transition-all duration-300">
            <h3 class="font-semibold text-red-800 mb-4 flex items-center gap-2 text-lg">
              <AlertTriangle class="h-5 w-5 text-red-600" />
              Danger Zone
            </h3>

            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                <div>
                  <div class="font-medium text-red-900">Delete Account</div>
                  <div class="text-sm text-red-700 mt-1">Permanently delete your account and all data</div>
                </div>
                <button
                    @click="deleteAccount"
                    class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Delete
                </button>
              </div>

              <div class="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div>
                  <div class="font-medium text-yellow-900">Export Data</div>
                  <div class="text-sm text-yellow-700 mt-1">Download all your task and workspace data</div>
                </div>
                <button
                    @click="exportData"
                    class="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
                >
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Edit Personal Information</h3>
        <!-- Add form fields here -->
        <div class="flex gap-3 mt-6">
          <button @click="showEditModal = false" class="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
            Cancel
          </button>
          <button @click="savePersonalInfo" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  User,
  Camera,
  Check,
  BadgeCheck,
  BarChart3,
  Shield,
  Edit,
  Settings,
  ArrowRight,
  CreditCard,
  Plus,
  AlertTriangle,
} from 'lucide-vue-next'
import router from '@/router'

// Modal
const showEditModal = ref(false)

// User profile data (disesuaikan dengan To-Do Management)
const userProfile = ref({
  fullName: 'Admin User',
  username: 'admin',
  email: 'admin@example.com',
  phone: '+62 812 3456 7890',
  title: 'Project Manager',
  bio: 'Experienced in managing tasks, projects, and teams. Focus on productivity and agile workflows.',
  joinDate: 'January 2025'
})

// User stats (proyek, tugas, workspace)
const userStats = ref({
  projectsCount: 12,
  tasksCount: 156,
  workspacesCount: 3
})

// Task statistics
const taskStats = ref([
  { label: 'Completed Tasks', value: '98', color: 'text-green-600' },
  { label: 'In Progress', value: '34', color: 'text-yellow-600' },
  { label: 'Overdue', value: '5', color: 'text-red-600' },
  { label: 'Total Time Spent', value: '127 hrs', color: 'text-blue-600' },
  { label: 'Avg. Completion', value: '6.2 days', color: 'text-purple-600' },
  { label: 'Tasks on Schedule', value: '87%', color: 'text-indigo-600' }
])

// Account status
const accountStatus = ref({
  level: 'Premium',
  verification: 'Verified',
  memberSince: 'Jan 2025'
})

// Task preferences (bukan trading)
const preferences = ref({
  defaultView: 'Kanban Board',
  defaultPriority: 'Medium',
  favoriteTags: ['urgent', 'feature', 'bug', 'documentation'],
  workingHours: '09:00 - 17:00 (GMT+7)',
  notifications: [
    { type: 'Email Alerts', description: 'Task assignments and mentions', enabled: true },
    { type: 'Push Notifications', description: 'Due date reminders', enabled: true },
    { type: 'SMS Alerts', description: 'Critical updates', enabled: false },
    { type: 'Weekly Report', description: 'Task summary', enabled: true }
  ]
})

// Security settings
const securitySettings = ref({
  twoFactorEnabled: false,
  lastPasswordChange: '2 weeks ago',
  connectedDevices: 2
})

// Subscription
const subscriptionPlan = ref({
  name: 'Professional Plan',
  description: 'Unlimited tasks, workspaces, and advanced reporting',
  price: '$29.99'
})

const billingInfo = ref({
  remainingDays: 18,
  nextBilling: 'Jun 15, 2025'
})

// Computed
const userInitials = computed(() => {
  return userProfile.value.fullName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
})

const joinDate = computed(() => userProfile.value.joinDate)

const completionRate = computed(() => {
  const total = userStats.value.tasksCount
  const completed = parseInt(taskStats.value.find(s => s.label === 'Completed Tasks')?.value || '0')
  return total > 0 ? Math.round((completed / total) * 100) : 0
})

// Methods
const editAvatar = () => {
  console.log('Editing avatar...')
}

const editPersonalInfo = () => {
  showEditModal.value = true
}

const savePersonalInfo = () => {
  console.log('Saving personal info...')
  showEditModal.value = false
}

const editPreferences = () => {
  console.log('Editing preferences...')
}

const toggleNotification = (type: string) => {
  const notification = preferences.value.notifications.find(n => n.type === type)
  if (notification) notification.enabled = !notification.enabled
}

const toggleTwoFactor = () => {
  securitySettings.value.twoFactorEnabled = !securitySettings.value.twoFactorEnabled
}

const changePassword = () => {
  router.push({ name: 'change-password' })
}

const viewLoginActivity = () => {
  console.log('Viewing login activity...')
}

const manageDevices = () => {
  console.log('Managing devices...')
}

const deleteAccount = () => {
  if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
    console.log('Deleting account...')
  }
}

const exportData = () => {
  console.log('Exporting data...')
}
</script>