<template>
  <v-card :loading="loading">
    <v-card-title>
      График
    </v-card-title>
    <v-card-text>
      <chart-line-stock v-if="!loading" :options="options" />
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
import ChartLineStock from '@/components/ChartLineStock'

export default {
  components: { ChartLineStock },
  data: () => ({
    options: {},
    loading: true,
  }),

  methods: {
    upload(file) {
      if (file)
        Papa.parse(file, {
          // header: true,
          complete: this.correctData,
        })
      else this.loading = true
    },

    correctData({ data }) {
      // console.log(data)
      const fields = data.slice(0, 1)[0].map((item) => item.trim())
      // console.log(fields)

      const createSeries = (fieldIndex, name) =>
        this.getSeries(data.slice(1, data.length), 0, fieldIndex, name)
      const series = fields
        .slice(1, fields.length)
        .map((item, index) => createSeries(index + 1, item))

      // console.log(series)
      this.options = {
        title: {
          text: 'График',
        },
        series,
      }

      this.loading = false
    },

    getSeries(data = [], timeIndex = 0, fieldIndex, name = '') {
      return {
        name,
        data: data.map((item) => {
          return [Date.parse(item[timeIndex]), parseFloat(item[fieldIndex])]
        }),
      }
    },
  },
}
</script>
