import Vue from "vue";
import Vuex from "vuex";

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
    lastStats: (state, getters) => {
      if (state.state) {
        const lastCompleteStats = getters.lastCompleteStats;
        if (!lastCompleteStats) return null;
        return lastCompleteStats.filter(
          stateStats => stateStats.state === state.state
        )[0];
      } else {
        return getters.lastStatsSummed;
      }
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
