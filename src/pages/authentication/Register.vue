<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import logoUrl from '@/assets/images/logo.svg'
import illustrationUrl from '@/assets/images/illustration.svg'
import { FormInput } from '@/components/Base/Form'
import Button from '@/components/Base/Button'
import useAuth from '@/core/composables/useAuth'

const router = useRouter()
const { register, isLoading, error, validationErrors, clearError } = useAuth()

// Form data
const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
})

// Local UI state
const formError = ref('')
const isSubmitting = ref(false)

// Validate form before submit
const validateForm = (): boolean => {
  if (!form.value.name.trim()) {
    formError.value = 'Name is required'
    return false
  }
  if (!form.value.email.trim()) {
    formError.value = 'Email is required'
    return false
  }
  if (!/\S+@\S+\.\S+/.test(form.value.email)) {
    formError.value = 'Email is invalid'
    return false
  }
  if (!form.value.password) {
    formError.value = 'Password is required'
    return false
  }
  if (form.value.password.length < 8) {
    formError.value = 'Password must be at least 8 characters'
    return false
  }
  if (form.value.password !== form.value.password_confirmation) {
    formError.value = 'Passwords do not match'
    return false
  }
  formError.value = ''
  return true
}

const clearErrors = () => {
  formError.value = ''
  clearError()
}

const handleRegister = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  clearErrors()

  try {
    await register({
      name: form.value.name,
      email: form.value.email,
      password: form.value.password,
      password_confirmation: form.value.password_confirmation
    })
    router.push({ name: 'dashboard' })
  } catch (err) {
    // Error already handled in composable, but we can show a generic message
    if (!validationErrors.value && !error.value) {
      formError.value = 'Registration failed. Please try again.'
    }
  } finally {
    isSubmitting.value = false
  }
}

// Clear errors when user types
watch(form, () => {
  if (formError.value || error.value || Object.keys(validationErrors.value).length) {
    clearErrors()
  }
}, { deep: true })
</script>

<template>
  <div
      :class="[
      'p-3 sm:px-8 relative h-screen lg:overflow-hidden bg-primary xl:bg-white dark:bg-darkmode-800 xl:dark:bg-darkmode-600',
      'before:hidden before:xl:block before:content-[\'\'] before:w-[57%] before:-mt-[28%] before:-mb-[16%] before:-ml-[13%] before:absolute before:inset-y-0 before:left-0 before:transform before:rotate-[-4.5deg] before:bg-primary/20 before:rounded-[100%] before:dark:bg-darkmode-400',
      'after:hidden after:xl:block after:content-[\'\'] after:w-[57%] after:-mt-[20%] after:-mb-[13%] after:-ml-[13%] after:absolute after:inset-y-0 after:left-0 after:transform after:rotate-[-4.5deg] after:bg-primary after:rounded-[100%] after:dark:bg-darkmode-700',
    ]"
  >
    <div class="container relative z-10 sm:px-10">
      <div class="block grid-cols-2 gap-4 xl:grid">
        <!-- Register Info -->
        <div class="flex-col hidden min-h-screen xl:flex">
          <a href="" class="flex items-center pt-5 -intro-x">
            <img alt="Logo" class="w-6" :src="logoUrl" />
            <span class="ml-3 text-lg text-white">Todo Manager</span>
          </a>
          <div class="my-auto">
            <img alt="Illustration" class="w-1/2 -mt-16 -intro-x" :src="illustrationUrl" />
            <div class="mt-10 text-4xl font-medium leading-tight text-white -intro-x">
              Sign up to <br />
              manage your tasks
            </div>
            <div class="mt-5 text-lg text-white -intro-x text-opacity-70 dark:text-slate-400">
              Organize workspaces, projects, and track time efficiently.
            </div>
          </div>
        </div>

        <!-- Register Form -->
        <div class="flex h-screen py-5 my-10 xl:h-auto xl:py-0 xl:my-0">
          <div
              class="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md xl:ml-20 dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto"
          >
            <h2 class="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left">
              Sign Up
            </h2>
            <div class="mt-2 text-center intro-x text-slate-400 dark:text-slate-400 xl:hidden">
              Create your account to get started.
            </div>

            <div class="mt-8 intro-x">
              <FormInput
                  v-model="form.name"
                  type="text"
                  class="block px-4 py-3 intro-x login__input min-w-full xl:min-w-[350px]"
                  placeholder="Full Name"
                  :disabled="isSubmitting || isLoading"
              />
              <p v-if="validationErrors.name" class="text-red-500 text-sm mt-1">{{ validationErrors.name[0] }}</p>

              <FormInput
                  v-model="form.email"
                  type="email"
                  class="block px-4 py-3 mt-4 intro-x login__input min-w-full xl:min-w-[350px]"
                  placeholder="Email"
                  :disabled="isSubmitting || isLoading"
              />
              <p v-if="validationErrors.email" class="text-red-500 text-sm mt-1">{{ validationErrors.email[0] }}</p>

              <FormInput
                  v-model="form.password"
                  type="password"
                  class="block px-4 py-3 mt-4 intro-x login__input min-w-full xl:min-w-[350px]"
                  placeholder="Password"
                  :disabled="isSubmitting || isLoading"
              />
              <p v-if="validationErrors.password" class="text-red-500 text-sm mt-1">{{ validationErrors.password[0] }}</p>

              <FormInput
                  v-model="form.password_confirmation"
                  type="password"
                  class="block px-4 py-3 mt-4 intro-x login__input min-w-full xl:min-w-[350px]"
                  placeholder="Confirm Password"
                  :disabled="isSubmitting || isLoading"
              />
            </div>

            <!-- Form error -->
            <div v-if="formError || error" class="p-3 mt-4 text-sm text-red-700 bg-red-100 rounded-md intro-x">
              {{ formError || error }}
            </div>

            <div class="mt-5 text-center intro-x xl:mt-8 xl:text-left">
              <Button
                  variant="primary"
                  class="w-full px-4 py-3 align-top xl:w-32 xl:mr-3"
                  :disabled="isSubmitting || isLoading"
                  @click="handleRegister"
              >
                <template v-if="isSubmitting || isLoading">
                  <span class="inline-flex items-center">Processing...</span>
                </template>
                <span v-else>Register</span>
              </Button>

              <Button
                  variant="outline-secondary"
                  class="w-full px-4 py-3 mt-3 align-top xl:w-32 xl:mt-0"
                  @click="router.push({ name: 'login' })"
                  :disabled="isSubmitting || isLoading"
              >
                Sign in
              </Button>
            </div>

            <div class="mt-10 text-center intro-x xl:mt-24 text-slate-600 dark:text-slate-500 xl:text-left">
              By signing up, you agree to our
              <a class="text-primary dark:text-slate-200 hover:underline" href="#">Terms</a>
              &
              <a class="text-primary dark:text-slate-200 hover:underline" href="#">Privacy Policy</a>.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login__input:focus {
  border-color: #3f83f8;
  box-shadow: 0 0 0 3px rgba(63, 131, 248, 0.2);
  outline: none;
}
</style>