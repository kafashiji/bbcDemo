import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Index',
    component: () => import('../pageview/IndexVue.vue'),
  },
  {
    path: '/video/:id',
    name: 'Video',
    component: () => import('../pageview/VideoDetail.vue'),
    props: route => ({
      id: route.params.id,
      // 可选：将查询参数转为props
      timestamp: Date.now(),
      from: route.query.from 
    })
  },
  {
    path: '/account',
    name: 'Account',
    component: () => import('../pageview/account/BBachome.vue'),
  },
  {
    path: '/accenter',
    name: 'Accenter',
    component: () =>import('../pageview/account/BBacenter.vue'),
    children: [
      {
        path: 'avatar',
        name: 'Avatar',
        component: () => import('../pageview/account/BBacavatar.vue'),
      },
      {
        path: 'info',
        name: 'Info',
        component: () => import('../pageview/account/BBacinfo.vue')
      },
      {
        path: 'security',
        name: 'Security',
        component: () => import('../pageview/account/BBacSecurity.vue') 
      }
    ]
  },
  {
    path: '/platform',
    name: 'Platform',
    component: () => import('../pageview/platform/BBvchome.vue'),
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../pageview/platform/BBvchome.vue')
  },
  {
    path: '/upload',
    name: 'Upload',
    component: () => import('../pageview/platform/BBUploader.vue')
  },
  {
    path: '/Vsearch',
    name: 'Vsearch',
    component: () => import('../pageview/search/VideoSearch.vue')
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
