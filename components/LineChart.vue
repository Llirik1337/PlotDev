<script>
import { Line } from 'vue-chartjs'
import crosshair from 'chartjs-plugin-crosshair'
export default {
  extends: Line,
  props: ['data', 'options'],

  mounted() {
    this.addPlugin({
      id: 'crosshair',
      ...crosshair,
    })
    const options = Object.assign(this.options, {
      tooltips: {
        mode: 'interpolate',
        intersect: false,
      },
    })
    this.renderChart(this.data, options)
  },
}
</script>
