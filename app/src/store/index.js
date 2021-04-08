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
    history(state) {
      if (!state.history) return [];
      const history = [];
      for (let dayKey of Object.keys(state.history).sort()) {
        const dayStats = state.history[dayKey];
        const day = dayKey;
        if (state.state) {
          if (!dayStats.states || !dayStats.states[state.state]) continue;
          history.push({
            day,
            ...dayStats.states[state.state]
          });
        } else {
          history.push({
            day,
            total: dayStats.total
          });
        }
      }

      let last = 0;
      for (let stats of history) {
        const totalVaccinations = stats.total.first + (stats.total.second || 0);
        stats.changePrevDay = totalVaccinations - last;
        last = totalVaccinations;
      }
      return history;
    },
    lastStats(state, getters) {
      let lastCompleteStats = getters.lastCompleteStats;
      if (!lastCompleteStats)
        return {
          population: 0,
          total: {},
          populationPercentage: 0
        };
      return state.state
        ? lastCompleteStats.states[state.state]
        : lastCompleteStats.total;
    },
    lastCompleteStats(state, getters) {
      if (!state.history) return null;
      const lastStats = state.history[getters.lastDay];
      const states = {};
      Object.entries(lastStats.states).forEach(([state, stats]) => {
        const { total } = stats;
        const population = Population[state];
        const populationPercentage = (total.first / population) * 100;
        states[state] = {
          population,
          total,
          populationPercentage
        };
      });
      const population = Population.total;
      const total = lastStats.total;
      return {
        states,
        total: {
          population,
          total,
          populationPercentage: (total.first / population) * 100
        }
      };
    },
    lastDay: state => {
      if (!state.history) return null;
      const daysSorted = Object.keys(state.history).sort();
      const lastDay = daysSorted[daysSorted.length - 1];
      if (state.state && !state.history[lastDay].states) {
        // Go one day back, if a state is selected but no detailed data is available
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
