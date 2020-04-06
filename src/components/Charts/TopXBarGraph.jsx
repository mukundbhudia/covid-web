import React, { useEffect } from 'react'
import Chart from 'chart.js'

const TopXBarGraph = ({ data, id, chartTitle, chartLabel, chartLabelKey, labelColor }) => {
  const chartRef = React.createRef()

  const dataArray = data.map(element => ({ x: element.country, y: element[chartLabelKey] }))
  const countries = data.map(element => element.country)

  const chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
  }

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
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        labels: false
      },
      title: {
        display: true,
        text: chartTitle
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
        intersect: true
      },
      scales: {
        xAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Country'
          }
        }],
        yAxes: [{
          display: true,
          type: 'linear',
          scaleLabel: {
            display: true,
            labelString: 'Number of cases'
          },
          ticks: {
            beginAtZero: true,
            callback: value => value.toLocaleString()
          }
        }]
      }
    }
  }

  useEffect(() => {
    const myChartRef = chartRef.current.getContext("2d")

    new Chart(myChartRef, chartConfig);
  }, [chartRef, chartConfig])

  return (
    <div className="col-sm">
      <div className="chart topXbarGraph" id={id}>
        <canvas
          id={`canvas`}
          ref={chartRef}
        ></canvas>
      </div>
    </div>
  )
}

export default TopXBarGraph
