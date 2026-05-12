<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import logoUrl from '@/assets/images/logo.svg'
import illustrationUrl from '@/assets/images/illustration.svg'
import { FormInput, FormCheck } from '@/components/Base/Form'
import Button from '@/components/Base/Button'
import useAuth from '@/core/composables/useAuth'

const router = useRouter()
const { login, isLoading: authLoading, error: authError, validationErrors, clearError } = useAuth()

const credentials = ref({
  email: 'admin@example.com',
  password: 'password',
  remember_me: false
})

const formError = ref('')
const isSubmitting = ref(false)

const validateForm = (): boolean => {
  if (!credentials.value.email.trim()) {
    formError.value = 'Email is required'
    return false
  }
  if (!credentials.value.password) {
    formError.value = 'Password is required'
    return false
  }
  if (credentials.value.password.length < 6) {
    formError.value = 'Password must be at least 6 characters'
    return false
  }
  formError.value = ''
  return true
}

const clearErrors = () => {
  formError.value = ''
  clearError()
}

const handleLogin = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  clearErrors()

  try {
    await login({
      email: credentials.value.email,
      password: credentials.value.password,
      remember_me: credentials.value.remember_me
    })
    router.push({ name: 'dashboard' })
  } catch (err) {
    // Error sudah di-handle di useAuth
  } finally {
    isSubmitting.value = false
  }
}

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !isSubmitting.value && !authLoading.value) {
    handleLogin()
  }
}

watch(credentials, () => {
  if (formError.value || authError.value) clearErrors()
}, { deep: true })
</script>

<template>
  <div class="p-3 sm:px-8 relative h-screen lg:overflow-hidden bg-primary xl:bg-white dark:bg-darkmode-800 xl:dark:bg-darkmode-600">
    <div class="container relative z-10 sm:px-10">
      <div class="block grid-cols-2 gap-4 xl:grid">
        <!-- Left Side - Branding (sama seperti sebelumnya) -->
        <div class="flex-col hidden min-h-screen xl:flex">
          <a href="" class="flex items-center pt-5 -intro-x">
            <img alt="Logo" class="w-6" :src="logoUrl" />
            <span class="ml-3 text-lg text-white">Todo Manager</span>
          </a>
          <div class="my-auto">
            <img alt="Illustration" class="w-1/2 -mt-16 -intro-x" :src="illustrationUrl" />
            <div class="mt-10 text-4xl font-medium leading-tight text-white -intro-x">
              Sign in to your<br />account
            </div>
            <div class="mt-5 text-lg text-white -intro-x text-opacity-70">
              Manage tasks, projects, and workspaces
            </div>
          </div>
        </div>

        <!-- Right Side - Login Form -->
        <div class="flex h-screen py-5 my-10 xl:h-auto xl:py-0 xl:my-0">
          <div class="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md xl:ml-20 dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto">
            <h2 class="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left">Sign In</h2>
            <div class="mt-2 text-center intro-x text-slate-400 xl:hidden">
              Sign in to manage your tasks
            </div>

            <div class="mt-8 intro-x">
              <FormInput
                  v-model="credentials.email"
                  type="email"
                  class="block px-4 py-3 intro-x login__input min-w-full xl:min-w-[350px]"
                  placeholder="Email"
                  :disabled="isSubmitting || authLoading"
                  @keyup="handleKeyPress"
              />
              <p v-if="validationErrors.email" class="text-red-500 text-sm mt-1">{{ validationErrors.email[0] }}</p>

              <FormInput
                  v-model="credentials.password"
                  type="password"
                  class="block px-4 py-3 mt-4 intro-x login__input min-w-full xl:min-w-[350px]"
                  placeholder="Password"
                  :disabled="isSubmitting || authLoading"
                  @keyup="handleKeyPress"
              />
              <p v-if="validationErrors.password" class="text-red-500 text-sm mt-1">{{ validationErrors.password[0] }}</p>
            </div>

            <div class="flex mt-4 text-xs intro-x text-slate-600 dark:text-slate-500 sm:text-sm">
              <div class="flex items-center mr-auto">
                <FormCheck.Input v-model="credentials.remember_me" id="remember-me" type="checkbox" class="mr-2 border" />
                <label class="cursor-pointer select-none" for="remember-me">Remember me</label>
              </div>
              <a href="" class="hover:underline">Forgot Password?</a>
            </div>

            <div v-if="formError || authError" class="p-3 mt-4 text-sm text-red-700 bg-red-100 rounded-md intro-x">
              {{ formError || authError }}
            </div>

            <div class="mt-5 text-center intro-x xl:mt-8 xl:text-left">
              <Button variant="primary" class="w-full px-4 py-3 align-top xl:w-32 xl:mr-3" :disabled="isSubmitting || authLoading" @click="handleLogin">
                <template v-if="isSubmitting || authLoading">
                  <span class="inline-flex items-center">Processing...</span>
                </template>
                <span v-else>Login</span>
              </Button>

              <Button variant="outline-secondary" class="w-full px-4 py-3 mt-3 align-top xl:w-32 xl:mt-0" @click="router.push({ name: 'register' })" :disabled="isSubmitting || authLoading">
                Register
              </Button>
            </div>

            <div class="mt-10 text-center intro-x xl:mt-24 text-slate-600 dark:text-slate-500 xl:text-left">
              By signing in, you agree to our <a class="text-primary hover:underline" href="#">Terms</a> & <a class="text-primary hover:underline" href="#">Privacy Policy</a>.
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