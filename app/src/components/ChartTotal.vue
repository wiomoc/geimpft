<template>
  <canvas width="400" height="400" ref="canvas" />
</template>
<script>
import { mapGetters } from "vuex";
import Chart from "chart.js";

export default {
  name: "ChartTotal",
  computed: mapGetters(["historyTotal"]),
  methods: {
    buildChartData() {
      return {
        labels: this.historyTotal.map(stats => stats.day),
        datasets: [
          {
            type: "line",
            label: "Insgesamt geimpft",
            data: this.historyTotal.map(stats => stats.stats.total),
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(0, 0, 0, 0)",
            fill: false,
            cubicInterpolationMode: "monotone",
            borderWidth: 2
          } /* {
          type: 'bar',
          label: 'Indikation Alter',
          backgroundColor: 'rgb(255, 159, 64)',
          data: this.historyTotal.map(stats => stats.stats.indication_age),
        }, {
          type: 'bar',
          label: 'Indikation Beruf',
          backgroundColor: 'rgb(255, 205, 86)',
          data: this.historyTotal.map(stats => stats.stats.indication_occupation),
        }, {
          type: 'bar',
          label: 'Indikation Medizinisch',
          backgroundColor: 'rgb(75, 192, 192)',
          data: this.historyTotal.map(stats => stats.stats.indication_medical),
        }, {
          type: 'bar',
          label: 'Pflegeheimbewohner',
          backgroundColor: 'rgb(54, 162, 235)',
          data: this.historyTotal.map(stats => stats.stats.indication_nursinghome),
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
    historyTotal() {
      this.$chart.data.datasets[0].data = this.buildChartData().datasets[0].data;
      this.$chart.update();
    }
  }
};
</script>
