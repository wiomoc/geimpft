import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "vuelayers/lib/style.css";
import {
  Map,
  TileLayer,
  OsmSource,
  VectorSource,
  VectorLayer,
  SelectInteraction,
  StyleFunc
} from "vuelayers";

Vue.use(Map);
Vue.use(TileLayer);
Vue.use(OsmSource);
Vue.use(VectorSource);
Vue.use(VectorLayer);
Vue.use(SelectInteraction);
Vue.use(StyleFunc);

import "roboto-fontface/css/roboto/roboto-fontface.css";
import "vue-material/dist/vue-material.min.css";
import "vue-material/dist/theme/default.css";
import {
  MdContent,
  MdToolbar,
  MdProgress,
  MdCard,
  MdIcon,
  MdButton,
  MdDivider
} from "vue-material/dist/components";

Vue.use(MdContent);
Vue.use(MdToolbar);
Vue.use(MdProgress);
Vue.use(MdCard);
Vue.use(MdIcon);
Vue.use(MdButton);
Vue.use(MdDivider);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: function(h) {
    return h(App);
  },
  watch: {
    "$route.params.state": function(state) {
      store.commit("setState", state);
    }
  }
}).$mount("#app");

store.dispatch("loadHistory");
store.commit("setState", router.currentRoute.params.state);
