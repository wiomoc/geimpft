<template>
  <div class="app">
    <Sidebar></Sidebar>
    <Map class="map"></Map>
    <ScrollTopButton></ScrollTopButton>
  </div>
</template>

<script>
import Sidebar from "@/components/Sidebar";
import Map from "@/components/Map";
import ScrollTopButton from "@/components/ScrollTopButton";

export default {
  components: {
    Map,
    Sidebar,
    ScrollTopButton,
  },
};
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
}

.app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
}

@media (max-width: 800px) {
  .app {
    flex-direction: column;
  }
  .map {
    padding: 2em;
    background-color: white;
    overflow: hidden;
  }
}
</style>
