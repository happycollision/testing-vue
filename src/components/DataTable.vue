<template>
  <div class="hello">
    <table class="border-collapse flex flex-wrap justify-around md:table">
      <tr class="block md:table-row flex-w-full" style="flex-basis: 100%">
        <th
          v-for="(label, index) in tableData.header"
          :key="label"
          :class="`inline-block md:border-b md:border-black md:table-cell ${index === 0 ? 'hidden' : ''}`"
        >
          <button
            v-if="index != 0"
            :class="`px-2 py-1 m-1 rounded text-white ${sortOn === label ? 'bg-blue' : 'bg-blue-light'}`"
            v-on:click="handleSort(label)"
          >
            <span class="w-1 inline-block"></span>
            {{label}}
            <span
              class="w-1 inline-block"
            >{{sortOn === label ? reverse ? '&#8595;' : '&#8593;' : ''}}</span>
          </button>
        </th>
      </tr>
      <tr v-for="row in sortedRows" :key="row.ID" class="w-64 m-4 md:m-auto md:table-row">
        <td
          v-for="name in tableData.header"
          :key="name"
          :class="`block md:py-4 md:border-t md:border-black md:table-cell ${name === 'ID' ? 'text-grey text-xs hidden' : ''}`"
        >
          <span :class="`${name === 'ID' ? 'ellipsis w-24' : ''}`">{{row[name]}}</span>
        </td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
type Row = { [s: string]: string | number };

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

  get tableData(): { header: string[]; rows: Row[] } {
    const convertIfNumber = (str: string) => {
      const asNum = parseFloat(str);
      const reconverted = asNum.toString();
      if (reconverted === str) {
        return asNum;
      }
      return str;
    };
    const [head, ...tail] = this.data.split('\n').map((line) =>
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
    const header = head.map((s) => s.toString());
    const rows = tail.map((r) => {
      const row: Row = {};
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

<style scoped>
td {
  text-align: left;
}

td:nth-child(5) {
  width: 12rem;
  margin: auto;
  text-align: center;
}

td:nth-child(1) {
  width: 6rem;
}

.ellipsis {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; /** IE6+, Firefox 7+, Opera 11+, Chrome, Safari **/
  -o-text-overflow: ellipsis;
}
</style>