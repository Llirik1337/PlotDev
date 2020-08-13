<template>
  <div ref="chart"></div>
</template>

<script>
import Plotly from 'plotly.js'

export default {
  name: 'Chart',
  props: {
    options: {
      type: Object,
      required: true,
    },
  },
  data: () => ({}),
  computed: {
    getOptions() {
      return Object.assign(this.options, this.defaultOptions)
    },
  },
  mounted() {
    const trace1 = {
      x: [1, 2, 3, 4],
      y: [10, 15, 13, 17],
      mode: 'markers',
    }

    const trace2 = {
      x: [2, 3, 4, 5],
      y: [16, 5, 11, 9],
      mode: 'lines',
    }

    const trace3 = {
      x: [1, 2, 3, 4],
      y: [12, 9, 15, 12],
      mode: 'lines+markers',
    }

    const data = [trace1, trace2, trace3]

    const layout = {
      title: 'Line and Scatter Plot',
    }

    Plotly.react(this.$refs.chart, data, layout)
  },
}
</script>

<style scoped></style>
