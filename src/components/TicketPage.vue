<template>
  <div class="ticket-page">
    <Ticket
      v-for="(ticket, index) in tickets"
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
        if (i === 0) {
          sets.push(allNumbers.splice(0, 9));
        } else if (i === 8) {
          sets.push(allNumbers);
        } else {
          sets.push(allNumbers.splice(0, 10));
        }
      }
      return sets;
    },
    tickets() {
      const allNumbers = this.allNumbers();
      const tickets = new Array(6).fill(0).map(() => this.getNewTicket());
      const pickedNumbers = [];
      return tickets.map((ticket, index) => {
        if (index === 5) {
          const numbersSet = new Set(allNumbers);
          const pickedNumbersSet = new Set(pickedNumbers);
          const remainingNumbers = Array.from(
            new Set([...numbersSet].filter(x => !pickedNumbersSet.has(x)))
          );

          // Short Circuit
          const newTicket = this.getNewTicketFromList(remainingNumbers);
          ticket = [...newTicket];
        } else {
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
        }
        return ticket;
      });
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
      return this.getNewArray(3).map(() => this.getNewArray(9));
    },
    getNewArray(size) {
      return new Array(size).fill(0);
    },
    getNewTicketFromList(numbers) {
      const ticket = this.getNewTicket();
      numbers.forEach(number => {
        const column = this.getBelongingColumnIndex(number);
        const availableRowIndex = this.getAvailableRowIndex(ticket);
        ticket[availableRowIndex][column] = number;
        for (let i = availableRowIndex; i < 3; i++) {
          // if place is available then put the number in there,
          // otherwise do nothing.
          if (!ticket[i][column]) {
            ticket[i][column] = number;
          }
        }
      });
      return ticket;
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
