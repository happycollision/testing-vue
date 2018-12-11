<template>
  <div id="app">
    <DataTable :data="csv" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import DataTable from './components/DataTable.vue';
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
export default class App extends Vue {}
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
