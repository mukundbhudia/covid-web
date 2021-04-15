import React, { useEffect } from 'react'
import Chart from 'chart.js/auto'

const RadarChart = ({
  id,
  chartTitle,
  chartData,
  showsPercentage = false,
  animation = true,
}) => {
  const chartRef = React.createRef()

  const percentageString = showsPercentage ? '%' : ''

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
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: animation ? 1000 : 0,
      },
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: chartTitle,
      },
      tooltips: {
        mode: 'index',
        intersect: true,
        callbacks: {
          title: (tooltipItems, data) => {
            const xAxesLabel = data.labels[tooltipItems[0].index]
            return xAxesLabel
          },
          label: (tooltipItem, data) => {
            let label = data.datasets[tooltipItem.datasetIndex].label || ''
            if (label) {
              label += ': '
            }
            label += `${tooltipItem.yLabel.toLocaleString()}${percentageString}`
            return label
          },
          footer: (tooltipItems, _data) => {
            if (tooltipItems.length > 1) {
              const total = tooltipItems
                .map((element) => element.yLabel)
                .reduce((currentSum, current) => {
                  return currentSum + current
                })
              return `Total: ${total.toLocaleString()}${percentageString}`
            }
          },
        },
        footerFontStyle: 'normal',
      },
      scale: {
        ticks: {
          beginAtZero: true,
          callback: (value) => `${value.toLocaleString()}${percentageString}`,
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
