<template>
    <div>
        <capacity-line-chart v-if="capacities" :capacities="capacities" :dateRange="dateRange"
                             :experienceId="selectedListing"></capacity-line-chart>

        <summarised-capacity-table v-if="capacities" :capacities="capacities" :dateRange="dateRange"
                                   :experienceId="selectedListing"></summarised-capacity-table>
    </div>
</template>

<script>
  import CapacityLineChart from "./CapacityLineChart";
  import SummarisedCapacityTable from "./SummarisedCapacityTable";

  export default {
    name: "SummarisedReport",
    props: ['capacities', 'dateRange', 'selectedListing'],
    components: {CapacityLineChart, SummarisedCapacityTable}
  }
</script>

<style scoped>

</style>