import type { RouteRecordRaw } from 'vue-router'
import Layout from '@/themes'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    meta: { middleware: 'auth' },
    children: [
      { path: 'dashboard', name: 'dashboard', component: () => import('@/pages/dashboard/DashboardUser.vue'), meta: { pageTitle: 'Dashboard' } },
      { path: 'workspaces', name: 'workspaces', component: () => import('@/pages/app/workspace/Workspaces.vue'), meta: { pageTitle: 'Workspaces' } },
      { path: 'projects', name: 'projects', component: () => import('@/pages/app/project/Projects.vue'), meta: { pageTitle: 'Projects' } },
      { path: 'tasks', name: 'tasks', component: () => import('@/pages/app/tasks/Tasks.vue'), meta: { pageTitle: 'Tasks' } },
      { path: 'tags', name: 'tags', component: () => import('@/pages/app/tags/Tags.vue'), meta: { pageTitle: 'Tags' } },
      { path: 'time-tracking', name: 'time-tracking', component: () => import('@/pages/app/time-tracking/TimeTracking.vue'), meta: { pageTitle: 'Time Tracking' } },
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