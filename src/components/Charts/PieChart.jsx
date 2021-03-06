import React, { useEffect } from 'react'
import Chart from 'chart.js'
import 'chartjs-plugin-labels'
import { chartColors } from './chartSettings'

const PieChart = ({ data1, data2, id, chartTitle, chartLabel1, chartLabel2, labelColor1, labelColor2 }) => {
  const chartRef = React.createRef()

  const chartLabelColor1 = chartColors[labelColor1]
  const chartLabelColor2 = chartColors[labelColor2]

  const chartConfig = {
    type: 'pie',
    data: {
      datasets: [{
        data: [
          data1,
          data2,
        ],
        backgroundColor: [
          chartLabelColor1,
          chartLabelColor2,
        ],
        label: 'Dataset 1'
      }],
      labels: [
        chartLabel1,
        chartLabel2,
      ]
    },
    options: {
      responsive: true,
      plugins: {
        labels: {
          formatter: (value, ctx) => {
            let sum = 0
            let dataArr = ctx.chart.data.datasets[0].data
            dataArr.map(data => sum += data)
            let percentage = (value*100 / sum).toFixed(2)+"%"
            return percentage
          },
          fontColor: '#272727',
        }
      },
    }
  }

  useEffect(() => {
    const myChartRef = chartRef.current.getContext("2d")

    new Chart(myChartRef, chartConfig);
  }, [chartRef, chartConfig])

  return (
    <div className="col-sm">
      <div className="chart" id={id}>
        <canvas
          id={`canvas-${id}`}
          ref={chartRef}
        ></canvas>
      </div>
    </div>
  )
}

export default PieChart
