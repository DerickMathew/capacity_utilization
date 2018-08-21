<template>
    <div>
        <svg style="height: 0">
            <defs>
                <pattern id="hash4_4" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <rect width="8" height="8" transform="translate(7,0)" fill="black"></rect>
                </pattern>
            </defs>
        </svg>
        <highcharts class="chart" :options="options" :updateArgs=[true]></highcharts>
    </div>
</template>

<script>

  export default {
    name: "CapacityHeatMap",
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
        this.options.yAxis.categories = this.getYAxisCategories();
        this.options.series[0].data = this.getSeriesData();
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
        let slots = this.getSlots();
        let dates = this.getXAxisCategories();

        for (let date in capacities) {
          let slotsCapacity = capacities[date];
          let dateIndex = dates.indexOf(this.$moment(date).format('MMM DD'));

          for (let slotTime in slotsCapacity) {
            let className = '';
            let occupiedPercentage = undefined;

            let start = this.$moment(date + ('0000' + slotTime).slice(-4), 'YYYY-MM-DDHHmm');
            let slotIndex = slots.indexOf(this.$moment(start).format('HH:mm'));

            let capacity = slotsCapacity[slotTime].capacity;
            if (capacity === 0) {
              className = 'zeroed_out'
            } else {
              let open = slotsCapacity[slotTime].open;
              occupiedPercentage = parseFloat(((capacity - open) / capacity * 100).toFixed(0));
            }

            seriesData.push({x: dateIndex, y: slotIndex, value: occupiedPercentage, className: className});
          }
        }
        return seriesData;
      },

      tooltipFormatter: function() {
        return function() {
          // let date = this.series.xAxis.categories[this.point.x] + ' ' + moment.months(month - 1) + ' ';
          let time = this.series.yAxis.categories[this.point.y];
          let value = this.point.value + '%';
          return '<b>' + value + '</b> occupied on <b>' + time + ', ' + 'date' + '</b>';
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
            type: 'heatmap',
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
            categories: this.getYAxisCategories(),
            title: null
          },

          colorAxis: {
            stops: [
              [0, '#ffffcc'],
              [0.25, '#c2e699'],
              [0.5, '#78c679'],
              [0.75, '#24A462'],
              [1, '#22793D']
            ],
            min: 0,
            max: 100
          },

          legend: {
            align: 'right',
            layout: 'vertical',
            margin: 0,
            verticalAlign: 'top',
            y: 25,
            symbolHeight: 280
          },

          tooltip: {
            formatter: this.tooltipFormatter()
          },

          series: [{
            name: '',
            borderWidth: 1,
            borderColor: "#46a546",
            data: this.getSeriesData(),
            dataLabels: {
              "enabled": true,
              "color": "#333333",
              "style": {textOutline: 0, fontweight: "none"}
            }
          }]
        }
      }
    }
  }
</script>

<style>
    .zeroed_out {
        fill: url(#hash4_4);
    }
</style>