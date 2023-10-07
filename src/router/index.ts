import * as VueRouter from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("../views/Home.vue"),
    name: "home",
  },
  {
    path: "/edit/",
    component: () => import("../views/DocumentEditor.vue"),
    name: "edit",
  },
  {
    path: "/media/:documentId?",
    component: () => import("../views/MediaBrowser.vue"),
    name: "media",
  },
  {
    path: "/smart-video-converter/",
    component: () => import("../views/SmartVideoConverter.vue"),
    name: "smart-video-converter",
  },
];

export const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
});
