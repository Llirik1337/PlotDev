<template>
  <div ref="container" class="main"></div>
</template>

<script>
import Plotly from 'plotly.js-dist'

export default {
  props: {
    data: {
      type: Array,
      required: true,
    },
    options: {
      type: Object,
      required: true,
    },
    layout: {
      type: Object,
      required: true,
    },
    range: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    defaultSettings: {
      layout: {
        autosize: true,
        // height: 600,
        // width: 800,
        xaxis: {
          type: 'date',
          gridcolor: '#767',
          nticks: 2,
        },
        yaxis: { gridcolor: '#767', type: 'linear' },
      },
    },
    chart: {
      layout: {},
    },
  }),
  computed: {
    container() {
      return this.$refs.container
    },
    getLayout() {
      return {
        ...this.defaultSettings.layout,
        ...this.layout,
      }
    },
    getData() {
      return [...this.data]
    },
  },

  watch: {
    data() {
      this.upload()
    },
    layout() {
      this.upload()
    },
  },

  mounted() {
    this.upload()
    this.initEvents()
  },

  methods: {
    initEvents() {
      this.container
        .on('plotly_click', (data) => this.$emit('plot-click', data))
        .on('plotly_hover', (data) => this.$emit('plot-hover', data))
        .on('plotly_relayout', (data) => this.$emit('plot-zoom', data))
    },
    upload() {
      Plotly.react(this.container, this.data, this.getLayout, {
        scrollZoom: true,
        displaylogo: false,
        responsive: true,
      })
    },
  },
}
</script>
