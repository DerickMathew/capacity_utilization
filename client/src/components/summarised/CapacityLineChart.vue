<template>
    <div>
        <highcharts class="chart" :options="options" :updateArgs=[true]></highcharts>
    </div>
</template>

<script>

  export default {
    name: "CapacityLineChart",
    props: ['capacities', 'dateRange', 'experienceId'],

    data() {
      return {
        options: this.getChartOptions()
      }
    },

    watch: {
      capacities: function() {
        this.redraw();
      }
    },

    methods: {
      redraw() {
        this.options.xAxis.categories = this.getXAxisCategories();
        this.options.series = this.getSeriesData();
      },

      getSlots: function() {
        let capacities = this.capacities;
        let slots = new Set();
        for (let date in capacities) {
          let slotsCapacity = capacities[date];
          for (let slotTime in slotsCapacity) {
            let slot = this.$moment(date + ('0000' + slotTime).slice(-4), 'YYYY-MM-DDHHmm').format('HH:mm');
            slots.add(slot);
          }
        }
        return Array.from(slots).sort().reverse();
      },

      getSeriesData: function() {
        let capacities = this.capacities;
        let seriesData = [];
        let capacitySeriesData = [];
        let reservedSeriesData = [];
        let dates = this.getXAxisCategories();

        for (let date in capacities) {
          let slotsCapacity = capacities[date];
          let dateIndex = dates.indexOf(this.$moment(date).format('MMM DD'));
          let totalCapacity = 0;
          let totalReserved = 0;

          for (let slotTime in slotsCapacity) {
            let capacity = slotsCapacity[slotTime].capacity;
            let reserved = capacity - slotsCapacity[slotTime].open;

            totalCapacity += capacity;
            totalReserved += reserved;
          }

          capacitySeriesData.push({x: dateIndex, y: totalCapacity});
          reservedSeriesData.push({x: dateIndex, y: totalReserved});
        }
        seriesData.push({name: "Capacity", data: capacitySeriesData});
        seriesData.push({name: "Guest count", data: reservedSeriesData});
        return seriesData;
      },

      tooltipFormatter: function() {
        return function() {
          // let date = this.series.xAxis.categories[this.point.x] + ' ' + moment.months(month - 1) + ' ';
          // let time = this.series.yAxis.categories[this.point.y];
          // let value = this.point.value + '%';
          // return '<b>' + value + '</b> occupied on <b>' + time + ', ' + 'date' + '</b>';
        }
      },

      getXAxisCategories: function() {
        let daysOfMonth = [];
        let range = this.$moment.range(this.dateRange[0], this.dateRange[1]);
        for (let date of range.by('day')) {
          daysOfMonth.push(date.format('MMM DD'));
        }

        return daysOfMonth;
      },

      getYAxisCategories: function() {
        return this.getSlots()
      },

      getChartOptions: function() {
        return {
          chart: {
            type: 'line',
            marginTop: 40,
            marginBottom: 80,
            plotBorderWidth: 1
          },

          title: {
            text: ''
          },

          xAxis: {
            categories: this.getXAxisCategories()
          },
          yAxis: {
            title: null
          },

          legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
          },

          credits: {
            enabled: false
          },

          tooltip: {
            formatter: this.tooltipFormatter()
          },

          series: this.getSeriesData()
        }
      }
    }
  }
</script>

<style>

</style>