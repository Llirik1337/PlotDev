<template>
  <v-card :loading="loading">
    <v-card-title>
      График
    </v-card-title>
    <v-card-text>
      <chart v-if="!loading" :options="options" :data="data" :layout="layout" />
    </v-card-text>
    <v-card-actions>
      <v-file-input
        label="File input"
        outlined
        dense
        @change="upload"
      ></v-file-input>
    </v-card-actions>
  </v-card>
</template>

<script>
import Papa from 'papaparse'

export default {
  data: () => ({
    options: {},
    loading: false,
    layout: {
      title: 'График',
    },
    data: [],
  }),

  methods: {
    upload(file) {
      if (file)
        Papa.parse(file, {
          complete: this.correctData,
        })
      else this.loading = true
    },

    correctData({ data }) {
      const fields = data.slice(0, 1)[0].map((item) => item.trim())

      const createSeries = (fieldIndex, name) =>
        this.getSeries(data.slice(1, data.length), 0, fieldIndex, name)

      this.data = fields
        .slice(1, fields.length)
        .map((item, index) => createSeries(index + 1, item))

      console.log(this.data)

      this.loading = false
    },

    getSeries(data = [], timeIndex = 0, fieldIndex, name = '') {
      return {
        name,
        x: data.map((item) => {
          return [Date.parse(item[timeIndex])]
        }),
        y: data.map((item) => {
          return [parseFloat(item[fieldIndex])]
        }),
      }
    },
  },
}
</script>
