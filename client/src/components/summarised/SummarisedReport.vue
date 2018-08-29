<template>
    <div>
        <capacity-line-chart v-if="capacities" :capacities="capacities" :dateRange="dateRange"
                             :experienceId="selectedListing"></capacity-line-chart>

        <summarised-capacity-table v-show="reportType == 2" v-if="capacities" :capacities="capacities" :dateRange="dateRange"
                                   :experienceId="selectedListing" :report-type="reportType"></summarised-capacity-table>
    </div>
</template>

<script>
  import CapacityLineChart from "./CapacityLineChart";
  import SummarisedCapacityTable from "./SummarisedCapacityTable";

  export default {
    name: "SummarisedReport",
    props: ['capacities', 'dateRange', 'selectedListing', 'reportType'],
    components: {CapacityLineChart, SummarisedCapacityTable}
  }
</script>

<style scoped>
    #hot-preview {

    }
</style>