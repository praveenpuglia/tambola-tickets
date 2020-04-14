<template>
  <div id="app">
    <div class="action-buttons no-print">
      <button class="regenerate" @click="regenerate">Generate</button>
      <button class="print" @click="print">Print</button>
    </div>
    <TicketPage :key="`page_1_${timestamp}`" :page-color="getRandomColor()" />
    <TicketPage :key="`page_2_${timestamp}`" :page-color="getRandomColor()" />
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
  data() {
    return {
      timestamp: new Date().getTime()
    };
  },
  methods: {
    getRandomColor() {
      const index = Math.floor(Math.random() * colors.length);
      return colors[index];
    },
    regenerate() {
      this.timestamp = new Date().getTime();
    },
    print() {
      window.print();
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
.action-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  grid-column-end: span 2;
  button {
    border: 2px solid #444;
    background: none;
    font-size: 1rem;
    border-radius: 0.5rem;
    margin: 0 0.5rem;
    padding: 0.5rem 2rem;
  }
}
@media print {
  .no-print {
    display: none;
  }
}
</style>
