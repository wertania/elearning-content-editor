import * as VueRouter from 'vue-router';

const routes = [
  {
    path: '/',
    component: () => import('../views/HomeScreen.vue'),
    name: 'home',
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
    component: () => import('../views/MediaBrowser.vue'),
    name: 'media',
  },
  {
    path: '/smart-video-converter/',
    component: () => import('../views/SmartVideoConverter.vue'),
    name: 'smart-video-converter',
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
