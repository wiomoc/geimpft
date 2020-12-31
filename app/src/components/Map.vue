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
      <vl-source-vector :features="features"></vl-source-vector>
      <vl-interaction-select
        @update:features="selectFeature($event)"
        :features="selectedFeature"
        :hit-tolerance="3"
      ></vl-interaction-select>
    </vl-layer-vector>
  </vl-map>
</template>

<script>
import { features } from "../assets/german_states.geo.json";

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
    }
  },
  computed: {
    selectedFeature() {
      const state = this.$store.state.state;
      if (!state) return [];
      return this.features.filter(feature => feature.properties.name === state);
    }
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
