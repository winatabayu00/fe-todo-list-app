import type { RouteRecordRaw } from 'vue-router'
import Layout from '@/themes'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    meta: { middleware: 'auth' },
    children: [
      { path: 'dashboard', name: 'dashboard', component: () => import('@/pages/dashboard/DashboardUser.vue'), meta: { pageTitle: 'Dashboard' } },
      { path: 'user/my-profile', name: 'profile', component: () => import('@/pages/profiles/MyProfilePage.vue'), meta: { pageTitle: 'My Profile' } },
      { path: 'user/change-password', name: 'change-password', component: () => import('@/pages/profiles/ChangePasswordPage.vue'), meta: { pageTitle: 'Change Password' } }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/authentication/Login.vue'),
    meta: { pageTitle: 'Login', public: true }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/pages/authentication/Register.vue'),
    meta: { pageTitle: 'Register', public: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('@/pages/errors/Error404.vue'),
    meta: { pageTitle: '404 Not Found' }
  }
]

export default routes