<template>
  <canvas width="400" height="400" ref="canvas" />
</template>
<script>
import { mapGetters } from "vuex";
import Chart from "chart.js";

export default {
  name: "ChartTotal",
  computed: mapGetters(["historyTotal"]),
  data: function() {
    return {
      logScale: {
        yAxes: [
          {
            type: "logarithmic",
            ticks: {
              min: 0,
              callback: function(value) {
                if (value === 0) return "0";
                //reduce amount of labeled numbers on y-axis
                const remain =
                  value / Math.pow(10, Math.floor(Math.log10(value)));
                if (remain === 1 || remain === 2 || remain === 5) {
                  return value;
                }
                return "";
              }
            }
          }
        ]
      },
      linearScale: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            },
            stacked: true
          }
        ]
      }
    };
  },
  props: {
    linear: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    buildChartData() {
      return {
        labels: this.historyTotal.map(stats => stats.day),
        datasets: [
          {
            type: "line",
            label: "Erste verabreichte Impfdosis",
            data: this.historyTotal.map(({ stats }) => stats.total.first),
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255,82,82, .5)",
            pointBackgroundColor: "rgb(255, 99, 132)",
            fill: "origin", //fill to 'origin'
            cubicInterpolationMode: "monotone",
            borderWidth: 2
          },
          {
            type: "line",
            label: "Zweite verabreichte Impfdosis",
            data: this.historyTotal.map(({ stats }) => stats.total.second || 0),
            borderColor: "rgb(3, 169, 244)",
            backgroundColor: "rgba(79,195,247, .5)",
            pointBackgroundColor: "rgb(3, 169, 244)",
            fill: "-1", //fill to dataset 1
            cubicInterpolationMode: "monotone",
            borderWidth: 2
          }
          /*
          // display total not really necessary with "stacked: true"
          {
            type: "line",
            label: "Insgesamt verabreichte Impfdosen",
            data: this.historyTotal.map(
              ({ stats }) => stats.total.first + (stats.total.second || 0)
            ),
            borderColor: "rgb(0,230,118)",
            backgroundColor: "rgba(105,240,174, .5)",
            pointBackgroundColor: "rgb(0,230,118)",

            fill: "-2", //fill to dataset 2
            cubicInterpolationMode: "monotone",
            borderWidth: 2
          }
          {
            type: "bar",
            label: "Indikation Alter",
            backgroundColor: "rgb(255, 159, 64)",
            data: this.historyTotal.map(stats => stats.stats.indicationAge)
          },
          {
            type: "bar",
            label: "Indikation Beruf",
            backgroundColor: "rgb(255, 205, 86)",
            data: this.historyTotal.map(
              stats => stats.stats.indicationOccupation
            )
          },
          {
            type: "bar",
            label: "Indikation Medizinisch",
            backgroundColor: "rgb(75, 192, 192)",
            data: this.historyTotal.map(stats => stats.stats.indicationMedical)
          },
          {
            type: "bar",
            label: "Pflegeheimbewohner",
            backgroundColor: "rgb(54, 162, 235)",
            data: this.historyTotal.map(
              stats => stats.stats.indicationNursinghome
            )
          }*/
        ]
      };
    }
  },
  mounted() {
    this.$chart = new Chart(this.$refs.canvas.getContext("2d"), {
      type: "bar",
      data: this.buildChartData(),
      options: {
        responsive: true,
        tooltips: {
          mode: "index"
        },
        scales: {
          xAxes: [
            {
              type: "time",
              //                distribution: 'linear',
              time: {
                displayFormats: {
                  day: "MMM D"
                },
                unit: "day"
              },
              scaleLabel: {
                display: true
              }
            }
          ],
          yAxes: this.linearScale.yAxes
        },
        plugins: {
          filler: {
            propagate: true
          }
        }
      }
    });
  },
  watch: {
    historyTotal() {
      const newChartData = this.buildChartData();
      this.$chart.data.labels = newChartData.labels;
      this.$chart.data.datasets[0].data = newChartData.datasets[0].data;
      this.$chart.update();
    },
    linear(val) {
      let chart = this.$chart;
      chart.options.scales.yAxes = val
        ? this.linearScale.yAxes
        : this.logScale.yAxes;
      chart.update();
    }
  }
};
</script>
