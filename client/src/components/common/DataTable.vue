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
    name: "DataTable",
    components: {HotTable},
    props: ['options'],

    data: function() {
      return {
        settings: {
          data: this.options.data,
          colHeaders: this.options.colHeaders,
          rowHeaders: false,
          editor: false,
          height: 400,
          className: "htCenter",
          width: function() {
            return window.innerWidth - 100;
          },
          colWidths: this.options.colWidths
        }
      };
    },

    watch: {
      options: {
        handler(options) {
          this.settings.data = options.data;
        },
        deep: true
      }
    },

    methods: {
      onExport: function() {
        let exportFile = this.$refs.hot.table.getPlugin('exportFile');

        exportFile.downloadFile('csv', {
          bom: false,
          columnDelimiter: ',',
          columnHeaders: this.options.colHeaders,
          exportHiddenColumns: true,
          exportHiddenRows: true,
          fileExtension: 'csv',
          filename: this.options.fileName,
          mimeType: 'text/csv',
          rowDelimiter: '\r\n',
          rowHeaders: false
        });
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