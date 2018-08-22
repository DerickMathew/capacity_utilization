<template>
    <div id="hot-preview">
        <div class="export">
            <el-button @click="onExport">Export</el-button>
        </div>
        <div class="hot-table">
            <HotTable :settings="settings" ref="testHot"></HotTable>
        </div>
    </div>
</template>

<script>
  import HotTable from '@handsontable-pro/vue';

  export default {
    name: "CapacityTable",
    components: {HotTable},
    props: ['capacities', 'dateRange', 'experienceId'],

    data: function() {
      return {
        settings: {
          data: this.getData(),
          colHeaders: this.getColHeaders(),
          rowHeaders: false,
          editor: false,
          height: 400,
          width: function() {
            return window.innerWidth - 100;
          },
          colWidths: function() {
            return (window.innerWidth - 115) / 5
          }
        }
      };
    },

    watch: {
      capacities: function() {
        this.settings.data = this.getData();
      }
    },

    methods: {
      onExport: function() {
        let exportFile = this.$refs.testHot.table.getPlugin('exportFile');
        exportFile.downloadFile('csv', {
          bom: false,
          columnDelimiter: ',',
          columnHeaders: this.getColHeaders(),
          exportHiddenColumns: true,
          exportHiddenRows: true,
          fileExtension: 'csv',
          filename: 'capacity_utilization_[YYYY]-[MM]-[DD]',
          mimeType: 'text/csv',
          rowDelimiter: '\r\n',
          rowHeaders: false
        });
      },

      getColHeaders: function() {
        return ["Date", "Time", "Event capacity", "Guest count booked", "Capacity utilisation"];
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
              capacityUtilization = 'N/A'
            }

            data.push([date, slotTime, capacity, booked, capacityUtilization]);
          }
        }
        return data;
      }
    }
  }
</script>

<style src="../../../node_modules/handsontable-pro/dist/handsontable.full.css"></style>
<style>
    #hot-display-license-info {
        display: none;
    }
</style>

<style scoped>
    .hot-preview {
        margin-top: 25px;
    }

    .export {
        height: 50px;
    }

    .export .el-button {
        float: right;
    }
</style>