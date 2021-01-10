<template>
  <MdContent class="content">
    <MdToolbar class="md-primary toolbar">
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
      <md-card class="card-percentage" md-with-hover>
        <md-card-header>
          <div class="md-title">
            {{ lastStats.populationPercentage.toFixed(2) }}%
          </div>
          <div class="md-subhead">
            von {{ lastStats.population | number }} Einwohnern
          </div>
        </md-card-header>
      </md-card>
      <md-card class="chart-total" md-with-hover>
        <md-card-header>
          <ChartTotal />
        </md-card-header>
      </md-card>
      <md-card class="chart-daily-change" md-with-hover>
        <md-card-header>
          <ChartChangePrevDay />
        </md-card-header>
      </md-card>
      <md-divider></md-divider>
      <span class="md-caption"
        >Quelle:
        <a
          href="https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Daten/Impfquoten-Tab.html"
          >Robert-Koch-Institut</a
        >
        Sourcecode
        <a href="https://github.com/wiomoc/geimpft/">auf GitHub</a></span
      >
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
import ChartChangePrevDay from "@/components/ChartChangePrevDay";

export default {
  name: "Sidebar",
  components: {
    ChartTotal,
    ChartChangePrevDay,
  },
  computed: {
    ...mapGetters(["lastStats", "lastDay"]),
    ...mapState(["state"]),
  },
  filters: {
    day(date) {
      return new Intl.DateTimeFormat("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date(date));
    },
    number(number) {
      return new Intl.NumberFormat("de-DE", { useGrouping: true }).format(
        number
      );
    },
  },
};
</script>

<style scoped type="text/scss">
.content {
  width: 45vw;
  min-width: 385px;
  height: 100vh;
  overflow-y: scroll;
}

@media (max-width: 800px) {
  .content {
    width: 100%;
  }
}

.chart-total,
.chart-daily-change,
.card-total,
.card-percentage {
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