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
  },
  data: () => ({}),
  computed: {},

  watch: {
    data() {
      this.upload()
    },
  },

  mounted() {
    this.upload()
  },

  methods: {
    upload() {
      Plotly.react(this.$refs.container, this.data, this.layout)
    },
  },
}
</script>

<style scoped></style>
