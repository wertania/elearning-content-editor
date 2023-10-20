import * as VueRouter from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("../views/Login.vue"),
    name: "login",
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
  {
    path: "/demo/",
    component: () => import("../views/DemoView.vue"),
    name: "demo",
  },
];

export const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
});
