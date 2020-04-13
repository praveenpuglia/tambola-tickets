<template>
  <div class="ticket">
    <small class="ticket__id">{{ hash.toUpperCase() }}</small>
    <table class="ticket__table">
      <tr v-for="(row, i) in numbers" :key="i">
        <td v-for="(col, j) in row" :key="j">
          <span v-if="numbers[i][j]">
            {{ numbers[i][j] }}
          </span>
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
import * as sum from "hash-sum";
export default {
  name: "Ticket",
  props: {
    numbers: {
      type: Array,
      required: true
    }
  },
  computed: {
    hash() {
      return sum(this.numbers);
    }
  }
};
</script>
<style lang="scss" scoped>
.ticket {
  &__id {
    font-size: 10px;
    font-family: "Jetbrains Mono", "Courier New", Courier, monospace;
  }
  &__table {
    border-collapse: collapse;
    td {
      height: 32px;
      width: 32px;
      text-align: center;
      border: 1px solid #555;
      font-size: 1rem;
      font-family: "Jetbrains Mono";
      font-weight: bold;
    }
  }
}
</style>
