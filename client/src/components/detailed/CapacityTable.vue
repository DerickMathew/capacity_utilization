<template>
    <div>
        <DataTable v-if="reportType==1" :options="options"></DataTable>
    </div>
</template>


<script>
  import DataTable from '../common/DataTable';

  export default {
    name: "CapacityTable",
    components: {DataTable},
    props: ['capacities', 'dateRange', 'selectedListing', 'reportType'],

    data: function() {
      return {
        options: {
          data: this.getData(),
          colHeaders: ["Date", "Time", "Event capacity", "Guest count booked", "Capacity utilisation(%)"],
          fileName: this.getFileName(),
          colWidths: function() {
            return (window.innerWidth - 115) / 5
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
        return `capacity_detail_${experienceName}_${range}`
      },

      getData: function() {
        let data = [];

        let capacities = this.capacities;

        for (let date in capacities) {
          let slotsCapacity = capacities[date];

          for (let slotTime in slotsCapacity) {
            let capacity = slotsCapacity[slotTime].capacity;
            let booked = capacity - slotsCapacity[slotTime].open;
            let capacityUtilization;

            if (capacity !== 0) {
              capacityUtilization = parseFloat((booked / capacity * 100).toFixed(0));
            } else {
              capacityUtilization = '--'
            }

            data.push([date, slotTime, capacity, booked, capacityUtilization]);
          }
        }

        let self = this;

        data.sort(function(row1, row2) {
          let start1 = self.$moment(row1[0] + ('0000' + row1[1]).slice(-4), 'YYYY-MM-DDHHmm');
          let start2 = self.$moment(row2[0] + ('0000' + row2[1]).slice(-4), 'YYYY-MM-DDHHmm');
          return start1.isBefore(start2) ? 0 : 1
        });

        data = data.map(function(col) {
          let start = this.$moment(col[0] + ('0000' + col[1]).slice(-4), 'YYYY-MM-DDHHmm');
          col[1] = start.format('hh:mm A');
          return col;
        }, this);

        return data;
      }
    }
  }
</script>
