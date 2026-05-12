<script setup lang="ts">
import ThemeSwitcher from '@/components/ThemeSwitcher'
import Button from '@/components/Base/Button'
</script>

<template>
  <div
    class="relative min-h-screen py-2 overflow-hidden bg-gradient-to-br from-red-600 via-red-700 to-red-800 dark:from-darkmode-900 dark:via-darkmode-800 dark:to-red-900"
  >
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute w-64 h-64 rounded-full bg-white/5 -top-10 -left-10 blur-3xl animate-pulse"></div>
      <div class="absolute w-96 h-96 rounded-full bg-white/5 -bottom-20 -right-20 blur-3xl animate-pulse" style="animation-delay: 1s"></div>
      <div class="absolute w-80 h-80 rounded-full bg-yellow-500/10 top-1/2 left-1/2 blur-3xl animate-pulse" style="animation-delay: 2s"></div>
    </div>

    <div class="relative z-10">
      <ThemeSwitcher />
      <div class="container px-4 mx-auto">
        <!-- BEGIN: Error Page -->
        <div
          class="flex flex-col items-center justify-center min-h-screen text-center error-page lg:flex-row lg:text-left"
        >
          <!-- Lock Icon Illustration -->
          <div class="relative -intro-x lg:mr-20">
            <div class="absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full scale-75"></div>
            <div class="relative bg-white/10 backdrop-blur-sm p-12 rounded-full border-4 border-white/30 transform transition-all duration-700 hover:scale-105 hover:rotate-6">
              <svg class="w-48 h-48 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <!-- Animated shield icon -->
              <div class="absolute top-8 right-8 bg-red-500 rounded-full p-3 animate-bounce">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div class="mt-10 text-white lg:mt-0 max-w-xl">
            <!-- 403 Number with gradient and shadow -->
            <div class="relative font-bold intro-x">
              <div class="absolute inset-0 text-8xl lg:text-9xl bg-gradient-to-r from-white to-yellow-300 bg-clip-text blur-sm">
                403
              </div>
              <div class="relative text-8xl lg:text-9xl bg-gradient-to-r from-white via-yellow-200 to-yellow-300 bg-clip-text text-transparent animate-pulse">
                403
              </div>
            </div>

            <!-- Title with animation -->
            <div class="mt-8 text-2xl font-bold intro-x lg:text-4xl drop-shadow-lg">
              Access Denied
            </div>

            <!-- Description -->
            <div class="mt-4 text-base intro-x lg:text-lg text-white/90 leading-relaxed">
              Sorry, you don't have permission to access this resource.
              This area is restricted and requires proper authorization.
            </div>

            <!-- Warning Box -->
            <div class="mt-6 p-4 bg-yellow-500/20 backdrop-blur-sm rounded-lg border-2 border-yellow-400/50 intro-x">
              <div class="flex items-start gap-3">
                <svg class="w-6 h-6 text-yellow-300 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                <div class="text-left">
                  <p class="text-sm font-semibold text-yellow-100 mb-1">Access Restricted</p>
                  <p class="text-xs text-yellow-200/80">
                    If you believe this is an error, please contact your administrator for assistance.
                  </p>
                </div>
              </div>
            </div>

            <!-- Possible Reasons -->
            <div class="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 intro-x">
              <p class="text-sm font-semibold text-white/90 mb-3 text-left">Possible reasons:</p>
              <ul class="text-sm text-white/70 text-left space-y-2">
                <li class="flex items-start gap-2">
                  <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span>You don't have the required permissions</span>
                </li>
                <li class="flex items-start gap-2">
                  <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span>Your session may have expired</span>
                </li>
                <li class="flex items-start gap-2">
                  <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span>The resource is restricted to certain users</span>
                </li>
              </ul>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 mt-8 intro-x">
              <Button
                class="px-6 py-3 text-white transition-all duration-300 border-2 border-white bg-white/10 backdrop-blur-sm hover:bg-white hover:text-red-700 hover:scale-105 hover:shadow-xl dark:border-darkmode-400 dark:text-slate-200 dark:hover:bg-darkmode-400 dark:hover:text-white font-medium rounded-lg"
                @click="$router.push({ name: 'dashboard' })">
                <span class="flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Back to Home
                </span>
              </Button>

              <Button
                class="px-6 py-3 text-white transition-all duration-300 border-2 border-white/50 hover:border-white hover:bg-white/10 hover:scale-105 backdrop-blur-sm dark:border-darkmode-400 dark:text-slate-200 dark:hover:bg-darkmode-400/50 font-medium rounded-lg"
                @click="$router.push({ name: 'login' })">
                <span class="flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In
                </span>
              </Button>
            </div>

            <!-- Contact Support -->
            <div class="mt-6 intro-x">
              <button class="text-sm text-white/70 hover:text-white underline transition-colors duration-300">
                Contact Support for Help
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

@keyframes bounce {
  0%, 100% {
    transform: translateY(-5%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}
</style>