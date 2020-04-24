<template>
  <div id="app">
    <div class="actions no-print">
      <div class="buttons">
        <button class="regenerate" @click="regenerate">New Ticket</button>
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
import TicketPage from './components/TicketPage.vue';
import domtoimage from 'dom-to-image';
const colors = [
  'azure',
  'honeydew',
  'lavenderblush',
  'ivory',
  'aliceblue',
  'seashell'
];
export default {
  name: 'App',
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
      titleTemplate: '%s - Tambola Tickets'
    };
  },
  data() {
    return {
      timestamp: new Date().getTime(),
      ticketCount: 6,
      playerName: ''
    };
  },
  methods: {
    download() {
      domtoimage
        .toJpeg(document.querySelector('.ticket-page'))
        .then(dataUrl => {
          const a = document.createElement('a');
          a.download = `${this.ticketTitle}.png`;
          a.href = dataUrl;
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
