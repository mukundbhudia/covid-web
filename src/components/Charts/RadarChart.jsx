import React, { useEffect } from 'react'
import Chart from 'chart.js'
import { chartColors } from './chartSettings'

const RadarChart = ({
  data,
  id,
  chartTitle,
  chartLabel,
  chartLabelKey,
  labelColor,
}) => {
  const chartRef = React.createRef()

  const chartLabelColor = chartColors[labelColor]

  const chartConfig = {
    type: 'radar',
    data: {
      labels: Array.from(data.keys()),
      datasets: [
        {
          label: 'Total vaccinations',
          backgroundColor: Chart.helpers
            .color(chartLabelColor)
            .alpha(0.2)
            .rgbString(),
          borderColor: chartLabelColor,
          pointBackgroundColor: chartLabelColor,
          data: Array.from(data.values()).map((item) => item.totalVaccinations),
        },
        {
          label: 'People fully vaccinated',
          backgroundColor: Chart.helpers
            .color(chartColors['blue'])
            .alpha(0.2)
            .rgbString(),
          borderColor: chartColors['blue'],
          pointBackgroundColor: chartColors['blue'],
          data: Array.from(data.values()).map(
            (item) => item.peopleFullyVaccinated
          ),
        },
      ],
    },
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
            label += tooltipItem.yLabel.toLocaleString()
            return label
          },
        },
      },
      scale: {
        ticks: {
          beginAtZero: true,
          callback: (value) => value.toLocaleString(),
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
