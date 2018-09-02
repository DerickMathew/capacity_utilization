<template>
    <div>
        <DataTable v-if="reportType==2" :options="options"></DataTable>
    </div>
</template>

<script>
  import DataTable from '../common/DataTable';

  export default {
    name: "SummarisedCapacityTable",
    components: {DataTable},
    props: ['capacities', 'dateRange', 'selectedListing', 'reportType'],

    data: function() {
      return {
        options: {
          data: this.getData(),
          colHeaders: ["Date", "Total Event capacity", "Total guest count booked", "Capacity utilisation(%)"],
          fileName: this.getFileName(),
          colWidths: function() {
            return (window.innerWidth - 115) / 4
          }
        }
      };
    },

    watch: {
      capacities: function() {
        this.options.data = this.getData();
        this.options.fileName = this.getFileName();
      }
    },

    methods: {
      getFileName() {
        let experienceName = this.selectedListing.name;
        let range = `${this.dateRange[0]}_ ${this.dateRange[1]}`;
        return `capacity_summarised_${experienceName}_${range}`
      },

      getData: function() {
        let data = [];
        let capacities = this.capacities;
        for (let date in capacities) {
          let slotsCapacity = capacities[date];
          let totalCapacity = 0;
          let totalReserved = 0;

          for (let slotTime in slotsCapacity) {
            let capacity = slotsCapacity[slotTime].capacity;
            let reserved = capacity - slotsCapacity[slotTime].open;

            totalCapacity += capacity;
            totalReserved += reserved;
          }
          let capacityUtilization;

          if (totalCapacity !== 0) {
            capacityUtilization = parseFloat((totalReserved / totalCapacity * 100).toFixed(0));
          } else {
            capacityUtilization = '--'
          }
          data.push([date, totalCapacity, totalReserved, capacityUtilization])
        }

        data.sort(function(col1, col2) {
          if (col1[0] > col2[0]) {
            return 1;
          } else if (col1[0] < col2[0]) {
            return -1
          }
          return 0;
        });

        return data;
      }
    }
  }
</script>
