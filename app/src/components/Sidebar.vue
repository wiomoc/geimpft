<template>
  <MdContent class="content">
    <MdToolbar class="md-primary">
      <transition name="fade" mode="out-in">
        <div class="state-toolbar-content" v-if="state">
          <div class="md-toolbar-section-start">
            <router-link :to="{ name: 'overview' }">
              <md-button class="md-icon-button">
                <md-icon
                  :md-src="require('../assets/arrow_back-24px.svg')"
                ></md-icon>
              </md-button>
            </router-link>
          </div>
          <span class="md-title">{{ state }}</span>
        </div>
        <span v-else class="md-title">Deutschlandweit geimpft</span>
      </transition>
    </MdToolbar>
    <div v-if="lastStats">
      <md-card class="card-total md-accent" md-with-hover>
        <md-card-header>
          <div class="md-title">{{ lastStats.total | number }}</div>
          <div class="md-subhead">
            <b>Insgesamt</b> <i>(Stand {{ lastDay | day }})</i>
          </div>
        </md-card-header>
      </md-card>
      <ChartTotal></ChartTotal>
    </div>
    <MdProgressSpinner
      v-else
      :md-diameter="100"
      :md-stroke="10"
      md-mode="indeterminate"
    ></MdProgressSpinner>
  </MdContent>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import ChartTotal from "@/components/ChartTotal";

export default {
  name: "Sidebar",
  components: {
    ChartTotal
  },
  computed: {
    ...mapGetters(["lastStats", "lastDay"]),
    ...mapState(["state"])
  },
  filters: {
    day(date) {
      return new Intl.DateTimeFormat("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }).format(new Date(date));
    },
    number(number) {
      return new Intl.NumberFormat("de-DE", { useGrouping: true }).format(
        number
      );
    }
  }
};
</script>

<style scoped type="text/scss">
.content {
  width: 40vw;
  min-width: 350px;
}

.card-total {
  margin: 10px;
}

.md-title {
  margin-top: 0 !important;
}

.md-toolbar-section-start {
  flex: 0 !important;
}

.state-toolbar-content {
  display: flex;
  align-items: center;
  align-content: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
