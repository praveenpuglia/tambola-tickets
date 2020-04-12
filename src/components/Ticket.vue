<template>
  <div class="ticket">
    <table class="ticket-table">
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
export default {
  name: "Ticket",
  props: {
    numbers: {
      type: Array,
      required: true
    }
  }
};
</script>
<style lang="scss" scoped>
.ticket {
}
.ticket-table {
  border-collapse: collapse;
  td {
    height: 32px;
    width: 32px;
    text-align: center;
    border: 2px solid;
    font-size: 1rem;
    font-family: "Jetbrains Mono";
    font-weight: bold;
  }
}
</style>
