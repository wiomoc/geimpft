import Vue from "vue";
import Vuex from "vuex";
import Population from "../assets/german_states_population.json";

Vue.use(Vuex);

function sumAllStatesStats(stats) {
  const summed = {
    total: 0,
    indicationAge: 0,
    indicationOccupation: 0,
    indicationMedical: 0,
    indicationNursinghome: 0
  };
  stats.forEach(state => {
    summed.total += state.total;
    summed.indicationAge += state.indicationAge;
    summed.indicationOccupation += state.indicationOccupation;
    summed.indicationMedical += state.indicationMedical;
    summed.indicationNursinghome += state.indicationNursinghome;
  });
  return summed;
}

export default new Vuex.Store({
  state: {
    history: null,
    state: null
  },
  getters: {
    historyTotal: state => {
      return Object.keys(state.history)
        .sort()
        .map(dayKey => {
          const dayStats = state.history[dayKey];
          const day = dayKey;
          if (state.state) {
            return {
              day,
              stats: dayStats.filter(
                stateStats => stateStats.state === state.state
              )[0]
            };
          } else {
            return {
              day,
              stats: sumAllStatesStats(dayStats)
            };
          }
        });
    },
    historyChangePrevDay: (state, getters) => {
      let last = 0;
      const changePrevDay = [];
      const historyTotal = getters.historyTotal;
      for (let { day, stats } of historyTotal) {
        changePrevDay.push({
          day,
          change: stats.total - last
        });
        last = stats.total;
      }
      return changePrevDay;
    },
    lastStats: (state, getters) => {
      let stats;
      if (state.state) {
        const lastCompleteStats = getters.lastCompleteStats;
        if (!lastCompleteStats) return null;
        stats = lastCompleteStats.filter(
          stateStats => stateStats.state === state.state
        )[0];
        if (!stats) return;
        stats.population = Population[state.state];
      } else {
        stats = getters.lastStatsSummed;
        if (!stats) return;
        stats.population = Population.total;
      }
      stats.populationPercentage = (stats.total / stats.population) * 100;
      return stats;
    },
    lastStatsSummed: (state, getters) => {
      const lastCompleteStats = getters.lastCompleteStats;
      if (!lastCompleteStats) return null;

      return sumAllStatesStats(lastCompleteStats);
    },
    lastCompleteStats: (state, getters) => {
      const lastDay = getters.lastDay;
      if (!lastDay) return null;
      return state.history[lastDay];
    },
    lastCompleteStatsPercentage: (state, getters) => {
      const lastCompleteStats = getters.lastCompleteStats;
      if (!lastCompleteStats) return;
      return lastCompleteStats.map(stats => {
        const { state, total } = stats;
        const population = Population[state];
        const populationPercentage = (total / population) * 100;
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
      return daysSorted[daysSorted.length - 1];
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
