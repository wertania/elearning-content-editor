import * as VueRouter from 'vue-router';
import { useGlobalStore } from '../stores/global';

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

router.beforeEach(async (to) => {
  const globalStore = useGlobalStore()

  // check if user is authenticated
  if (!globalStore.isLoggedIn) {
    await globalStore.init()
    // redirect to home page if user is not logged in
    if (!globalStore.isLoggedIn && to.name !== 'home') {
      return { name: 'home' }
      // redirect to Edit Page if user is already logged in
    } else if (globalStore.isLoggedIn && to.name === 'home') {
      return { name: 'edit' }
    }
  }
})
