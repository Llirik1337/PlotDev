<template>
  <v-card :loading="loading">
    <v-card-title>
      График
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="3">
          <n-input label="Вехняя граница" @save="updateTop" />
          <n-input label="Нижняя граница" @save="updateBottom" />
        </v-col>
        <v-col>
          <chart
            v-if="!loading"
            :options="options"
            :range="range"
            :data="data"
            :layout="layout"
            @plot-zoom="zoom"
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
    top: {
      value: 0,
      visible: 'legendonly',
    },
    bottom: {
      value: 0,
      visible: 'legendonly',
    },
    average: {
      value: 0,
      visible: 'legendonly',
    },
    utils: [],
    data: [],
    fileData: [],
    range: [],
  }),

  computed: {
    calcAverage() {
      return 150
    },
    plankTop() {
      return this.createPlank({
        name: 'Вехняя граница',
        visible: this.top.visible,
        x: this.range,
        y: [this.top.value, this.top.value],
      })
    },
    plankBottom() {
      return this.createPlank({
        name: 'Нижняя граница',
        visible: this.bottom.visible,
        x: this.range,
        y: [this.bottom.value, this.bottom.value],
        line: {
          dash: 'dot',
          color: 'red',
        },
      })
    },
    plankAverage() {
      return this.createPlank({
        name: 'Среднее значение',
        visible: this.average.visible,
        x: this.range,
        y: [this.average.value, this.average.value],
        line: {
          dash: 'dot',
          color: 'gray',
        },
      })
    },
  },

  mounted() {},

  methods: {
    updateTop(value) {
      if (value < this.bottom.value) return
      this.top.value = value
      this.top.visible = true
      this.updateData(this.fileData)
    },
    updateBottom(value) {
      if (value > this.top.value) return
      this.bottom.value = value
      this.bottom.visible = true
      this.updateData(this.fileData)
    },
    updateAverage() {
      this.average.value = this.calcAverage
      this.average.visible = true
      this.updateData(this.fileData)
    },

    createPlank(options) {
      const defaultOptions = {
        type: 'scatter',
        name: 'Линия',
        x: [],
        y: [],
        mode: 'lines',
        visible: 'legendonly',
        showlegend: true,
        line: {
          color: 'red',
          width: 2,
          dash: 'dash',
        },
      }
      return { ...defaultOptions, ...options }
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
      this.data = [...data, this.plankBottom, this.plankTop, this.plankAverage]
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

    // updateUtils(data) {
    //   // console.log(this.range)
    //   // const top = this.createPlank({
    //   //   name: 'Вехняя граница',
    //   //   visible: this.top.visible,
    //   //   x: this.range,
    //   //   y: [this.top, this.top],
    //   // })
    //
    //   const bottom = this.createPlank({
    //     name: 'Нижняя граница',
    //     visible: this.bottom.visible,
    //     x: this.range,
    //     y: [this.bottom, this.bottom],
    //     line: {
    //       dash: 'dot',
    //     },
    //   })
    //
    //   const average = this.createPlank({
    //     name: 'Среднее значение',
    //     visible: this.average.visible,
    //     x: this.range,
    //     y: [this.average.value, this.average.value],
    //     line: {
    //       dash: 'dot',
    //     },
    //   })
    //
    //   // console.log(top)
    //
    //   return [top, bottom, average]
    // },

    dateRound(value) {
      return Math.round(Date.parse(value) / 1000) * 1000
    },

    zoom(data) {
      console.log(data)
      this.range = [
        this.dateRound(data['xaxis.range[0]']),
        this.dateRound(data['xaxis.range[1]']),
      ]
      console.log(this.range)
      this.average.value = this.calcAverage
      console.log(this.range)
    },
  },
}
</script>
