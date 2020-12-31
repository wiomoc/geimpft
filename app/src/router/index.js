import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "*",
    name: "overview"
  },
  {
    path: "/state/:state",
    name: "state"
  }
];

const router = new VueRouter({
  routes
});

export default router;
