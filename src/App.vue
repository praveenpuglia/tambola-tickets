<template>
  <div id="app">
    <TicketPage />
    <TicketPage />
  </div>
</template>

<script>
import TicketPage from "./components/TicketPage.vue";

export default {
  name: "App",
  components: {
    TicketPage
  }
};
</script>
<style lang="scss" scoped>
#app {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
</style>
