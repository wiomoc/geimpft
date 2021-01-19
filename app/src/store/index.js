import Vue from "vue";
import Vuex from "vuex";
import Population from "../assets/german_states_population.json";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    history: null,
    state: null
  },
  getters: {
    historyTotal: state => {
      const history = [];
      for (let dayKey of Object.keys(state.history).sort()) {
        const dayStats = state.history[dayKey];
        const day = dayKey;
        if (state.state) {
          if (!dayStats.states || !dayStats.states[state.state]) continue;
          history.push({
            day,
            stats: dayStats.states[state.state]
          });
        } else {
          history.push({
            day,
            stats: {
              total: dayStats.total
            }
          });
        }
      }
      return history;
    },
    historyChangePrevDay: (state, getters) => {
      let last = 0;
      const changePrevDay = [];
      const historyTotal = getters.historyTotal;
      for (let { day, stats } of historyTotal) {
        const totalVaccinations = stats.total.first + stats.total.second;
        changePrevDay.push({
          day,
          change: totalVaccinations - last
        });
        last = totalVaccinations;
      }
      return changePrevDay;
    },
    lastStats: (state, getters) => {
      let stats;
      const lastCompleteStats = getters.lastCompleteStats;
      if (!lastCompleteStats) return null;
      if (state.state) {
        stats = lastCompleteStats.states[state.state];
        if (!stats) return;
        stats.population = Population[state.state];
      } else {
        stats = {
          total: lastCompleteStats.total
        };
        if (!stats) return;
        stats.population = Population.total;
      }
      stats.populationPercentage = (stats.total.first / stats.population) * 100;
      return stats;
    },
    lastCompleteStats: (state, getters) => {
      const lastDay = getters.lastDay;
      if (!lastDay) return null;
      return state.history[lastDay];
    },
    lastCompleteStatsPercentage: (state, getters) => {
      const lastCompleteStats = getters.lastCompleteStats;
      if (!lastCompleteStats) return;
      return Object.entries(lastCompleteStats.states).map(([state, stats]) => {
        const { total } = stats;
        const population = Population[state];
        const populationPercentage = (total.first / population) * 100;
        return {
          population,
          state,
          total,
          populationPercentage
        };
      });
    },
    lastDay: state => {
      if (!state.history) return null;
      const daysSorted = Object.keys(state.history);
      const lastDay = daysSorted[daysSorted.length - 1];
      if (state.state && !state.history[lastDay].states) {
        // Go one day back, if a state is selected but no detail data is available
        return daysSorted[daysSorted.length - 2];
      } else {
        return lastDay;
      }
    }
  },
  mutations: {
    saveHistory(state, payload) {
      state.history = payload;
    },
    setState(state, payload) {
      state.state = payload;
    }
  },
  actions: {
    async loadHistory(context) {
      const res = await fetch("https://wiomoc.github.io/geimpft/history.json");
      const history = await res.json();
      context.commit("saveHistory", history);
    }
  },
  modules: {}
});
