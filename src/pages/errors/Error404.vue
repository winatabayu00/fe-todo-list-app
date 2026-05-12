<script setup lang="ts">
import errorIllustration from '@/assets/images/error-illustration.svg'
import Button from '@/components/Base/Button'
</script>

<template>
  <div
    class="relative min-h-screen py-2 overflow-hidden bg-gradient-to-br from-theme-1 via-theme-2 to-theme-1 dark:from-darkmode-900 dark:via-darkmode-800 dark:to-darkmode-900"
  >
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute w-64 h-64 rounded-full bg-white/5 -top-10 -left-10 blur-3xl animate-pulse"></div>
      <div class="absolute w-96 h-96 rounded-full bg-white/5 -bottom-20 -right-20 blur-3xl animate-pulse" style="animation-delay: 1s"></div>
      <div class="absolute w-80 h-80 rounded-full bg-white/5 top-1/2 left-1/2 blur-3xl animate-pulse" style="animation-delay: 2s"></div>
    </div>

    <div class="relative z-10">
      <div class="container px-4 mx-auto">
        <!-- BEGIN: Error Page -->
        <div
          class="flex flex-col items-center justify-center min-h-screen text-center error-page lg:flex-row lg:text-left"
        >
          <div class="relative -intro-x lg:mr-20">
            <!-- Glowing effect behind illustration -->
            <div class="absolute inset-0 bg-white/10 blur-3xl rounded-full scale-75"></div>
            <img
              alt="404 Error Illustration"
              class="relative w-full max-w-[450px] h-auto transform transition-transform duration-700 hover:scale-105 hover:rotate-2"
              :src="errorIllustration"
            />
          </div>

          <div class="mt-10 text-white lg:mt-0 max-w-xl">
            <!-- 404 Number with gradient and shadow -->
            <div class="relative font-bold intro-x">
              <div class="absolute inset-0 text-8xl lg:text-9xl bg-gradient-to-r from-white to-white/50 bg-clip-text blur-sm">
                404
              </div>
              <div class="relative text-8xl lg:text-9xl bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent animate-pulse">
                404
              </div>
            </div>

            <!-- Title with animation -->
            <div class="mt-8 text-2xl font-bold intro-x lg:text-4xl drop-shadow-lg">
              Oops! Page Not Found
            </div>

            <!-- Description -->
            <div class="mt-4 text-base intro-x lg:text-lg text-white/90 leading-relaxed">
              The page you're looking for seems to have wandered off into the digital void.
              Don't worry though, let's get you back on track!
            </div>

            <!-- Suggestions Box -->
            <div class="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 intro-x">
              <p class="text-sm text-white/80 mb-2">You might want to:</p>
              <ul class="text-sm text-white/70 text-left space-y-1">
                <li>• Check the URL for typos</li>
                <li>• Return to the homepage</li>
                <li>• Use the search function</li>
              </ul>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 mt-8 intro-x">
              <Button
                class="px-6 py-3 text-white transition-all duration-300 border-2 border-white bg-white/10 backdrop-blur-sm hover:bg-white hover:text-theme-1 hover:scale-105 hover:shadow-xl dark:border-darkmode-400 dark:text-slate-200 dark:hover:bg-darkmode-400 dark:hover:text-white font-medium rounded-lg"
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
                @click="$router.go(-1)">
                <span class="flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Go Back
                </span>
              </Button>
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
</style>