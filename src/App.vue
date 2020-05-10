<template>
  <div id="app">
    <div class="app-update" v-if="updateExists">
      🎉 New Version Available!
      <button @click="refreshApp">
        Refresh
      </button>
    </div>
    <div class="actions no-print">
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
          <div class="control">
            <span v-for="i in 6" :key="i" class="flex align-center"
              >{{ i }}
              <input
                class="ml-2"
                type="radio"
                :value="i"
                v-model.number="ticketCount"
            /></span>
          </div>
        </label>
      </div>
      <div class="buttons">
        <button class="regenerate" @click="regenerate">New Ticket</button>
        <button class="print" @click="print">PDF</button>
        <button class="screenshot" @click="download">Share</button>
      </div>

      <div class="claim-details" v-if="false">
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
  created() {
    document.addEventListener('swUpdated', this.showRefreshUI, { once: true });
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (this.refreshing) return;
      this.refreshing = true;
      window.location.reload();
    });
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
      updateExists: false,
      registration: null,
      refreshing: false,
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
    showRefreshUI(event) {
      this.registration = event.detail;
      this.updateExists = true;
    },
    refreshApp() {
      this.updateExists = false;
      if (!this.registration || !this.registration.waiting) {
        return;
      }
      this.registration.waiting.postMessage('skipWaiting');
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
.app-update {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  padding: 1rem;
  border: 2px solid;
  background: white;
  box-shadow: 0 2px 4px 0 rgba($color: #000000, $alpha: 0.3);
  border-radius: 1rem;
  button {
    display: block;
    width: 100%;
    margin-top: 0.5rem;
    padding: 0.5rem;
    border: 2px solid;
    border-radius: 0.5rem;
    font-weight: bold;
    background: gold;
  }
}
</style>
