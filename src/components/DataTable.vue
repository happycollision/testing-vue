<template>
  <div class="hello">
    <table>
      <tr>
        <th v-for="label in tableData.header" :key="label">
          {{label}}
          <button
            class="px-2 py-1 m-1 bg-blue-light rounded text-white"
            v-on:click="handleSort(label)"
          >Sort</button>
        </th>
      </tr>
      <tr v-for="row in sortedRows" :key="row.ID">
        <td v-for="name in tableData.header" :key="name">{{row[name]}}</td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class DataTable extends Vue {
  @Prop() private data!: string;
  private sortOn: null | string = null;
  private reverse = false;

  get sortedRows() {
    if (this.sortOn) {
      return this.sortRows(this.sortOn, this.reverse);
    } else {
      return this.tableData.rows;
    }
  }

  get tableData() {
    const convertIfNumber = (str: string) => {
      const asNum = parseFloat(str);
      const reconverted = asNum.toString();
      if (reconverted === str) {
        return asNum;
      }
      return str;
    };
    const [header, ...tail] = this.data.split('\n').map((line) =>
      line
        .split(',')
        .reduce(
          (a, c, i) => {
            if (i === 0) {
              return [c];
            }
            const aIndex = a.length - 1;
            const last = a[aIndex];
            const hadOpener = /^\s*"/.test(last);
            const hasCloser = /"\s*$/.test(c);
            if (hadOpener) {
              a[aIndex] = `${last},${c}`;
            }
            if (hadOpener && hasCloser) {
              a[aIndex] = a[aIndex].trim().substring(1, a[aIndex].length - 1);
            }
            if (!hadOpener && hasCloser) {
              throw new Error('closing quote found without opening quote');
            }
            if (!hadOpener && !hasCloser) {
              a.push(c);
            }
            return a;
          },
          [] as string[],
        )
        .map((cell) => cell.trim())
        .map((cell) => convertIfNumber(cell)),
    );
    const rows = tail.map((r) => {
      const row: { [s: string]: string | number } = {};
      header.map((h, i) => (row[h] = r[i]));
      return row;
    });
    return { header, rows };
  }

  private sortRows(on: string, reverse: boolean) {
    const [...rows] = this.tableData.rows;
    rows.sort((a, b) => {
      const aIsNum = typeof a[on] === 'number';
      const bIsNum = typeof b[on] === 'number';
      const oneIsNum = aIsNum || bIsNum;
      const bothAreNum = aIsNum && bIsNum;
      if (oneIsNum && !bothAreNum) {
        return aIsNum ? -1 : 1;
      }

      if (a[on] === b[on]) {
        return 0;
      }
      if (a[on] > b[on]) {
        return 1;
      }
      return -1;
    });
    return reverse ? rows.reverse() : rows;
  }

  private handleSort(name: string) {
    this.reverse = this.sortOn === name && !this.reverse;
    this.sortOn = name;
  }
}
</script>
