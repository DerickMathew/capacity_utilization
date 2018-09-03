<template>
    <div class="chart-container" ref="chartContainer">
        <svg style="height: 0">
            <defs>
                <pattern id="zeroed-out" width="100%" height="100%" patternContentUnits="objectBoundingBox">
                    <polyline points="0 1, 1 0" style="fill:none;stroke:black;stroke-width:.03"/>
                </pattern>

                <pattern id="private" width="1" height="1" patternContentUnits="objectBoundingBox">
                    <polygon points=".5 0,1 0,1 .5" fill="blue"/>
                </pattern>

                <pattern id="private-zeroed-out" width="100%" height="100%" patternContentUnits="objectBoundingBox">
                    <polyline points="0 1, 1 0" style="fill:none;stroke:black;stroke-width:.03"/>
                    <polygon points=".5 0,1 0,1 .5" fill="blue"/>
                </pattern>

                <pattern id="private-closed" width="100%" height="100%" patternContentUnits="objectBoundingBox">
                    <polygon points="0 0, .5 0, 1 .5, 1 1, 0 1" fill="#c7c7c7"/>
                    <polygon points=".5 0,1 0,1 .5" fill="blue"/>
                </pattern>

                <pattern id="private-overbooked" width="100%" height="100%" patternContentUnits="objectBoundingBox">
                    <polygon points="0 0, .5 0, 1 .5, 1 1, 0 1" fill="#ff0000"/>
                    <polygon points=".5 0,1 0,1 .5" fill="blue"/>
                </pattern>

                <pattern id="private-inventory-restriction" width="100%" height="100%"
                         patternContentUnits="objectBoundingBox">
                    <polygon points="0 0, .5 0, 1 .5, 1 1, 0 1" fill="orange"/>
                    <polygon points=".5 0,1 0,1 .5" fill="blue"/>
                </pattern>
            </defs>
        </svg>

        <div class="event_legend">
            <div class="legend">
                <svg class="legend-overbooked">
                    <rect height="30px" width="30px" class="overbooked"></rect>
                </svg>
                <label>Overbooked</label>
            </div>

            <div class="legend">
                <svg class="legend-zeroed-out">
                    <rect height="30px" width="30px" class="manual-zeroed-out"></rect>
                </svg>
                <label>Zeroed out</label>
            </div>

            <div class="legend">
                <svg class="legend-closed">
                    <rect height="30px" width="30px" class="closed"></rect>
                </svg>
                <label>Schedule removed</label>
            </div>

            <div class="legend">
                <svg class="legend-inventory-restriction">
                    <rect height="30px" width="30px" class="inventory-restriction"></rect>
                </svg>
                <label>Inventory restriction</label>
            </div>

            <div class="legend">
                <svg class="legend-private">
                    <rect height="30px" width="30px" class="private"></rect>
                </svg>
                <label>Private</label>
            </div>

            <div class="legend">
                <svg class="legend-manually-adjusted">
                    <rect stroke="#DC5D42" fill="white" x="0" y="0" width="30" height="30"></rect>
                    <text fill="blue">
                        <tspan x="5" y="22">10</tspan>
                    </text>
                </svg>
                <label>Manually adjusted</label>
            </div>
        </div>

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
            let closed = slotsCapacity[slotTime].closed;
            let overbooked = capacity < reserved;
            let inventoryRestriction = false;

            if (capacity === 0) {
              if (manuallyAdjusted) {
                className = 'manual-zeroed-out'
              } else {
                className = ' inventory-restriction'
                inventoryRestriction = true
              }
            } else {
              occupiedPercentage = parseFloat((reserved / capacity * 100).toFixed(0));
            }

            if (privateEvent) {
              className += ' private'
            }
            if (manuallyAdjusted) {
              className += ' manually-adjusted'
            }

            if (overbooked) {
              className += ' overbooked'
            }

            if (closed) {
              className += ' closed'
            }

            seriesData.push({
              x: dateIndex,
              y: slotIndex,
              dataLabels: {
                className: className
              },
              start: start,
              value: occupiedPercentage,
              className: className,
              reserved: reserved,
              capacity: capacity,
              private: privateEvent,
              manuallyAdjusted: manuallyAdjusted,
              overbooked: overbooked,
              closed: closed,
              inventoryRestriction: inventoryRestriction
            });
          }
        }
        return seriesData;
      },

      tooltipFormatter: function() {
        let self = this;
        return function() {
          let date = self.$moment(this.point.start).format('llll');

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

          if (this.point.closed) {
            eventInfo += '<div>Schedule removed</div>'
          }

          if (this.point.inventoryRestriction) {
            eventInfo += '<div>Inventory unavailable</div>'
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
            max: 100,
            labels: {
              formatter: function() {
                return this.value + " %";
              }
            }
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

    .manual-zeroed-out {
        fill: url(#zeroed-out);
    }

    .overbooked {
        fill: #ff0000;
    }

    .inventory-restriction {
        fill: orange;
    }

    .closed {
        fill: #c7c7c7;
    }

    .private {
        fill: url(#private);
    }

    .event_legend {
        padding-left: 52px;
        display: flex;
        height: 32px;

    }

    .legend {
        display: flex;
        align-items: center;
        margin-right: 15px;
    }

    .legend label {
        margin-left: 5px;
    }

    .legend > svg {
        width: 32px;
        height: 32px;
    }

    .legend > svg > rect {
        stroke: #d5ff9e
    }

    .private.manual-zeroed-out {
        fill: url(#private-zeroed-out)
    }

    .private.inventory-restriction {
        fill: url(#private-inventory-restriction)
    }

    .private.closed {
        fill: url(#private-closed)
    }

    .private.overbooked {
        fill: url(#private-overbooked)
    }

    .manually-adjusted > text {
        fill: blue !important;
    }
</style>

<style scoped>
    .chart-container {
        width: 100%;
    }
</style>