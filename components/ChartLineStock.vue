<template>
  <highstock :options="getOptions" />
</template>

<script>
export default {
  name: 'ChartLineStock',
  props: {
    options: {
      type: Object,
    },
  },
  data: () => ({
    defaultOptions: {
      chart: {
        zoomType: 'x',
      },
      rangeSelector: {
        buttonTheme: {
          width: 60,
        },
        buttons: [
          {
            type: 'hour',
            count: 1,
            text: 'Час',
          },
          {
            type: 'day',
            count: 1,
            text: 'День',
          },
          {
            type: 'month',
            count: 1,
            text: 'Месяц',
          },
          {
            type: 'year',
            count: 1,
            text: 'Год',
          },
          {
            type: 'all',
            text: 'Все время',
          },
        ],
        selected: 5, // all
      },
      plotOptions: {
        series: {
          compare: 'percent',
          showInNavigator: true,
        },
      },
      tooltip: {
        pointFormat:
          '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
        valueDecimals: 2,
        split: true,
      },
      xAxis: {
        minRange: 1000, // one second
      },
    },
  }),
  computed: {
    getOptions() {
      return Object.assign(this.options, this.defaultOptions)
    },
  },
  mounted() {},
}
</script>

<style scoped></style>
