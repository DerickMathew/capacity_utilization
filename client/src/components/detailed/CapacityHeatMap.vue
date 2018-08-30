<template>
    <div class="chart-container" ref="chartContainer">
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
    props: ['capacities', 'dateRange', 'selectedListing'],

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
      calculateChartHeight: function() {
        let yAxisCategories = this.getYAxisCategories();
        let containerHeight = Math.max(yAxisCategories.length * 35 + 100, 450);
        return containerHeight - 50;
      },

      redraw() {
        let yAxisCategories = this.getYAxisCategories();

        this.options.xAxis.categories = this.getXAxisCategories();
        this.options.yAxis.categories = yAxisCategories;
        this.options.series[0].data = this.getSeriesData();
        this.options.chart.height = this.calculateChartHeight();
        this.options.chart.width = this.$refs.chartContainer.style.width;
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
          let dateIndex = dates.indexOf(this.$moment(date).format());

          for (let slotTime in slotsCapacity) {
            let className = '';
            let occupiedPercentage = undefined;

            let start = this.$moment(date + ('0000' + slotTime).slice(-4), 'YYYY-MM-DDHHmm');
            let slotIndex = slots.indexOf(this.$moment(start).format('HH:mm'));

            let capacity = slotsCapacity[slotTime].capacity;
            let open = slotsCapacity[slotTime].open;
            let reserved = capacity - open;

            let privateEvent = slotsCapacity[slotTime].private;
            let manuallyAdjusted = slotsCapacity[slotTime].capcityManuallyAdjusted;
            let overbooked = capacity < reserved;

            if (capacity === 0) {
              className = 'zeroed_out'
            } else {
              occupiedPercentage = parseFloat((reserved / capacity * 100).toFixed(0));
            }

            if (privateEvent) {
              className += ' private_event'
            }
            if (manuallyAdjusted) {
              className += ' manually_adjusted'
            }

            if (overbooked) {
              className += ' overbooked'
            }

            seriesData.push({
              x: dateIndex,
              y: slotIndex,
              value: occupiedPercentage,
              className: className,
              reserved: reserved,
              capacity: capacity,
              private: privateEvent,
              manuallyAdjusted: manuallyAdjusted,
              overbooked: overbooked
            });
          }
        }
        return seriesData;
      },

      tooltipFormatter: function() {
        let self = this;
        return function() {
          let date = self.$moment(this.series.xAxis.categories[this.point.x]).format('lll');

          let eventInfo = '';

          if (this.point.manuallyAdjusted) {
            eventInfo += '<div>Manually adjusted capacity</div>'
          }
          if (this.point.private) {
            eventInfo += '<div>Private event</div>'
          }

          if (this.point.overbooked) {
            eventInfo += '<div>Overbooked</div>'
          }

          let template = `<div class="tooltip-content">
                            <div>${ date }</div>
                            <br>
                            <div>${ this.point.capacity } Capacity</div>
                            <div>${ this.point.reserved } Reserved</div>
                            <br>
                            ${ eventInfo }
                         </div>`;

          return template;
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

      getYAxisCategories: function() {
        return this.getSlots()
      },

      getXAxisLabelFormatter: function() {
        let self = this;
        return function() {
          return self.$moment(this.value).format('MMM DD');
        }
      },

      getChartOptions: function() {
        return {
          chart: {
            type: 'heatmap',
            marginTop: 40,
            marginBottom: 80,
            plotBorderWidth: 1,
            height: this.calculateChartHeight()
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

          plotOptions: {
            series: {
              turboThreshold: 0
            }
          },

          series: [{
            name: '',
            borderWidth: 1,
            borderColor: "#d5ff9e",
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
    .tooltip-content {
        font-size: 15px;
        color: white;
    }
    .zeroed_out {
        fill: url(#hash4_4);
    }

    .overbooked {
        fill: #ff0000;
    }

</style>

<style scoped>
    .chart-container {
        width: 100%;
    }
</style>