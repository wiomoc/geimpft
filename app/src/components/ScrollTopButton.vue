<template>
  <div class="fab">
    <md-button class="md-fab md-primary md-fab-bottom-right" @click="scrollTop">
      <md-icon>arrow_upward</md-icon>
    </md-button>
  </div>
</template>

<script>
export default {
  methods: {
    scrollTop() {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Material+Icons");

.fab {
  display: none;
}

@media (max-width: 800px) {
  .fab {
    display: block;
  }
}
</style>