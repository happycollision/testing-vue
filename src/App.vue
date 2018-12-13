<template>
  <div id="app" class="p-1">
    <div class="max-w-md text-left m-auto p-2">
      <h1 class="text-center">Testing Vue</h1>
      <p>This is my first attempt at using Vue at all. You can read my thoughts about building this project at its <a href="https://github.com/happycollision/testing-vue/">Github repo</a>.</p>
      <details>
        <summary class="cursor-pointer">Instructions</summary>
        <p>You can tab through the interactable fields below, or click.</p>
        <p>The column header buttons cycle through sort ascending, descending, then none with each click.</p>
        <p>The search field acts more like a filter. Any text inside a row is searched. If no matches are found, the row is removed from the view. Click "clear" to wipe out your search text.</p>
        <p>Clicking directly on a desciption allows you to edit that description. Pressing <code class="bg-grey-light p-1">enter</code> or leaving the field will commit the changes.</p>
        <p>Clicking on a row (not the description, but anywhere else) selects that row. With multiple rows selected, any edit you make to a description is applied to all selected (and visible) rows' descriptions.</p>
        <p>Clicking on the lone checkbox at the top of the left-most column (the ID column) selects all visible rows. Clicking again deselects all of them.</p>
      </details>
    </div>
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
}

p {
  margin-top: 1em;
  margin-bottom: 1em;
}
</style>
