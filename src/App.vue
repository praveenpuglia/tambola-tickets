<template>
  <div id="app">
    <div class="actions no-print">
      <div class="buttons">
        <button class="regenerate" @click="regenerate">New Ticket</button>
        <button class="print" @click="print">PDF</button>
        <button class="screenshot" @click="download">Share</button>
      </div>
      <div class="player-details">
        <label class="control-group player-details__player">
          <span>Player</span>
          <input
            class="control"
            type="text"
            size="16"
            placeholder="Player Name"
            name="playerName"
            v-model="playerName"
          />
        </label>
        <label class="control-group player-details__tickets">
          <span>Tickets</span>
          <input
            class="control"
            min="1"
            max="6"
            name="count"
            type="number"
            v-model.number="ticketCount"
          />
        </label>
      </div>
      <div class="claim-details">
        <label class="control-group">
          <span>Claims</span>
          <input
            type="text"
            name=""
            class="claim-input control"
            v-model.lazy="claim.input"
            placeholder="comma separated list of claims"
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
  provide() {
    return {
      claim: this.claim
    };
  },
  components: {
    TicketPage
  },
  computed: {
    ticketTitle() {
      return `${this.playerName} - ${
        this.ticketCount
      } Tickets - ${new Date().toString().substring(4, 10)}`;
    }
  },
  metaInfo() {
    return {
      title: this.ticketTitle,
      titleTemplate: '%s | Tambola Tickets'
    };
  },
  data() {
    return {
      timestamp: new Date().getTime(),
      ticketCount: 6,
      playerName: '',
      claim: {
        input: ''
      }
    };
  },
  methods: {
    download() {
      if (navigator.canShare) {
        domtoimage.toBlob(document.querySelector('.ticket-page')).then(blob => {
          const file = new File([blob], `${this.ticketTitle}.jpg`, {
            type: 'image/jpeg'
          });
          const files = [file];
          if (
            navigator.canShare({
              files: files
            })
          ) {
            navigator
              .share({
                text: this.ticketTitle,
                files
              })
              .then(() => console.log('Successful share'))
              .catch(error => {
                console.log('Error sharing', error);
              });
          } else {
            alert('Web Share API is not supported in your browser.');
          }
        });
      } else {
        domtoimage
          .toJpeg(document.querySelector('.ticket-page'))
          .then(dataUrl => {
            const a = document.createElement('a');
            a.download = `${this.ticketTitle}.jpg`;
            a.href = dataUrl;
            document.body.append(a);
            a.click();
            a.remove();
          });
      }
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
.claim-details {
  margin-top: 1rem;
  .claim-input {
    margin: 0;
    width: 100%;
  }
}
</style>
