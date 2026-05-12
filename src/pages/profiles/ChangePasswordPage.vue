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
                <Lock class="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 class="text-2xl font-bold">Change Password</h1>
                <p class="text-blue-100 mt-1">Update your password to keep your account secure</p>
              </div>
            </div>
          </div>

          <button
            @click="$router.back()"
            class="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
          >
            <ArrowLeft class="h-4 w-4" />
            Back to Profile
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="w-full max-w-2xl mx-auto">
      <!-- Password Change Form -->
      <div class="group bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
        <div class="mb-6">
          <h2 class="text-xl font-bold text-gray-900 mb-2">Update Your Password</h2>
          <p class="text-gray-600">Create a strong password to protect your trading account</p>
        </div>

        <form @submit.prevent="changePassword" class="space-y-6">
          <!-- Current Password -->
          <div>
            <label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <div class="relative">
              <input
                id="currentPassword"
                v-model="passwordForm.currentPassword"
                :type="showCurrentPassword ? 'text' : 'password'"
                placeholder="Enter your current password"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
              <button
                type="button"
                @click="showCurrentPassword = !showCurrentPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <Eye v-if="showCurrentPassword" class="h-5 w-5" />
                <EyeOff v-else class="h-5 w-5" />
              </button>
            </div>
          </div>

          <!-- New Password -->
          <div>
            <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div class="relative">
              <input
                id="newPassword"
                v-model="passwordForm.newPassword"
                :type="showNewPassword ? 'text' : 'password'"
                placeholder="Create a strong new password"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
              <button
                type="button"
                @click="showNewPassword = !showNewPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <Eye v-if="showNewPassword" class="h-5 w-5" />
                <EyeOff v-else class="h-5 w-5" />
              </button>
            </div>

            <!-- Password Strength Indicator -->
            <div class="mt-3">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-gray-600">Password strength</span>
                <span class="text-sm font-medium" :class="passwordStrength.color">
                  {{ passwordStrength.text }}
                </span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="h-2 rounded-full transition-all duration-500"
                  :class="passwordStrength.barColor"
                  :style="{ width: passwordStrength.percentage + '%' }"
                ></div>
              </div>
            </div>

            <!-- Password Requirements -->
            <div class="mt-4 space-y-2">
              <p class="text-sm font-medium text-gray-700 mb-2">Password requirements:</p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div class="flex items-center gap-2">
                  <CheckCircle
                    class="h-4 w-4"
                    :class="hasMinLength ? 'text-green-500' : 'text-gray-300'"
                  />
                  <span class="text-sm" :class="hasMinLength ? 'text-green-600' : 'text-gray-500'">
                    At least 8 characters
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <CheckCircle
                    class="h-4 w-4"
                    :class="hasUpperCase ? 'text-green-500' : 'text-gray-300'"
                  />
                  <span class="text-sm" :class="hasUpperCase ? 'text-green-600' : 'text-gray-500'">
                    One uppercase letter
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <CheckCircle
                    class="h-4 w-4"
                    :class="hasLowerCase ? 'text-green-500' : 'text-gray-300'"
                  />
                  <span class="text-sm" :class="hasLowerCase ? 'text-green-600' : 'text-gray-500'">
                    One lowercase letter
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <CheckCircle
                    class="h-4 w-4"
                    :class="hasNumber ? 'text-green-500' : 'text-gray-300'"
                  />
                  <span class="text-sm" :class="hasNumber ? 'text-green-600' : 'text-gray-500'">
                    One number
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Confirm New Password -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div class="relative">
              <input
                id="confirmPassword"
                v-model="passwordForm.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Confirm your new password"
                class="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                :class="passwordsMatch ? 'border-green-500' : 'border-gray-300'"
                required
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <Eye v-if="showConfirmPassword" class="h-5 w-5" />
                <EyeOff v-else class="h-5 w-5" />
              </button>
            </div>
            <p v-if="passwordForm.confirmPassword && !passwordsMatch" class="mt-1 text-sm text-red-600">
              Passwords do not match
            </p>
          </div>

          <!-- Security Tips -->
          <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div class="flex items-start gap-3">
              <Shield class="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 class="font-medium text-blue-900 mb-1">Security Tips</h3>
                <ul class="text-sm text-blue-700 space-y-1">
                  <li>• Use a combination of letters, numbers, and symbols</li>
                  <li>• Avoid using personal information like your name or birthdate</li>
                  <li>• Don't reuse passwords from other accounts</li>
                  <li>• Consider using a password manager</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-4 pt-4">
            <button
              type="button"
              @click="$router.back()"
              class="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="!canSubmit"
              class="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>

      <!-- Two-Factor Authentication Section -->
      <div class="group bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 mt-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-bold text-gray-900 mb-1">Two-Factor Authentication</h3>
            <p class="text-gray-600">Add an extra layer of security to your account</p>
          </div>
          <div class="flex items-center gap-4">
            <span
              class="px-3 py-1 rounded-full text-sm font-medium"
              :class="twoFactorEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
            >
              {{ twoFactorEnabled ? 'Enabled' : 'Disabled' }}
            </span>
            <button
              @click="toggleTwoFactor"
              class="px-4 py-2 rounded-xl font-medium transition-colors"
              :class="twoFactorEnabled ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'"
            >
              {{ twoFactorEnabled ? 'Disable' : 'Enable' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Recent Security Activity -->
      <div class="group bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 mt-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Recent Security Activity</h3>

        <div class="space-y-4">
          <div
            v-for="activity in securityActivities"
            :key="activity.id"
            class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200"
          >
            <div class="p-2 bg-blue-100 rounded-lg">
              <component :is="activity.icon" class="h-5 w-5 text-blue-600" />
            </div>
            <div class="flex-1">
              <p class="font-medium text-gray-900">{{ activity.description }}</p>
              <p class="text-sm text-gray-500">{{ activity.time }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium" :class="activity.statusColor">{{ activity.status }}</p>
              <p class="text-xs text-gray-500">{{ activity.location }}</p>
            </div>
          </div>
        </div>

        <button class="w-full mt-4 px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors font-medium flex items-center justify-center gap-2">
          View All Activity
          <ArrowRight class="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  Shield,
  ArrowLeft,
  ArrowRight,
  Monitor,
  Smartphone,
  Globe
} from 'lucide-vue-next'

// Reactive data
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const twoFactorEnabled = ref(true)

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const securityActivities = ref([
  {
    id: 1,
    description: 'Password changed',
    time: '2 weeks ago',
    status: 'Completed',
    statusColor: 'text-green-600',
    location: 'New York, US',
    icon: Lock
  },
  {
    id: 2,
    description: 'Login from new device',
    time: '3 days ago',
    status: 'Verified',
    statusColor: 'text-green-600',
    location: 'London, UK',
    icon: Monitor
  },
  {
    id: 3,
    description: 'Two-factor authentication enabled',
    time: '1 month ago',
    status: 'Active',
    statusColor: 'text-blue-600',
    location: 'System',
    icon: Shield
  },
  {
    id: 4,
    description: 'Mobile app login',
    time: '5 hours ago',
    status: 'Success',
    statusColor: 'text-green-600',
    location: 'iPhone 13',
    icon: Smartphone
  }
])

// Computed properties
const hasMinLength = computed(() => passwordForm.value.newPassword.length >= 8)
const hasUpperCase = computed(() => /[A-Z]/.test(passwordForm.value.newPassword))
const hasLowerCase = computed(() => /[a-z]/.test(passwordForm.value.newPassword))
const hasNumber = computed(() => /[0-9]/.test(passwordForm.value.newPassword))
const hasSpecialChar = computed(() => /[!@#$%^&*(),.?":{}|<>]/.test(passwordForm.value.newPassword))

const passwordsMatch = computed(() =>
  passwordForm.value.newPassword === passwordForm.value.confirmPassword &&
  passwordForm.value.newPassword.length > 0
)

const passwordStrength = computed(() => {
  const password = passwordForm.value.newPassword
  if (password.length === 0) {
    return { text: 'None', percentage: 0, color: 'text-gray-500', barColor: 'bg-gray-300' }
  }

  let strength = 0
  if (hasMinLength.value) strength += 25
  if (hasUpperCase.value) strength += 25
  if (hasLowerCase.value) strength += 25
  if (hasNumber.value || hasSpecialChar.value) strength += 25

  if (strength <= 25) {
    return { text: 'Weak', percentage: 25, color: 'text-red-600', barColor: 'bg-red-500' }
  } else if (strength <= 50) {
    return { text: 'Fair', percentage: 50, color: 'text-orange-600', barColor: 'bg-orange-500' }
  } else if (strength <= 75) {
    return { text: 'Good', percentage: 75, color: 'text-yellow-600', barColor: 'bg-yellow-500' }
  } else {
    return { text: 'Strong', percentage: 100, color: 'text-green-600', barColor: 'bg-green-500' }
  }
})

const canSubmit = computed(() => {
  return (
    passwordForm.value.currentPassword.length > 0 &&
    passwordForm.value.newPassword.length >= 8 &&
    passwordsMatch.value &&
    passwordStrength.value.percentage >= 75
  )
})

// Methods
const changePassword = () => {
  if (!canSubmit.value) return

  // Simulate API call
  console.log('Changing password...', {
    currentPassword: passwordForm.value.currentPassword,
    newPassword: passwordForm.value.newPassword
  })

  // Reset form
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }

  // Show success message (you can implement a toast notification here)
  alert('Password changed successfully!')
}

const toggleTwoFactor = () => {
  twoFactorEnabled.value = !twoFactorEnabled.value
  console.log('Two-factor authentication:', twoFactorEnabled.value ? 'enabled' : 'disabled')
}

// Lifecycle
onMounted(() => {
  // Any initialization code if needed
})
</script>