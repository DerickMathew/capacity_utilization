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

    beforeCreate() {
      this.SERIES_CAPACITY = 'Capacity';
      this.SERIES_GUEST_COUNT = 'Guest count';
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
          let dateIndex = dates.indexOf(this.$moment(date).format());
          let totalCapacity = 0;
          let totalReserved = 0;

          for (let slotTime in slotsCapacity) {
            let capacity = slotsCapacity[slotTime].capacity;
            let reserved = capacity - slotsCapacity[slotTime].open;

            totalCapacity += capacity;
            totalReserved += reserved;
          }

          capacitySeriesData.push({x: dateIndex, y: totalCapacity, reserved: totalReserved});
          reservedSeriesData.push({x: dateIndex, y: totalReserved, capacity: totalCapacity});
        }

        capacitySeriesData.sort(function(point1, point2) {
          return point1.x - point2.x;
        });
        reservedSeriesData.sort(function(point1, point2) {
          return point1.x - point2.x;
        });

        seriesData.push({name: this.SERIES_CAPACITY, data: capacitySeriesData});
        seriesData.push({name: this.SERIES_GUEST_COUNT, data: reservedSeriesData});

        return seriesData;
      },

      tooltipFormatter: function() {
        let self = this;
        return function() {
          let date = self.$moment(this.series.xAxis.categories[this.point.x]).format('ll');
          let count;
          if (this.series.name === self.SERIES_CAPACITY) {
            count = `<div> ${ this.point.y } Capacity </div>
                    <div> ${ this.point.reserved } Reserved </div>`
          } else {
            count = `<div> ${ this.point.capacity } Capacity </div>
                    <div> ${ this.point.y } Reserved </div>`
          }

          return `<div class="tooltip-content">
                            <div>${ date }</div>
                            <br>
                            ${count}
                         </div>`;
        }
      },

      getXAxisCategories: function() {
        let daysOfMonth = [];
        let range = this.$moment.range(this.dateRange[0], this.dateRange[1]);
        for (let date of range.by('day')) {
          daysOfMonth.push(date.format());
        }

        return daysOfMonth;
      },

      getXAxisLabelFormatter: function() {
        let self = this;
        return function() {
          return self.$moment(this.value).format('MMM DD');
        }
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
            categories: this.getXAxisCategories(),
            labels: {
              formatter: this.getXAxisLabelFormatter()
            }
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
            shadow: false,
            useHTML: true,
            backgroundColor: '#343434',
            borderColor: '#333333',
            borderRadius: 1,
            style: {
              opacity: 0.9,
              color: '#cccccc'
            },
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