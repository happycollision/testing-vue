<template>
  <div id="app">
    <DataTable
      :header="allTableData.header"
      :rows="allTableData.rows"
      v-on:edit-value="handleEdit($event)"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import DataTable from './components/DataTable.vue';
import { EditEvent } from './types/table-types';
import { csvToTableData, editCsvViaRowEdit } from './utils/csv-conversion';
import '@/assets/main.css';
import csv from '@/assets/data.csv';

@Component({
  components: {
    DataTable,
  },
  data: () => ({
    csv,
  }),
})
export default class App extends Vue {
  private handleEdit(event: EditEvent) {
    this.$data.csv = editCsvViaRowEdit(this.$data.csv, event);
  }

  get allTableData() {
    return csvToTableData(this.$data.csv);
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
