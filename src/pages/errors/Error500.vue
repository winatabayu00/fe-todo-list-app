<script setup lang="ts">
import Button from '@/components/Base/Button'
import { ref } from 'vue'

const isRefreshing = ref(false)

const handleRefresh = () => {
  isRefreshing.value = true
  setTimeout(() => {
    window.location.reload()
  }, 500)
}
</script>

<template>
  <div
    class="relative min-h-screen py-2 overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 dark:from-darkmode-900 dark:via-purple-900 dark:to-darkmode-800"
  >
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute w-64 h-64 rounded-full bg-red-500/10 -top-10 -left-10 blur-3xl animate-pulse"></div>
      <div class="absolute w-96 h-96 rounded-full bg-red-500/10 -bottom-20 -right-20 blur-3xl animate-pulse"
           style="animation-delay: 1s"></div>
      <div class="absolute w-80 h-80 rounded-full bg-orange-500/10 top-1/2 left-1/2 blur-3xl animate-pulse"
           style="animation-delay: 2s"></div>

      <!-- Floating Error Symbols -->
      <div class="absolute top-20 left-20 text-red-500/20 text-6xl animate-float" style="animation-delay: 0s">⚠</div>
      <div class="absolute top-40 right-32 text-orange-500/20 text-5xl animate-float" style="animation-delay: 1s">⚡
      </div>
      <div class="absolute bottom-32 left-40 text-red-500/20 text-7xl animate-float" style="animation-delay: 2s">!</div>
    </div>

    <div class="relative z-10">
<!--      <ThemeSwitcher />-->
      <div class="container px-4 mx-auto">
        <!-- BEGIN: Error Page -->
        <div
          class="flex flex-col items-center justify-center min-h-screen text-center error-page lg:flex-row lg:text-left"
        >
          <!-- Server Error Icon Illustration -->
          <div class="relative -intro-x lg:mr-20">
            <div class="absolute inset-0 bg-red-500/20 blur-3xl rounded-full scale-75 animate-pulse-slow"></div>
            <div
              class="relative bg-white/10 backdrop-blur-sm p-12 rounded-full border-4 border-red-500/40 transform transition-all duration-700 hover:scale-105">
              <!-- Server with error -->
              <div class="relative">
                <svg class="w-48 h-48 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
                <!-- Animated spark/error effect -->
                <div class="absolute top-4 right-4">
                  <div class="relative">
                    <div class="absolute inset-0 bg-red-500 rounded-full blur-md animate-ping"></div>
                    <div class="relative bg-red-500 rounded-full p-2">
                      <svg class="w-6 h-6 text-white animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clip-rule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-10 text-white lg:mt-0 max-w-xl">
            <!-- 500 Number with gradient and shadow -->
            <div class="relative font-bold intro-x">
              <div
                class="absolute inset-0 text-8xl lg:text-9xl bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text blur-sm">
                500
              </div>
              <div
                class="relative text-8xl lg:text-9xl bg-gradient-to-r from-red-300 via-red-400 to-orange-400 bg-clip-text text-transparent animate-pulse">
                500
              </div>
            </div>

            <!-- Title with animation -->
            <div class="mt-8 text-2xl font-bold intro-x lg:text-4xl drop-shadow-lg">
              Internal Server Error
            </div>

            <!-- Description -->
            <div class="mt-4 text-base intro-x lg:text-lg text-white/90 leading-relaxed">
              Oops! Something went wrong on our end.
              Our servers encountered an unexpected error and couldn't complete your request.
            </div>

            <!-- Error Box -->
            <div class="mt-6 p-4 bg-red-500/20 backdrop-blur-sm rounded-lg border-2 border-red-400/50 intro-x">
              <div class="flex items-start gap-3">
                <svg class="w-6 h-6 text-red-300 flex-shrink-0 mt-0.5 animate-pulse" fill="currentColor"
                     viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clip-rule="evenodd" />
                </svg>
                <div class="text-left">
                  <p class="text-sm font-semibold text-red-100 mb-1">Server Issue Detected</p>
                  <p class="text-xs text-red-200/80">
                    This is not your fault. Our technical team has been automatically notified and is working on a fix.
                  </p>
                </div>
              </div>
            </div>

            <!-- What to Do -->
            <div class="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 intro-x">
              <p class="text-sm font-semibold text-white/90 mb-3 text-left">What you can try:</p>
              <ul class="text-sm text-white/70 text-left space-y-2">
                <li class="flex items-start gap-2">
                  <svg class="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                          d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                          clip-rule="evenodd" />
                  </svg>
                  <span>Refresh the page and try again</span>
                </li>
                <li class="flex items-start gap-2">
                  <svg class="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clip-rule="evenodd" />
                  </svg>
                  <span>Wait a few minutes and come back</span>
                </li>
                <li class="flex items-start gap-2">
                  <svg class="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span>Contact support if the issue persists</span>
                </li>
              </ul>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 mt-8 intro-x">
              <Button
                :disabled="isRefreshing"
                class="px-6 py-3 text-white transition-all duration-300 border-2 border-white bg-white/10 backdrop-blur-sm hover:bg-white hover:text-purple-900 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 dark:border-darkmode-400 dark:text-slate-200 dark:hover:bg-darkmode-400 dark:hover:text-white font-medium rounded-lg"
                @click="handleRefresh">
                <span class="flex items-center gap-2">
                  <svg class="w-5 h-5" :class="{ 'animate-spin': isRefreshing }" fill="none" stroke="currentColor"
                       viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {{ isRefreshing ? 'Refreshing...' : 'Refresh Page' }}
                </span>
              </Button>

              <Button
                class="px-6 py-3 text-white transition-all duration-300 border-2 border-white/50 hover:border-white hover:bg-white/10 hover:scale-105 backdrop-blur-sm dark:border-darkmode-400 dark:text-slate-200 dark:hover:bg-darkmode-400/50 font-medium rounded-lg"
                @click="$router.push({ name: 'dashboard' })">
                <span class="flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Back to Home
                </span>
              </Button>
            </div>

            <!-- Status Update -->
            <div class="mt-6 intro-x">
              <p class="text-xs text-white/60">
                Error Code: 500 • Server Error • Our team has been notified
              </p>
            </div>

            <!-- Contact Support -->
            <div class="mt-4 intro-x">
              <button
                class="text-sm text-white/70 hover:text-white underline transition-colors duration-300 flex items-center gap-2 mx-auto lg:mx-0">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Report This Issue
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

@keyframes pulse-slow {
  0%, 100% {
    opacity: 0.2;
    transform: scale(1);
  }
  50% {
    opacity: 0.4;
    transform: scale(1.1);
  }
}

.animate-pulse-slow {
  animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-20px) rotate(5deg);
  }
  66% {
    transform: translateY(-10px) rotate(-5deg);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-ping {
  animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
}
</style>