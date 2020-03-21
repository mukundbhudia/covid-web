import React, { useEffect } from 'react'
import Chart from 'chart.js'
import 'chartjs-plugin-labels'

const PieChart = ({ data1, data2, id, chartTitle, chartLabel1, chartLabel2, labelColor1, labelColor2 }) => {
  const chartRef = React.createRef()

  const chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
  }

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
