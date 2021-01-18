<template>
  <canvas width="400" height="350" ref="canvas" />
</template>
<script>
import { mapGetters } from "vuex";
import Chart from "chart.js";

export default {
  name: "ChartTotal",
  computed: mapGetters(["historyChangePrevDay"]),
  methods: {
    buildChartData() {
      return {
        type: "bar",
        labels: this.historyChangePrevDay.map(stats => stats.day),
        datasets: [
          {
            label: "Veränderung zu vorherigem Tag",
            data: this.historyChangePrevDay.map(stats => stats.change),
            backgroundColor: "rgb(54, 162, 235)",
            fill: false,
            cubicInterpolationMode: "monotone",
            borderWidth: 2
          }
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
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    });
  },
  watch: {
    historyChangePrevDay() {
      const newChartData = this.buildChartData();
      this.$chart.data.labels = newChartData.labels;
      this.$chart.data.datasets[0].data = newChartData.datasets[0].data;
      this.$chart.update();
    }
  }
};
</script>
