<template>
  <v-card :loading="loading">
    <v-card-title>
      График
    </v-card-title>
    <v-card-text>
      <line-chart v-if="!loading" :data="data" :options="options" />
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
    data: [],
    options: {},
    loading: true,
  }),

  methods: {
    upload(file) {
      if (file)
        Papa.parse(file, {
          complete: this.correctData,
        })
      else this.loading = true
    },
    getRandomColor() {
      const letters = '0123456789ABCDEF'
      let color = '#'
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
      }
      return color
    },
    correctData(result) {
      const { data: fileData } = result
      console.log(fileData)
      const datasetsData = fileData.map((item) => [
        ...item.slice(1, item.length),
      ])
      console.log(datasetsData)

      const datasets = datasetsData[0].map((item, key) => {
        const data = datasetsData
          .slice(1, fileData.length)
          .map((item, index) => item[key])
        return {
          label: item,
          fill: false,
          backgroundColor: this.getRandomColor(),
          data,
        }
      })
      console.log(JSON.stringify(datasets))

      const data = {
        labels: [
          ...fileData.slice(1, fileData.length).map((item) => {
            return item[0]
          }),
        ],
        datasets,
      }
      console.log(data)
      this.data = data
      this.loading = false
    },
  },
}
</script>
