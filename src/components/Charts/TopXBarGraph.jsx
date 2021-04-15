import React, { useEffect } from 'react'
import Chart from 'chart.js/auto'
import { chartColors } from './chartSettings'

const TopXBarGraph = ({
  data,
  id,
  chartTitle,
  chartLabel,
  chartLabelKey,
  labelColor,
}) => {
  const chartRef = React.createRef()

  const dataArray = data.map((element) => ({
    x: element.country,
    y: element[chartLabelKey],
  }))
  const countries = data.map((element) => element.country)

  const chartLabelColor = chartColors[labelColor]

  const chartConfig = {
    type: 'bar',
    data: {
      labels: countries,
      datasets: [
        {
          label: chartLabel,
          backgroundColor: chartLabelColor,
          borderColor: chartLabelColor,
          data: dataArray,
          fill: false,
        },
      ],
    },
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
            label += tooltipItem.yLabel.toLocaleString()
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
            scaleLabel: {
              display: true,
              labelString: 'Country',
            },
          },
        ],
        yAxes: [
          {
            display: true,
            type: 'linear',
            scaleLabel: {
              display: true,
              labelString: 'Number of cases',
            },
            ticks: {
              beginAtZero: true,
              callback: (value) => value.toLocaleString(),
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

export default TopXBarGraph
