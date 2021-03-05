import React, { useEffect } from 'react'
import Chart from 'chart.js'

const StackedCountryBarGraph = ({
  id,
  chartTitle,
  chartData,
  axesLabels,
  isStacked = false,
  showsPercentage = false,
  animation = true,
}) => {
  const chartRef = React.createRef()

  const chartConfig = {
    type: 'bar',
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: animation ? 1000 : 0,
      },
      plugins: {
        labels: false,
      },
      title: {
        display: true,
        text: chartTitle,
      },
      tooltips: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (tooltipItem, data) => {
            let label = data.datasets[tooltipItem.datasetIndex].label || ''
            if (label) {
              label += ': '
            }
            label += `${tooltipItem.yLabel.toLocaleString()}${
              showsPercentage ? '%' : ''
            }`
            return label
          },
          footer: (tooltipItems, _data) => {
            const sum = tooltipItems
              .map((element) => element.yLabel)
              .reduce((currentSum, current) => {
                return currentSum + current
              })
            return `Total: ${sum.toLocaleString()}${showsPercentage ? '%' : ''}`
          },
        },
      },
      hover: {
        mode: 'nearest',
        intersect: true,
      },
      scales: {
        xAxes: [
          {
            display: true,
            stacked: isStacked,
            scaleLabel: {
              display: true,
              labelString: axesLabels.x,
            },
          },
        ],
        yAxes: [
          {
            display: true,
            stacked: isStacked,
            type: 'linear',
            scaleLabel: {
              display: true,
              labelString: axesLabels.y,
            },
            ticks: {
              beginAtZero: true,
              callback: (value) =>
                `${value.toLocaleString()}${showsPercentage ? '%' : ''}`,
            },
          },
        ],
      },
    },
  }

  useEffect(() => {
    const myChartRef = chartRef.current.getContext('2d')
    const chart = new Chart(myChartRef, chartConfig)
    return () => chart.destroy()
  }, [chartRef, chartConfig])

  return (
    <div className="col-sm">
      <div className="chart barGraph" id={id}>
        <canvas id={`canvas`} ref={chartRef}></canvas>
      </div>
    </div>
  )
}

export default StackedCountryBarGraph
