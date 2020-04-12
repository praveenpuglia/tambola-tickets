<template>
  <div class="ticket-page">
    <Ticket
      v-for="(ticket, index) in genTickets()"
      :key="index"
      :numbers="ticket"
    ></Ticket>
  </div>
</template>

<script>
import Ticket from "./Ticket";
export default {
  name: "TicketPage",
  components: { Ticket },
  computed: {
    sets() {
      const allNumbers = this.allNumbers();
      const sets = [];
      for (let i = 0; i < 9; i++) {
        sets.push(allNumbers.splice(0, 10));
      }
      return sets;
    }
  },
  methods: {
    allNumbers() {
      return new Array(90).fill(0).map((_, index) => index + 1);
    },
    shouldPick() {
      return Math.random() < 0.5;
    },
    pickRandom(numbers, pickedNumbers) {
      const numbersSet = new Set(numbers);
      const pickedNumbersSet = new Set(pickedNumbers);
      const availableNumbers = Array.from(
        new Set([...numbersSet].filter(x => !pickedNumbersSet.has(x)))
      );
      let val =
        availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
      if (val) {
        return val;
      } else {
        this.pickRandom(numbers, pickedNumbers);
      }
    },
    ifTicketHasNumber(ticket, number) {
      return ticket.flat().includes(number);
    },
    getAvailableRowIndex(ticket) {
      const count = this.getTicketNumbersCount(ticket);
      return count >= 10 ? 2 : count >= 5 ? 1 : 0;
    },
    getTicketNumbersCount(ticket) {
      return ticket.flat().filter(Boolean).length;
    },
    getBelongingColumnIndex(number) {
      return this.sets.findIndex(set => set.includes(number));
    },
    canPlaceNumber(ticket, rowIndex, colIndex) {
      if (ticket[rowIndex][colIndex]) {
        return false;
      }
      return true;
    },
    placeNumber(number, ticket, rowIndex, colIndex) {
      ticket[rowIndex][colIndex] = number;
    },
    getNewTicket() {
      return new Array(3).fill(0).map(() => new Array(9).fill(0));
    },
    genTickets() {
      const allNumbers = this.allNumbers();
      const tickets = new Array(6).fill(0).map(() => this.getNewTicket());
      const pickedNumbers = [];
      tickets.forEach(ticket => {
        while (this.getTicketNumbersCount(ticket) < 15) {
          const randomNum = this.pickRandom(allNumbers, pickedNumbers);
          // Making sure the number isn't already placed in ticket
          if (pickedNumbers.includes(randomNum)) {
            continue;
          }
          if (!this.ifTicketHasNumber(ticket, randomNum)) {
            // ticket
            const selectedRowIndex = this.getAvailableRowIndex(ticket);
            const belongingColumnIndex = this.getBelongingColumnIndex(
              randomNum
            );
            if (
              this.canPlaceNumber(
                ticket,
                selectedRowIndex,
                belongingColumnIndex
              )
            ) {
              this.placeNumber(
                randomNum,
                ticket,
                selectedRowIndex,
                belongingColumnIndex
              );
              pickedNumbers.push(randomNum);
            }
          }
        }
      });

      return tickets;
    }
  }
};
</script>

<style lang="scss" scoped>
.ticket-page {
  max-width: 768px;
  border: 1px solid;
  margin: auto;
  padding: 1rem;
}
</style>
