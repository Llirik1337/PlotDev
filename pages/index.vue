<template>
  <v-card :loading="loading">
    <v-card-title>
      График
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="2">
          <v-text-field
            v-model="top"
            label="Задание верхнего порогового значения"
          />
          <v-text-field
            v-model="bottom"
            label="Задание нижнего погового значения"
          />
        </v-col>
        <v-col cols="10">
          <chart
            v-if="!loading"
            :options="options"
            :range="range"
            :data="data"
            :layout="layout"
            v-on:plot-click="click"
            v-on:plot-zoom="zoom"
            v-on:plot-hover="hover"
          />
        </v-col>
      </v-row>
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
    loading: true,
    layout: {
      title: 'График',
    },
    top: 0,
    bottom: 0,
    utils: [],
    data: [],
    fileData: [],
    range: [],
  }),

  computed: {
    average() {
      return this.data.map((item) => {
        return {}
      })
    },
  },

  watch: {
    top() {
      this.updateData(this.fileData)
    },
    bottom() {
      this.updateData(this.fileData)
    },
  },

  mounted() {},

  methods: {
    // createAverage(data = [], options = {}) {
    //   const defaultOptions = {
    //     title: 'Cреднее арифметическое',
    //     visible: false,
    //     trace: '',
    //     ...options,
    //   }
    //
    //   return {
    //     name: `${defaultOptions.title} (${defaultOptions.trace})`,
    //   }
    // },
    //
    // calcAverage(range = []) {},

    createPlank(options = { name: 'Линия', x: [], y: [] }) {
      return {
        ...options,
      }
    },

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

      this.fileData = fields
        .slice(1, fields.length)
        .map((item, index) => createSeries(index + 1, item))

      this.range = this.getGlobalRange(data)
      this.updateData(this.fileData)
      this.loading = false
    },

    updateData(data) {
      this.data = [...data, ...this.updateUtils(data)]
    },

    getSeries(
      data = [],
      timeIndex = 0,
      fieldIndex,
      name = '',
      options = {
        type: 'scatter',
        mode: 'lines',
      }
    ) {
      const value = {
        name,
        x: data.map((item) => {
          const x = new Date(item[timeIndex])
          return x
        }),
        y: data.map((item) => {
          return parseFloat(item[fieldIndex])
        }),
      }
      Object.assign(value, options)
      return value
    },

    getGlobalRange(data) {
      return [data[1][0], data[data.length - 2][0]]
    },

    updateUtils(data) {
      return [
        this.createPlank({
          name: 'Вехняя граница',
          x: this.range,
          y: [this.top, this.top],
        }),
        this.createPlank({
          name: 'Нижняя граница',
          x: this.range,
          y: [this.bottom, this.bottom],
        }),
      ]
    },

    click(data) {},
    hover(data) {},
    zoom(data) {
      console.log('zoom')
      console.log(data)
    },
  },
}
</script>
