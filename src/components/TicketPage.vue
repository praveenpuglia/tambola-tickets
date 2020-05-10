<template>
  <div class="ticket-page" :style="{ 'background-color': pageColor }">
    <Ticket
      v-for="(ticket, index) in tickets"
      v-show="index < count"
      :key="index"
      :player="player"
      :numbers="ticket"
    ></Ticket>
  </div>
</template>

<script>
import Ticket from './Ticket';
import { shuffle } from 'lodash-es';
export default {
  name: 'TicketPage',
  components: { Ticket },
  props: {
    pageColor: String,
    player: {
      type: String,
      default: 'Unknown Player'
    },
    count: {
      default: 6,
      type: Number
    }
  },
  data() {
    return {
      pickedNumbers: [],
      trials: 0
    };
  },
  computed: {
    tickets() {
      return this.getTickets();
    },
    /**
     * We divide the numbers 1-90 into 9 buckets.
     * The first bucket has numbers from 1-9,
     * rest of the buckets all have 10 numbers each. e.g. 10-19, 20-29
     * except the last one, that has 11 numbers. 80-90
     */
    sets() {
      const allNumbers = this.allNumbers.slice();
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
    /**
     * All the numbers
     */
    allNumbers() {
      return new Array(90).fill(0).map((_, index) => index + 1);
    }
  },
  methods: {
    /**
     * The tickets baby!
     */
    getTickets() {
      this.trials = 0;

      const allNumbers = this.allNumbers;
      const tickets = this.getNewArray(6).map(() => this.getNewTicket());
      const generatedTickets = tickets.map((ticket, index) => {
        // For the last ticket, we short circuit it
        // Because at times the following while loop results in infinite loop.
        if (tickets.length - 1 === index) {
          const numbersSet = new Set(allNumbers);
          const pickedNumbersSet = new Set(this.pickedNumbers);
          const remainingNumbers = Array.from(
            new Set([...numbersSet].filter(x => !pickedNumbersSet.has(x)))
          );

          // Short Circuit
          const newTicket = this.getNewTicketFromList(remainingNumbers);
          ticket = [...newTicket];
        } else {
          try {
            ticket = this.genRandomizedTicket();
          } catch (e) {
            console.error(e);
            return [];
          }
        }
        // Are all 6 valid tickets? if not, regenrate the tickets.
        return ticket;
      });
      const validityMatrix = generatedTickets.map(ticket =>
        this.validateTicket(ticket)
      );

      const isAnyInvalid = validityMatrix.filter(Boolean).length !== 6;
      if (isAnyInvalid) {
        // Reset all picked numbers;
        this.pickedNumbers = [];
        const newTickets = this.getTickets();

        return newTickets;
      } else {
        return generatedTickets;
      }
    },
    genRandomizedTicket() {
      if (this.trials === 20) {
        throw new Error("Can't generate ticket. Try again!");
      }
      this.trials++;

      let ticket = this.getNewTicket();
      // We wanna do the work of filling numbers into ticket
      // till we have some space.
      while (this.getTicketNumbersCount(ticket) < 15) {
        // We pick a number from a list of numbers that aren't used.
        // For this we pass in the allMumbers array and the pickedNumbers
        // array. We find the list of available numbers to pick from that
        // list
        const randomNum = this.pickRandom();
        // Does the ticket already have the picked Number?
        // If it does, we do nothing and try to fill another
        // number into the ticket.
        // Otherwise, we want to find out if we can place this number.
        if (!this.ifTicketHasNumber(ticket, randomNum)) {
          // Since we do row-first filling, we want to find out
          // which row is now available for filling.
          const selectedRowIndex = this.getAvailableRowIndex(ticket);
          // We also want to find out which column does the number can
          // go to.
          const belongingColumnIndex = this.getBelongingColumnIndex(randomNum);
          // Very Important: We now want to find out if we can actually
          // place the number in that row, column position. That is
          // if that place is not already occupied, we can safely
          // put it in there.
          if (
            this.canPlaceNumber(ticket, selectedRowIndex, belongingColumnIndex)
          ) {
            // If it can really be placed in that cell, we do that
            // and we also add the number to the list of pickedNumbers
            this.placeNumber(
              randomNum,
              ticket,
              selectedRowIndex,
              belongingColumnIndex
            );
            this.pickedNumbers.push(randomNum);
          }
        }
      }
      const isValid = this.validateTicket(ticket);
      if (isValid) {
        return ticket;
      } else {
        // Remove those numbers from pickedNumbers list & redo the process.
        const ticketNumbers = ticket.flat();

        this.pickedNumbers = this.pickedNumbers.filter(
          num => !ticketNumbers.includes(num)
        );
        ticket = this.genRandomizedTicket();
        return ticket;
      }
    },
    /**
     * Finds the diff between all the numbers and the picked numbers
     * and then picks a random number out of that available number list
     */
    pickRandom() {
      const numbersSet = new Set(this.allNumbers);
      const pickedNumbersSet = new Set(this.pickedNumbers);
      const availableNumbers = Array.from(
        new Set([...numbersSet].filter(x => !pickedNumbersSet.has(x)))
      );
      let val =
        availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
      return val;
    },
    validateTicket(ticket) {
      // Must have 15 numbers;
      const count = this.getTicketNumbersCount(ticket);
      if (count !== 15) {
        return false;
      }
      // All rows must have 5 numbers;
      const rowFault = ticket.find(row => row.filter(Boolean).length !== 5);
      if (rowFault) {
        return false;
      }
      // Columns must hav at least one number;
      const columns = [];
      for (let i = 0; i < 9; i++) {
        const column = ticket.map(row => row[i]).filter(Boolean);
        columns.push(column);
      }
      const columnFault = columns.find(column => column.length === 0);
      if (columnFault) {
        return false;
      }
      return true;
    },
    /**
     * If the ticket already has the number.
     * Since a ticket is a 2-D array, flattening it
     * gives a nice 1-D array to search for.
     */
    ifTicketHasNumber(ticket, number) {
      return ticket.flat().includes(number);
    },
    /**
     * Get the next available row in the ticket
     * where a number can be placed. This assumes
     * that we do row-wise filling
     */
    getAvailableRowIndex(ticket) {
      const count = this.getTicketNumbersCount(ticket);
      if (count < 5) {
        return 0;
      } else if (count >= 5 && count < 10) {
        return 1;
      } else {
        return 2;
      }
    },
    /**
     * How many numbers have we already filled in the ticket?
     */
    getTicketNumbersCount(ticket) {
      return ticket.flat().filter(Boolean).length;
    },
    /**
     * In which column does the passed in number belong?
     * We find it out by looking at the `this.sets`
     */
    getBelongingColumnIndex(number) {
      return this.sets.findIndex(set => set.includes(number));
    },
    /**
     * Can we actually place a number into the passed in
     * row / column index in the ticket?
     */
    canPlaceNumber(ticket, rowIndex, colIndex) {
      if (ticket[rowIndex][colIndex]) {
        return false;
      }
      return true;
    },
    /**
     * Place the number at the given row/column index
     * in the ticket.
     */
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
      numbers = shuffle(numbers);
      numbers.forEach(number => {
        let availableRowIndex = 0;
        for (let i = 0; i < 3; i++) {
          const columnIndex = this.getBelongingColumnIndex(number);
          const numbersInRow = ticket[i].filter(Boolean).length;
          if (numbersInRow >= 5) {
            continue;
          }
          if (this.canPlaceNumber(ticket, i, columnIndex)) {
            availableRowIndex = i;
            ticket[availableRowIndex][columnIndex] = number;
            break;
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
  padding: 1rem;
  border: 2px solid #ccc;
}
</style>
