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
    props: ['capacities', 'dateRange', 'experienceId'],

    data: function() {
      return {
        settings: {
          data: this.getData(),
          colHeaders: this.getColHeaders(),
          rowHeaders: false,
          editor: false,
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
        let exportFile = this.$refs.hot.table.getPlugin('exportFile');
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
        return ["Date", "Total Event capacity", "Total guest count booked", "Capacity utilisation"];
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
            capacityUtilization = 'N/A'
          }
          data.push([date, totalCapacity, totalReserved, capacityUtilization])
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
        margin-top: 20px;
    }

    .export {
        height: 40px;
    }

    .export .el-button {
        float: right;
    }
</style>