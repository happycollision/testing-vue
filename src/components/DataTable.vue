<template>
  <div class="hello">
    <table>
      <tr>
        <th v-for="label in tableData.header" :key="label">{{label}}</th>
      </tr>
      <tr v-for="row in tableData.rows" :key="row.id">
        <td v-for="item in row" :key="item">{{item}}</td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class DataTable extends Vue {
  @Prop() private data!: string;
  get tableData() {
    const [header, ...rows] = this.data.split('\n')
      .map((line) => line.split(',')
        .reduce((a, c, i) => {
          if (i === 0) { return [c]; }
          const aIndex = a.length - 1;
          const last = a[aIndex];
          const hadOpener = /^\s*"/.test(last);
          const hasCloser = /"\s*$/.test(c);
          if (hadOpener) { a[aIndex] = `${last},${c}`; }
          if (hadOpener && hasCloser) { a[aIndex] = a[aIndex].trim().substring(1, a[aIndex].length - 1); }
          if (!hadOpener && hasCloser) { throw new Error('closing quote found without opening quote'); }
          if (!hadOpener && !hasCloser) { a.push(c); }
          return a;
        }, [] as string[])
        .map((cell) => cell.trim()),
      );
    return {header, rows};
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
