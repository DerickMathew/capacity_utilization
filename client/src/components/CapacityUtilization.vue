<template>
    <div class="header">
        <h2> Capacity Utilization</h2>
        <listing-selector :on-listing-change="onListingChange"></listing-selector>
        <el-date-picker
                v-model="dateRange"
                type="daterange"
                range-separator="To"
                start-placeholder="Start date"
                end-placeholder="End date">
        </el-date-picker>
    </div>
</template>

<script>
  import ListingSelector from '@/components/ListingSelector'

  export default {
    name: "CapacityUtilization",
    components: {ListingSelector},

    data() {
      return {
        dateRange: ''
      }
    },

    methods: {
      onListingChange: function(value) {
        console.log(value);
      }
    }
  }
</script>

<style scoped>
    .header > h2 {
        text-transform: uppercase;
        flex-grow: 1;
    }

    .header {
        display: flex;
        align-items: center;
    }

    .el-date-editor {
        margin-left: 10px;
    }
</style>