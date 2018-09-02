<template>
    <div id="hot-preview">
        <div class="export">
            <el-button @click="onExport">Export</el-button>
        </div>
        <div class="hot-table">
            <HotTable :settings="settings" ref="hot"></HotTable>
        </div>
    </div>
</template>

<script>
  import HotTable from '@handsontable-pro/vue';

  export default {
    name: "SummarisedCapacityTable",
    components: {HotTable},
    props: ['capacities', 'dateRange', 'selectedListing', 'reportType'],

    data: function() {
      return {
        settings: {
          data: this.getData(),
          colHeaders: this.getColHeaders(),
          rowHeaders: false,
          editor: false,
          height: 400,
          className: "htCenter",
          width: function() {
            return window.innerWidth - 100;
          },
          colWidths: function() {
            return (window.innerWidth - 115) / 4
          }
        }
      };
    },

    watch: {
      capacities: function() {
        this.settings.data = this.getData();
      },

      reportType: function() {
        if (this.reportType === 2) {
          this.$refs.hot.table.render();
        }
      }
    },

    methods: {
      onExport: function() {
        let exportFile = this.$refs.hot.table.getPlugin('exportFile');
        let experienceName = this.selectedListing.name;
        let range = `${this.dateRange[0]}_ ${this.dateRange[1]}`;

        exportFile.downloadFile('csv', {
          bom: false,
          columnDelimiter: ',',
          columnHeaders: this.getColHeaders(),
          exportHiddenColumns: true,
          exportHiddenRows: true,
          fileExtension: 'csv',
          filename: `capacity_summarised_${experienceName}_${range}`,
          mimeType: 'text/csv',
          rowDelimiter: '\r\n',
          rowHeaders: false
        });
      },

      getColHeaders: function() {
        return ["Date", "Total Event capacity", "Total guest count booked", "Capacity utilisation(%)"];
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

<style src="../../../node_modules/handsontable-pro/dist/handsontable.full.css"></style>
<style>
    #hot-display-license-info {
        display: none;
    }
</style>

<style scoped>
    .hot-preview {
        margin-top: 20px;
    }

    .export {
        height: 50px;
    }

    .export .el-button {
        float: right;
    }
</style>