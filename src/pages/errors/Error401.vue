<script setup lang="ts">
import ThemeSwitcher from '@/components/ThemeSwitcher'
import Button from '@/components/Base/Button'
</script>

<template>
  <div
    class="relative min-h-screen py-2 overflow-hidden bg-gradient-to-br from-orange-600 via-orange-700 to-orange-800 dark:from-darkmode-900 dark:via-darkmode-800 dark:to-orange-900"
  >
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute w-64 h-64 rounded-full bg-white/5 -top-10 -left-10 blur-3xl animate-pulse"></div>
      <div class="absolute w-96 h-96 rounded-full bg-white/5 -bottom-20 -right-20 blur-3xl animate-pulse" style="animation-delay: 1s"></div>
      <div class="absolute w-80 h-80 rounded-full bg-blue-500/10 top-1/2 left-1/2 blur-3xl animate-pulse" style="animation-delay: 2s"></div>
    </div>

    <div class="relative z-10">
      <ThemeSwitcher />
      <div class="container px-4 mx-auto">
        <!-- BEGIN: Error Page -->
        <div
          class="flex flex-col items-center justify-center min-h-screen text-center error-page lg:flex-row lg:text-left"
        >
          <!-- User Lock Icon Illustration -->
          <div class="relative -intro-x lg:mr-20">
            <div class="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full scale-75"></div>
            <div class="relative bg-white/10 backdrop-blur-sm p-12 rounded-full border-4 border-white/30 transform transition-all duration-700 hover:scale-105 hover:-rotate-6">
              <svg class="w-48 h-48 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <!-- Animated question mark icon -->
              <div class="absolute bottom-8 right-8 bg-orange-500 rounded-full p-3 animate-bounce-slow">
                <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div class="mt-10 text-white lg:mt-0 max-w-xl">
            <!-- 401 Number with gradient and shadow -->
            <div class="relative font-bold intro-x">
              <div class="absolute inset-0 text-8xl lg:text-9xl bg-gradient-to-r from-white to-blue-300 bg-clip-text blur-sm">
                401
              </div>
              <div class="relative text-8xl lg:text-9xl bg-gradient-to-r from-white via-blue-200 to-blue-300 bg-clip-text text-transparent animate-pulse">
                401
              </div>
            </div>

            <!-- Title with animation -->
            <div class="mt-8 text-2xl font-bold intro-x lg:text-4xl drop-shadow-lg">
              Authentication Required
            </div>

            <!-- Description -->
            <div class="mt-4 text-base intro-x lg:text-lg text-white/90 leading-relaxed">
              You need to be authenticated to access this page.
              Please log in with your credentials to continue.
            </div>

            <!-- Info Box -->
            <div class="mt-6 p-4 bg-blue-500/20 backdrop-blur-sm rounded-lg border-2 border-blue-400/50 intro-x">
              <div class="flex items-start gap-3">
                <svg class="w-6 h-6 text-blue-300 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
                <div class="text-left">
                  <p class="text-sm font-semibold text-blue-100 mb-1">Authentication Missing</p>
                  <p class="text-xs text-blue-200/80">
                    Your session may have expired or you haven't logged in yet. Please authenticate to proceed.
                  </p>
                </div>
              </div>
            </div>

            <!-- What to Do -->
            <div class="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 intro-x">
              <p class="text-sm font-semibold text-white/90 mb-3 text-left">What you can do:</p>
              <ul class="text-sm text-white/70 text-left space-y-2">
                <li class="flex items-start gap-2">
                  <svg class="w-4 h-4 mt-0.5 flex-shrink-0 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span>Sign in with your account credentials</span>
                </li>
                <li class="flex items-start gap-2">
                  <svg class="w-4 h-4 mt-0.5 flex-shrink-0 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span>Create a new account if you don't have one</span>
                </li>
                <li class="flex items-start gap-2">
                  <svg class="w-4 h-4 mt-0.5 flex-shrink-0 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span>Reset your password if you forgot it</span>
                </li>
              </ul>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 mt-8 intro-x">
              <Button
                class="px-6 py-3 text-white transition-all duration-300 border-2 border-white bg-white/10 backdrop-blur-sm hover:bg-white hover:text-orange-700 hover:scale-105 hover:shadow-xl dark:border-darkmode-400 dark:text-slate-200 dark:hover:bg-darkmode-400 dark:hover:text-white font-medium rounded-lg"
                @click="$router.push({ name: 'login' })">
                <span class="flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In
                </span>
              </Button>

              <Button
                class="px-6 py-3 text-white transition-all duration-300 border-2 border-white/50 hover:border-white hover:bg-white/10 hover:scale-105 backdrop-blur-sm dark:border-darkmode-400 dark:text-slate-200 dark:hover:bg-darkmode-400/50 font-medium rounded-lg"
                @click="$router.push({ name: 'register' })">
                <span class="flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Create Account
                </span>
              </Button>
            </div>

            <!-- Additional Links -->
            <div class="flex items-center justify-center gap-6 mt-6 intro-x">
              <button
                @click="$router.push({ name: 'dashboard' })"
                class="text-sm text-white/70 hover:text-white underline transition-colors duration-300">
                Back to Home
              </button>
              <span class="text-white/50">•</span>
              <button
                @click="$router.push({ name: 'forgot-password' })"
                class="text-sm text-white/70 hover:text-white underline transition-colors duration-300">
                Forgot Password?
              </button>
            </div>
          </div>
        </div>
        <!-- END: Error Page -->
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.6;
  }
}

.animate-pulse {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(-8%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}

.animate-bounce-slow {
  animation: bounce-slow 2s infinite;
}
</style>