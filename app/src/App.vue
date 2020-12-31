<template>
  <div class="app">
    <Sidebar></Sidebar>
    <Map></Map>
  </div>
</template>

<script>
import Sidebar from "@/components/Sidebar";
import Map from "@/components/Map";

export default {
  components: {
    Map,
    Sidebar
  }
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
</style>
