<template>
  <div id="app">
    <DataTable :data="csv" v-on:edit-value="handleEdit($event)"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import DataTable, { EditEvent } from './components/DataTable.vue';
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
    this.$data.csv = (this.$data.csv as string)
      .split('\n')
      .map((row) => {
        const isEditedRow = row.indexOf(event.row.ID.toString()) > -1;
        if (isEditedRow) {
          const baseReplacementString = event.row[event.column].toString();
          const originalHasComma = baseReplacementString.indexOf(',') > -1;
          const replacementString = originalHasComma
            ? `"${baseReplacementString}"`
            : baseReplacementString;
          const newHasComma = event.value.toString().indexOf(',') > -1;
          const replaceWith = newHasComma
            ? `"${event.value}"`
            : event.value.toString();
          return row.replace(replacementString, replaceWith);
        }
        return row;
      })
      .join('\n');
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
