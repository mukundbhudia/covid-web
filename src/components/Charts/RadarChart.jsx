import React, { useEffect } from 'react'
import Chart from 'chart.js'

const RadarChart = ({ id, chartTitle, chartData, showsPercentage = false }) => {
  const chartRef = React.createRef()

  chartData.datasets = chartData.datasets.map((dataset) => {
    const mainColour = dataset.mainColor
    dataset.backgroundColor = Chart.helpers
      .color(mainColour)
      .alpha(0.2)
      .rgbString()
    dataset.borderColor = mainColour
    dataset.pointBackgroundColor = mainColour
    return dataset
  })
  const chartConfig = {
    type: 'radar',
    data: chartData,
    options: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: chartTitle,
      },
      tooltips: {
        mode: 'index',
        // intersect: false,
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
        },
      },
      scale: {
        ticks: {
          beginAtZero: true,
          callback: (value) =>
            `${value.toLocaleString()}${showsPercentage ? '%' : ''}`,
        },
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
      <div className="chart radarChart" id={id}>
        <canvas id={`canvas`} ref={chartRef}></canvas>
      </div>
    </div>
  )
}

export default RadarChart
