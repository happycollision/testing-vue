<template>
  <div class="hello">
    <div>
      <input
        class="bg-grey-lighter p-2 rounded w-64"
        data-testid="search"
        type="text"
        v-model="filterText"
        placeholder="search"
      >
      <button
        data-testid="clear search"
        class="bg-blue-light text-white px-2 py-1 ml-6 rounded"
        @click="filterText = ''"
      >clear</button>
    </div>
    <table class="border-collapse flex flex-wrap justify-around md:table w-full">
      <tr class="block md:table-row flex-w-full" style="flex-basis: 100%">
        <th
          v-for="(label, index) in tableData.header"
          :key="label"
          :class="`inline-block md:border-b md:border-black md:table-cell ${index === 0 ? 'hidden' : ''}`"
        >
          <button
            v-if="index != 0"
            data-testid="sort"
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
      <tr
        v-for="row in sortedRows"
        @click="toggleSelected(row)"
        :key="row.ID"
        :class="`w-64 m-4 md:m-auto md:table-row ${isSelected(row) ? 'bg-grey-light' : ''}`"
      >
        <td
          v-for="name in tableData.header"
          :key="name"
          :class="`block md:p-4 md:border-t md:border-black md:table-cell ${name === 'ID' ? 'hidden' : ''}`"
        >
          <template v-if="name === 'Description'">
            <form @submit.prevent="submitForm($event, row, name)">
              <input
                class="w-full block cursor-pointer"
                type="text"
                :name="`[${row.ID}]desc`"
                :id="`[${row.ID}]desc`"
                :value="isSelected(row) && editing && editing !== row ? 'editing multiple...' : row[name]"
                :data-testid="`${row.ID}:description`"
                @blur="submitEdit($event, row, name)"
                @click.stop.prevent="edit(row)"
                @focus="edit(row); $event.target.select()"
              >
            </form>
          </template>
          <template v-else-if="name === 'Amount'">
            <span
              :class="`${parseFloat(row[name]) < 0 ? 'text-red' : ''}`"
            >{{formatCurrency(row[name])}}</span>
          </template>
          <template v-else-if="name === 'Date'">
            <div class="text-right">{{row[name]}}</div>
          </template>
          <template v-else-if="name === 'ID'">
            <div class="ellipsis w-24 text-grey-dark text-xs">
              <input
                class="text-base"
                :data-testid="`select ${row.ID}`"
                type="checkbox"
                :checked="isSelected(row)"
              >
              {{row[name]}}
            </div>
          </template>
          <template v-else>{{row[name]}}</template>
        </td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
export interface Row {
  [s: string]: string | number;
}
export interface EditEvent {
  row: Row;
  column: string;
  value: string | number;
}

@Component
export default class DataTable extends Vue {
  @Prop() private data!: string;
  private sortOn: null | string = null;
  private reverse = false;
  private editing: Row | null = null;
  private selected: string[] = [];
  private filterText = '';

  get sortedRows() {
    if (this.sortOn) {
      return this.sortRows(this.sortOn, this.reverse);
    } else {
      return this.tableData.rows;
    }
  }

  get tableData() {
    if (this.filterText === '') {
      return this.allTableData;
    } else {
      const { header, rows } = this.allTableData;
      const filteredRows = rows.filter((row) =>
        Object.keys(row).reduce(
          (a, c) =>
            a
              ? a
              : row[c]
                  .toString()
                  .toLowerCase()
                  .includes(this.filterText.toLowerCase()),
          false,
        ),
      );

      return { header, rows: filteredRows };
    }
  }

  get allTableData(): { header: string[]; rows: Row[] } {
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
      row.Date = this.formatDate(row.Date as string);
      return row;
    });
    return { header, rows };
  }

  private submitEdit(
    ev: Event & { currentTarget: HTMLInputElement },
    row: Row,
    name: string,
  ) {
    this.editing = null;
    const payload: EditEvent = {
      value: ev.currentTarget.value,
      row,
      column: name,
    };
    if (payload.value !== row[name]) {
      this.$emit('edit-value', payload);
      const allOthers = this.selected
        .concat([])
        .filter((id) => id !== payload.row.ID);
      allOthers.forEach((id) => {
        const newPayload = { ...payload };
        newPayload.row = this.tableData.rows.find((r) => r.ID === id) as Row;
        this.$emit('edit-value', newPayload);
      });
    }
  }

  private submitForm(
    ev: Event & { currentTarget: HTMLFormElement },
    row: Row,
    name: string,
  ) {
    const fakeEv = {
      ...ev,
      currentTarget: ev.currentTarget.querySelector(
        'input',
      ) as HTMLInputElement,
    };
    this.submitEdit(fakeEv, row, name);
  }

  private isSelected(row: Row) {
    return this.selected.indexOf(row.ID as string) > -1;
  }

  private toggleSelected(row: Row) {
    const index = this.selected.indexOf(row.ID as string);
    if (index === -1) {
      this.selected.push(row.ID as string);
    } else {
      this.selected.splice(index, 1);
    }
  }

  private edit(row: Row) {
    this.editing = row;
    this.$nextTick(() => {
      const input: HTMLInputElement | null = this.$el.querySelector(
        `[name="[${row.ID}]desc"]`,
      );
      if (input) {
        input.focus();
      }
    });
  }

  private formatCurrency(input: string | number) {
    if (typeof input === 'string') {
      input = parseFloat(input);
    }
    return input.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  }

  private formatDate(input: string) {
    return new Date(input).toLocaleString();
  }

  private filter(ev: Event & { currentTarget: HTMLInputElement }) {
    this.filterText = ev.currentTarget.value;
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
    if (this.sortOn === name && this.reverse) {
      this.sortOn = null;
      this.reverse = false;
      return;
    }
    this.reverse = this.sortOn === name;
    this.sortOn = name;
  }
}
</script>

<style scoped>
td {
  text-align: left;
}

td:nth-child(1) {
  width: 6rem;
}

td:nth-child(2) {
  width: 12rem;
}

td:nth-child(4) {
  width: 14rem;
}

td:nth-child(5) {
  width: 12rem;
  margin: auto;
  text-align: center;
}

.ellipsis {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; /** IE6+, Firefox 7+, Opera 11+, Chrome, Safari **/
  -o-text-overflow: ellipsis;
}
</style>