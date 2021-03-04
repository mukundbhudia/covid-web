import React, { useEffect } from 'react'
import Chart from 'chart.js'

const StackedCountryBarGraph = ({
  id,
  chartTitle,
  chartData,
  isStacked = false,
  showsPercentage = false,
}) => {
  const chartRef = React.createRef()

  const chartConfig = {
    type: 'bar',
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
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
              labelString: 'Country',
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
              labelString: 'Number of cases',
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
      <div className="chart barGraph topx" id={id}>
        <canvas id={`canvas`} ref={chartRef}></canvas>
      </div>
    </div>
  )
}

export default StackedCountryBarGraph
