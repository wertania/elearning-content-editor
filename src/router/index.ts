import * as VueRouter from "vue-router";

const routes = [
  {
    path: "/",
    // component: () => import("@/views/Home.vue"),
    redirect: "/edit/",
  },
  {
    path: "/edit/:id?",
    component: () => import("@/views/DocumentEditor.vue"),
  },
];

export const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
});
