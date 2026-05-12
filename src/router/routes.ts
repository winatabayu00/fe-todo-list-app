import type { RouteRecordRaw } from 'vue-router'
import Layout from '@/themes'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    meta: {
      middleware: 'auth'
    },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/pages/dashboard/Dashboard.vue'),
        meta: { pageTitle: 'Dashboard' }
      }
    ]
  },

  {
    path: '/admin',
    component: Layout,
    meta: {
      middleware: 'auth'
    },
    children: [
      {
        path: '/admin',
        redirect: '/dashboard'
      },
      {
        path: 'dashboard',
        name: 'dashboard-view',
        component: () => import('@/pages/dashboard/DashboardUser.vue'),
        meta: { pageTitle: 'Dashboard Admin' }
      }
    ]
  },

  {
    path: '/user',
    component: Layout,
    meta: {
      middleware: 'auth'
    },
    children: [
      {
        path: 'profiles',
        component: () => import('@/pages/profiles/MyProfilePage.vue'),
        meta: { pageTitle: 'My Profile' }
      }, {
        path: 'change-password',
        component: () => import('@/pages/profiles/ChangePasswordPage.vue'),
        meta: { pageTitle: 'Change Password' }
      }
    ]
  },

  {
    path: '/app',
    component: Layout,
    meta: {
      middleware: 'auth'
    },
    children: [
      {
        path: 'dashboard',
        component: () => import('@/pages/dashboard/DashboardUser.vue'),
        meta: { pageTitle: 'Dashboard' }
      },
      // {
      //   path: 'subscription',
      //   children: [
      //     {
      //       path: 'my-subscription',
      //       component: () => import('@/pages/app/subscription/MySubscription.vue'),
      //       meta: { pageTitle: 'My Subscription' }
      //     }, {
      //       path: 'billing-history',
      //       component: () => import('@/pages/app/subscription/BillingHistory.vue'),
      //       meta: { pageTitle: 'Billing History' }
      //     }, {
      //       path: 'manage-subscription',
      //       component: () => import('@/pages/app/subscription/ManageSubscription.vue'),
      //       meta: { pageTitle: 'Change Plan' }
      //     }
      //   ]
      // }, {
      //   path: 'trading-room',
      //   children: [
      //     {
      //       path: 'accounts',
      //       component: () => import('@/pages/app/trading-room/accounts/AccountListPage.vue'),
      //       meta: { pageTitle: 'My Accounts' }
      //     }, {
      //       path: 'accounts/:id',
      //       name: 'account-detail',
      //       component: () => import('@/pages/app/trading-room/accounts/AccountDetailPage.vue'),
      //       props: true
      //     }, {
      //       path: 'trading-orders',
      //       component: () => import('@/pages/app/trading-room/trading-order/TradingOrdersPage.vue'),
      //       meta: { pageTitle: 'Trading Orders' }
      //     }, {
      //       path: 'trading-orders/:id',
      //       name: 'OrderDetails',
      //       component: () => import('@/pages/app/trading-room/trading-order/OrderDetailsPage.vue'),
      //       props: true
      //     }, {
      //       path: 'signals',
      //       component: () => import('@/pages/app/trading-room/signals/SignalPage.vue'),
      //       meta: { pageTitle: 'Signals' }
      //     }, {
      //       path: 'reports',
      //       component: () => import('@/pages/app/trading-room/reports/ReportPage.vue'),
      //       meta: { pageTitle: 'Reports' }
      //     }
      //   ]
      // }, {
      //   path: 'analytics',
      //   children: [
      //     {
      //       path: 'profit-loss',
      //       component: () => import('@/pages/app/analytics/pnl/ProfitNLossPage.vue'),
      //       meta: { pageTitle: 'Profit & Loss' }
      //     }, {
      //       path: 'win-ratio',
      //       component: () => import('@/pages/app/analytics/win-ratio/WinRatioPage.vue'),
      //       meta: { pageTitle: 'Win Ratio' }
      //     }, {
      //       path: 'risk-reward-ratio',
      //       component: () => import('@/pages/app/analytics/risk-reward-ratio/RiskRewardRatioPage.vue'),
      //       meta: { pageTitle: 'Risk Reward Ratio' }
      //     }, {
      //       path: 'trading-performance',
      //       component: () => import('@/pages/app/analytics/trading-performance/TradingPerformancePage.vue'),
      //       meta: { pageTitle: 'Trading Performance' }
      //     }
      //   ]
      // }
    ]
  },

  {
    path: '/',
    name: '/',
    component: () => import('@/pages/dashboard/Dashboard.vue'),
    meta: { pageTitle: 'landing page' }
  },

  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/authentication/Login.vue'),
    meta: { pageTitle: 'Login' }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/pages/authentication/Register.vue'),
    meta: { pageTitle: 'Register' }
  },

  // system layouts
  {
    path: '/404',
    name: '404',
    component: () => import('@/pages/errors/Error404.vue'),
    meta: {
      pageTitle: 'error404'
    }
  }
]

export default routes
