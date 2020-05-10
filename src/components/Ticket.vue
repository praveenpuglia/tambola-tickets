<template>
  <div class="ticket">
    <!-- <table class="ticket__claims">
      <td v-for="c in claims" :key="c" class="ticket__claim">
        {{ c.toUpperCase() }}
      </td>
    </table> -->
    <div class="ticket__meta">
      <small class="ticket__meta-item ticket__meta-name">{{ player }}</small>
      <small class="ticket__meta-item">{{ hash.toUpperCase() }}</small>
    </div>
    <table class="ticket__table">
      <tr v-for="(row, i) in sortedNumbers" :key="i">
        <td v-for="(col, j) in row" :key="j">
          <span v-if="sortedNumbers[i][j]">
            {{ sortedNumbers[i][j] }}
          </span>
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
import sum from 'hash-sum';
import { unzip } from 'lodash-es';
export default {
  name: 'Ticket',
  inject: ['claim'],
  props: {
    numbers: {
      type: Array,
      required: true
    },
    player: {
      type: String
    }
  },
  computed: {
    hash() {
      return sum(this.numbers);
    },
    claims() {
      return this.claim.input.split(',').map(claim => claim.trim());
    },
    sortedNumbers() {
      // For each column in the ticket
      // Find out if there are cases when things need to be swapped.
      // If they do, swap them to fix order and then send.
      const ticket = unzip(this.numbers);
      ticket.map(column => {
        // Full column? Sort and return
        const flattenedColumn = column.filter(Boolean);
        if (flattenedColumn.length === 3) {
          return column.sort();
        }
        // There are 3 cases for this. 1-2, 2-3, 1-3
        if (flattenedColumn.length === 2) {
          // Find which cell is 0;
          const zeroIndex = column.findIndex(cell => cell === 0);
          const otherIndices = [0, 1, 2];
          otherIndices.splice(zeroIndex, 1);
          const o1 = otherIndices[0];
          const o2 = otherIndices[1];
          if (column[o1] > column[o2]) {
            let temp = column[o1];
            column[o1] = column[o2];
            column[o2] = temp;
          }
        }
        return column;
      });
      return unzip(ticket);
    }
  }
};
</script>
<style lang="scss" scoped>
.ticket {
  padding-top: 1rem;
  border-top: 1px dashed;
  margin-top: 1rem;
  &:first-child {
    border-top: none;
    margin-top: 0;
  }
  &__claims {
    border-collapse: collapse;
    width: 100%;
    table-layout: fixed;
    margin-bottom: 0.5rem;
  }
  &__claim {
    text-align: center;
    font-size: 0.75rem;
    font-family: 'Jetbrains Mono', 'Courier New', Courier, monospace;
    border: 1px solid;
    padding: 1px;
  }
  &__meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    &-item {
      font-size: 11px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
        Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }
    &-name {
      font-size: 13px;
      white-space: nowrap;
    }
  }
  &__table {
    border-collapse: collapse;
    width: 100%;
    td {
      height: 32px;
      width: 32px;
      text-align: center;
      border: 1px solid #555;
      font-size: 1.1rem;
      font-family: 'Manrope', 'Menlo', 'Roboto Mono', 'Ubuntu Mono', monospace;
      font-weight: bold;
    }
  }
}
</style>
