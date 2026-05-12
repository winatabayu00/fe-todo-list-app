import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import routes from '@/router/routes'
import useCookie from '@/core/composables/useCookies'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes as RouteRecordRaw[]
})

router.addRoute({
  path: '/:pathMatch(.*)*',  // Wildcard untuk mencocokkan semua path yang tidak terdaftar
  name: '404',
  component: () => import('@/pages/errors/Error404.vue'),
  meta: { pageTitle: 'Page Not Found' }
})

router.addRoute({
  path: '/401',
  name: '401',
  component: () => import('@/pages/errors/Error401.vue'),
  meta: { pageTitle: 'Unauthorized', errorCode: 401, errorMessage: 'You are not authorized' }
})

router.addRoute({
  path: '/403',
  name: '403',
  component: () => import('@/pages/errors/Error403.vue'),
  meta: { pageTitle: 'Forbidden', errorCode: 403, errorMessage: 'Access forbidden' }
})

router.addRoute({
  path: '/500',
  name: '500',
  component: () => import('@/pages/errors/Error500.vue'),
  meta: { pageTitle: 'Server Error', errorCode: 500, errorMessage: 'Internal server error' }
})


router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  // PUBLIC ROUTES basis meta: recommended to mark routes with meta.public = true
  const publicRoutes = ['login', 'register'] // keep 404 out of public list
  if (publicRoutes.includes(to.name as string) || (to.meta && to.meta.public)) {
    return next()
  }

  // load from storage first (rebuild state). verifyAuth will validate token if present.
  authStore.loadAuthFromStorage()
  authStore.verifyAuth()

  // If route requires auth, guard it
  if (to.meta.middleware === 'auth' && !authStore.isAuthenticated) {
    return next({ name: 'login' })
  }

  next()
})

router.afterEach((to, from, next) => {
  const APP_TITLE = import.meta.env.VITE_APP_NAME
  document.title = to.meta.pageTitle
    ? `${to.meta.pageTitle} - ${APP_TITLE}`
    : APP_TITLE
})

export default router
