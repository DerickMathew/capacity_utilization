<template>
    <div>
        <div class="header">
            <h2> Capacity Utilization</h2>
            <listing-selector :on-experience-change="onExperienceChange" :sellerId=sellerId></listing-selector>

            <el-date-picker v-model="dateRange" :picker-options="datePickerOptions" type="daterange"
                            start-placeholder="Start date"
                            end-placeholder="End date" value-format="yyyy-MM-dd">
            </el-date-picker>
        </div>

        <div class="body">
            <div class="report-selector">
                <el-radio-group v-model="reportType">
                    <el-radio :label="1">Detailed report</el-radio>
                    <el-radio :label="2">Summarised report</el-radio>
                </el-radio-group>
            </div>

            <div>
                <detailed-report v-show="reportType == 1" :capacities="capacities" :dateRange="dateRange"
                                 :selectedListing="selectedListing" :reportType="reportType"></detailed-report>

                <summarised-report v-show="reportType == 2" :capacities="capacities" :dateRange="dateRange"
                                   :selectedListing="selectedListing" :reportType="reportType"></summarised-report>
            </div>
        </div>
    </div>
</template>

<script>
  import ListingSelector from './ListingSelector'
  import DetailedReport from "./detailed/DetailedReport";
  import SummarisedReport from "./summarised/SummarisedReport";
  import {HTTP} from '../http-common';

  export default {
    name: "CapacityUtilization",
    components: {DetailedReport, SummarisedReport, ListingSelector},

    data() {
      return {
        dateRange: this.getDefaultDateRange(),
        datePickerOptions: {
          disabledDate: this.disabledDate(),
          onPick: this.onPick()
        },
        selectedListing: undefined,
        capacities: undefined,
        reportType: 1
      }
    },

    created() {
      let params = (new URL(document.location)).searchParams;
      this.sellerId = params.get('seller');
    },

    watch: {
      dateRange: function() {
        this.fetchCapacity();
      }
    },

    methods: {
      disabledDate() {
        let self = this;
        return function(date) {
          if (self._range && self._range.maxDate == null) {
            return self.$moment(date) > self.$moment(self._range.minDate).add(62, 'd')
              || self.$moment(date) < self.$moment(self._range.minDate).add(-62, 'd');
          }
          return false;
        }
      },

      onPick() {
        let self = this;
        return function(range) {
          self._range = range;
        }
      },

      getDefaultDateRange() {
        const startOfMonth = this.$moment().startOf('month').format('YYYY-MM-DD');
        const endOfMonth = this.$moment().endOf('month').format('YYYY-MM-DD');
        return [startOfMonth, endOfMonth];
      },

      onExperienceChange(selectedListing) {
        this.selectedListing = selectedListing;
        this.fetchCapacity();
      },

      fetchCapacity() {
        if (this.dateRange && this.selectedListing) {
          let sellerId = this.sellerId;
          let experienceId = this.selectedListing.id;
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
        top: 0;
        width: calc(100% - 60px);
        background: white;
        z-index: 999;
        position: fixed;
    }

    .body {
        margin-top: 68px;
    }

    .el-date-editor {
        margin-left: 10px;
    }

    .el-radio__label {
        font-size: 18px;
    }
</style>