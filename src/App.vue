<template>
  <div id="app">
    <div class="action-buttons no-print">
      <button class="regenerate" @click="regenerate">Generate</button>
      <button class="print" @click="print">Print</button>
      <input
        type="text"
        placeholder="Player Name"
        name="playerName"
        v-model="playerName"
      />
      <input min="1" max="6" name="count" type="number" v-model="ticketCount" />
    </div>
    <TicketPage
      :count="ticketCount"
      :player="playerName"
      :key="`page_1_${timestamp}`"
      :page-color="getRandomColor()"
    />
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
      timestamp: new Date().getTime(),
      ticketCount: 6,
      playerName: ""
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
  margin: auto;
  width: 350px;
}
.action-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  input,
  button {
    border: 2px solid #444;
    background: none;
    font-size: 0.8rem;
    border-radius: 0.5rem;
    margin: 0 0.5rem;
    padding: 0.5rem 1rem;
  }
  .regenerate {
    background: azure;
  }
  .print {
    background: lavenderblush;
  }
  input[name="playerName"] {
    max-width: 5rem;
  }
  input[name="count"] {
    max-width: 5rem;
  }
}
@media print {
  .no-print {
    display: none;
  }
}
</style>
