<template>
  <v-card :loading="loading" flat tile>
    <v-card-title> График </v-card-title>
    <v-card-text v-if="!loading">
      <v-row>
        <v-col cols="2">
          <chart-input label="Вехняя граница" @save="updateTop" />
          <chart-input label="Нижняя граница" @save="updateBottom" />
          <chart-select
            :items="selectedItem"
            @select="selectAverage"
          ></chart-select>
        </v-col>
        <v-col>
          <div v-if="range">
            <div>{{ rangeFile[0] }} - ({{ timeAgo }}) - {{ rangeFile[1] }}</div>
            <div>Min: {{ min }}</div>
            <div>Max: {{ max }}</div>
          </div>

          <chart
            :options="options"
            :range="range"
            :data="data"
            :layout="layout"
            @plot-click="click"
          />
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-file-input
        label="Выбрать файл"
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
    defaultLayout: {
      title: 'Динамические характеристики',
      shapes: [],
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
    traces: [],
    leftIndex: null,
    rightIndex: null,
    isLeft: false,
    selectedItem: [
      {
        text: 'Все',
        value: null,
      },
    ],
    currentItem: 0,
    min: 0,
    max: 0,
    fileData: [],
  }),

  computed: {
    timeAgo() {
      console.log(this.$moment)
      const [left, right] = [
        this.$moment(this.rangeFile[0]),
        this.$moment(this.rangeFile[1]),
      ]
      console.log(left.from(right))
      return left.from(right)
    },

    rangeIndex() {
      if (!this.leftIndex || !this.rightIndex) return false
      if (this.rightIndex < this.leftIndex)
        return [this.rightIndex, this.leftIndex]
      else return [this.leftIndex, this.rightIndex]
    },
    rangeFile() {
      if (!this.leftIndex || !this.rightIndex) return false
      return [
        this.fileData[this.rangeIndex[0]][0],
        this.fileData[this.rangeIndex[1]][0],
      ]
    },
    range() {
      if (!this.leftIndex || !this.rightIndex) return false
      return [Date.parse(this.rangeFile[0]), Date.parse(this.rangeFile[1])]
    },

    left() {
      if (this.leftIndex === null) return false
      // console.log(this.fileData[this.leftIndex][0])
      return Date.parse(this.fileData[this.leftIndex][0])
    },
    right() {
      if (this.rightIndex === null) return false
      console.log(this.rightIndex)
      // console.log(this.fileData[this.rightIndex][0])
      return Date.parse(this.fileData[this.rightIndex][0])
    },

    layout() {
      return {
        ...this.defaultLayout,
      }
    },

    calcAverage() {
      const left = this.rangeIndex[0]
      const right = this.rangeIndex[1]
      let data = []
      if (this.currentItem !== null) {
        const yValues = this.traces[this.currentItem].y
        data = yValues.slice(left, right)
      } else {
        for (const trace of this.traces) {
          data = data.concat(trace.y.slice(left, right))
        }
      }
      const mean = this.$math.mean(data)
      this.calcMinMax(data)
      return mean
    },

    leftLine() {
      return this.createVerticalLine(this.left)
    },
    rightLine() {
      return this.createVerticalLine(this.right)
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
      console.log(this.range)
      return this.createPlank({
        name: `Среднее значение (${this.average.value.toFixed(2)})`,
        visible: this.average.visible,
        x: this.range,
        y: [this.average.value, this.average.value],
        line: {
          dash: 'dot',
          color: 'red',
        },
      })
    },
  },

  watch: {
    // currentItem() {
    //   this.updateAverage()
    // },
    // leftIndex() {
    //   this.updateAverage()
    // },
    // rightIndex() {
    //   this.updateAverage()
    // },
  },

  methods: {
    calcMinMax(data) {
      this.min = this.$math.min(data)
      this.max = this.$math.max(data)
    },

    selectAverage(item) {
      // console.log(item)
      this.currentItem = item
      this.updateAverage()
    },

    click(data) {
      // console.log(data)

      const index = data.points[0].pointIndex

      if (this.isLeft) {
        this.leftIndex = index
      } else {
        this.rightIndex = index
      }
      this.isLeft = !this.isLeft
      this.updateShapes()
    },

    createLine(options) {
      const defaultOptions = {
        xref: 'x',
        yref: 'y',
        line: {
          color: 'red',
          width: 4,
          dash: 'dot',
        },
      }

      return {
        type: 'line',
        ...defaultOptions,
        ...options,
      }
    },

    updateShapes() {
      this.defaultLayout.shapes = [this.leftLine, this.rightLine]
    },

    createVerticalLine(x) {
      return this.createLine({ x0: x, x1: x, yref: 'paper', y0: 0, y1: 1 })
    },

    updateTop(value) {
      // if (value < this.bottom.value) return
      this.top.value = value
      this.top.visible = true
      this.updateData(this.traces)
    },
    updateBottom(value) {
      // if (value > this.top.value) return
      this.bottom.value = value
      this.bottom.visible = true
      this.updateData(this.traces)
    },
    updateAverage() {
      this.average.value = this.calcAverage
      this.average.visible = true
      this.updateData(this.traces)
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
      this.fileData = data

      const fields = data.slice(0, 1)[0].map((item) => item.trim())

      const createSeries = (fieldIndex, name) =>
        this.getSeries(data.slice(1, data.length), 0, fieldIndex, name)

      this.traces = fields
        .slice(1, fields.length)
        .map((item, index) => createSeries(index + 1, item))
      this.range = this.getGlobalRange(data)
      this.selectedItem = [
        ...this.selectedItem,
        ...this.traces.map((item, index) => ({
          value: index,
          text: item.name,
        })),
      ]

      this.leftIndex = 1
      this.rightIndex = this.fileData.length - 2

      this.updateShapes()
      this.updateData(this.traces)

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

    dateRound(value) {
      return Math.round(Date.parse(value) / 1000) * 1000
    },
  },
}
</script>

<style>
* {
  font-size: small;
}
.v-card__title {
  font-size: medium;
}
</style>
