<template>
  <div id="app">
    <TicketPage id="page-1" :page-color="getRandomColor()" />
    <TicketPage id="page-2" :page-color="getRandomColor()" />
  </div>
</template>

<script>
import TicketPage from "./components/TicketPage.vue";
const colors = [
  "azure",
  "honeydew",
  "lavenderblush",
  "ivory",
  "aliceblue",
  "seashell"
];
export default {
  name: "App",
  components: {
    TicketPage
  },
  methods: {
    getRandomColor() {
      const index = Math.floor(Math.random() * colors.length);
      return colors[index];
    }
  }
};
</script>
<style lang="scss" scoped>
#app {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin: auto;
  width: max-content;
  grid-gap: 1rem;
}
</style>
