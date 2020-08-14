<template>
  <div ref="container"></div>
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
        xaxis: {
          type: 'date',
          // range: this.range,
          gridcolor: '#767',
        },
        yaxis: { gridcolor: '#767' },
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
  },

  mounted() {
    this.upload()
  },

  methods: {
    initEvents() {
      this.container
        .on('plotly_click', (data) => this.$emit('plot-click', data))
        .on('plotly_hover', (data) => this.$emit('plot-hover', data))
        .on('plotly_relayout', (data) => this.$emit('plot-zoom', data))
    },
    upload() {
      Plotly.react(this.container, this.data, this.getLayout)
      this.initEvents()
    },
  },
}
</script>

<style scoped></style>
