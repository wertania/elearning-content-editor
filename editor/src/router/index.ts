import * as VueRouter from 'vue-router';

const routes = [
  {
    path: '/',
    redirect: { name: 'view' },
  },
  {
    path: '/login',
    component: () => import('../views/Login.vue'),
    name: 'login',
  },
  {
    path: '/edit/:documentId?',
    component: () => import('../views/DocumentsView.vue'),
    name: 'edit',
  },
  {
    path: '/view/:documentId?',
    component: () => import('../views/DocumentsView.vue'),
    name: 'view',
  },
  {
    path: '/media/:documentId?',
    component: () => import('../views/MediaViewer.vue'),
    name: 'media',
  },
  {
    path: '/smart-video-dashboard/',
    component: () => import('../views/SmartVideoDashboard.vue'),
    name: 'smart-video-dashboard',
  },
  {
    path: '/demo/',
    component: () => import('../views/DemoView.vue'),
    name: 'demo',
  },
];

export const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
});
