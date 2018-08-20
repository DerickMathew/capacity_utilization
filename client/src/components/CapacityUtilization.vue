<template>
    <div>
        <div class="header">
            <h2> Capacity Utilization</h2>
            <listing-selector :on-experience-change="onExperienceChange"></listing-selector>

            <el-date-picker v-model="dateRange" type="daterange" start-placeholder="Start date"
                            end-placeholder="End date" value-format="yyyy-MM-dd">
            </el-date-picker>
        </div>
        <capacity-heat-map v-if="capacities" :capacities="capacities" :dateRange="dateRange"
                           :experienceId="selectedListing"></capacity-heat-map>
    </div>
</template>

<script>
  import ListingSelector from '@/components/ListingSelector'
  import CapacityHeatMap from "./CapacityHeatMap";
  import {HTTP} from '../http-common';

  export default {
    name: "CapacityUtilization",
    components: {CapacityHeatMap, ListingSelector},

    data() {
      return {
        dateRange: undefined,
        selectedListing: undefined,
        capacities: undefined
      }
    },

    watch: {
      dateRange: function() {
        this.fetchCapacity();
      },

      selectedListing: function() {
        this.fetchCapacity();
      }
    },

    methods: {
      onExperienceChange: function(value) {
        this.selectedListing = value;
      },

      fetchCapacity: function() {
        if (this.dateRange && this.selectedListing) {
          let sellerId = '55c2b026ad2171f0438b45e7';
          let experienceId = this.selectedListing;
          let self = this;
          let params = {
            seller: sellerId,
            start: this.dateRange[0],
            end: this.dateRange[1],
            experience: experienceId,
            allowPastSlots: true
          };

          HTTP.get('api/capacity', {params: params})
            .then(response => {
              self.capacities = Object.values(response.data)[0];
            });
        }
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