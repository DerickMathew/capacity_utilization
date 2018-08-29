<template>
    <div>
        <capacity-heat-map v-if="capacities" :capacities="capacities" :dateRange="dateRange"
                           :selectedListing="selectedListing"></capacity-heat-map>

        <capacity-table v-if="capacities" :capacities="capacities" :dateRange="dateRange"
                        :experienceId="selectedListing" :reportType="reportType"></capacity-table>
    </div>
</template>

<script>
  import CapacityHeatMap from "./CapacityHeatMap";
  import CapacityTable from "./CapacityTable";

  export default {
    name: "DetailedReport",
    props: ['capacities', 'dateRange', 'selectedListing', 'reportType'],
    components: {CapacityHeatMap, CapacityTable}
  }
</script>

<style scoped>

</style>