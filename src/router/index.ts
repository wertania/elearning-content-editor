import * as VueRouter from 'vue-router';

const routes = [
  {
    path: '/',
    component: () => import('../views/Home.vue'),
    name: 'home',
  },
  {
    path: '/edit/:id?',
    component: () => import('../views/DocumentEditor.vue'),
    name: 'edit',
  },
];

export const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
});
