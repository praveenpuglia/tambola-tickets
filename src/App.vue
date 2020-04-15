<template>
  <div id="app">
    <div class="actions no-print">
      <div class="buttons">
        <button class="regenerate" @click="regenerate">Generate</button>
        <button class="print" @click="print">PDF</button>
        <button class="screenshot" @click="download">Screenshot</button>
      </div>
      <div class="player-details">
        <label>
          <span>Player: </span>
          <input
            type="text"
            placeholder="Player Name"
            name="playerName"
            v-model="playerName"
          />
        </label>
        <label>
          <span>Tickets: </span>
          <input
            min="1"
            max="6"
            name="count"
            type="number"
            v-model="ticketCount"
          />
        </label>
      </div>
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
import html2canvas from "html2canvas";
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
  computed: {
    ticketTitle() {
      return `${this.playerName} - ${new Date().toString().substring(4, 10)}`;
    }
  },
  metaInfo() {
    return {
      title: this.ticketTitle,
      titleTemplate: "%s - Tambola Tickets"
    };
  },
  data() {
    return {
      timestamp: new Date().getTime(),
      ticketCount: 6,
      playerName: ""
    };
  },
  methods: {
    download() {
      html2canvas(document.querySelector(".ticket-page")).then(canvas => {
        const a = document.createElement("a");
        a.download = `${this.ticketTitle}.png`;
        a.href = canvas.toDataURL("image/png");
        document.body.append(a);
        a.click();
        a.remove();
      });
    },
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
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}
.actions {
  margin-bottom: 1rem;
  .buttons,
  .player-details {
    display: flex;
    justify-content: space-between;
  }
  input,
  button {
    border: 2px solid goldenrod;
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
  .screenshot {
    background: honeydew;
  }
  input[name="playerName"] {
    max-width: 5rem;
  }
  input[name="count"] {
    max-width: 2rem;
  }
  .player-details {
    padding-top: 0.5rem;
    margin-top: 0.5rem;
    border-top: 1px solid;
  }
}
@media print {
  .no-print {
    display: none;
  }
}
</style>
