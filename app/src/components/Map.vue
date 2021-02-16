<template>
  <vl-map
    :load-tiles-while-animating="true"
    :load-tiles-while-interacting="true"
    data-projection="EPSG:4326"
    style="height: 100vh; width: 100%"
  >
    <vl-view
      :zoom="6"
      :min-zoom="6"
      :max-zoom="9"
      :center="[10.385038, 50.750359]"
    ></vl-view>

    <vl-layer-tile id="osm">
      <vl-source-osm></vl-source-osm>
    </vl-layer-tile>

    <vl-layer-vector>
      <vl-source-vector :features="features" ref="layer">
        <vl-style-func :factory="style(false)" />
      </vl-source-vector>
      <vl-interaction-select
        @update:features="selectFeature($event)"
        :features="selectedFeature"
        :hit-tolerance="3"
      >
        <vl-style-func :factory="style(true)" />
      </vl-interaction-select>
    </vl-layer-vector>
  </vl-map>
</template>

<script>
import { features } from "../assets/german_states.geo.json";
import { mapGetters } from "vuex";
import { Fill, Stroke, Style, Text } from "ol/style";

export default {
  name: "Map",
  data() {
    return {
      features
    };
  },
  methods: {
    selectFeature(features) {
      const feature = features[0];
      if (feature) {
        const state = feature.properties.name;
        if (state !== this.$route.params.state)
          this.$router.push({ name: "state", params: { state } });
      }
    },
    style(selected) {
      const lastCompleteStats = this.lastCompleteStats;
      if (!lastCompleteStats) return () => null;
      const maxPopulationPercentage = Math.max(
        ...Object.values(lastCompleteStats.states).map(
          stats => stats.populationPercentage
        )
      );
      const minPopulationPercentage = Math.min(
        ...Object.values(lastCompleteStats.states).map(
          stats => stats.populationPercentage
        )
      );

      return () => {
        return feature => {
          const state = feature.getProperties().name;
          const stats = lastCompleteStats.states[state];

          function map(x, inMin, inMax, outMin, outMax) {
            return ((x - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
          }

          const hue = map(
            stats.populationPercentage,
            minPopulationPercentage,
            maxPopulationPercentage,
            30,
            85
          );
          return new Style({
            text: new Text({
              font: "bold 20px Roboto,Avenir,Helvetica,Arial,sans-serif",
              fill: new Fill({
                color: `hsla(${hue},100%,25%, 0.9)`
              }),
              text: `${stats.populationPercentage.toFixed(2)}%`
            }),
            stroke: selected
              ? new Stroke({
                  color: "#448aff",
                  width: 3
                })
              : new Stroke({
                  color: `hsla(${hue},100%,50%, 0.7)`,
                  width: 1
                }),
            fill: new Fill({
              color: `hsla(${hue},100%,50%, 0.4)`
            })
          });
        };
      };
    }
  },
  computed: {
    selectedFeature() {
      const state = this.$store.state.state;
      if (!state) return [];
      return this.features.filter(feature => feature.properties.name === state);
    },
    ...mapGetters(["lastCompleteStats"])
  }
};
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
