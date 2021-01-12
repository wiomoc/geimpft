<template>
  <div class="fab">
    <md-button
      class="md-fab md-primary md-fab-bottom-right md-icon-button"
      @click="scrollTop"
    >
      <md-icon
        :md-src="require('../assets/arrow_back-24px.svg')"
        class="arrow"
      ></md-icon>
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
        behavior: "smooth"
      });
    }
  }
};
</script>

<style>
.fab {
  display: none;
}

@media (max-width: 800px) {
  .fab {
    display: block;
  }
}

.arrow {
  transform: rotate(90deg);
}
</style>
