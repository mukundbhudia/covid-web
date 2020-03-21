import React, { useEffect } from 'react'
import Chart from 'chart.js'

const TopXBarGraph = ({ data, id }) => {
  const chartRef = React.createRef()

  const confirmed = data.map(element => ({ x: element.country, y: element.confirmed }))
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
  
  const chartConfig = {
    type: 'bar',
    data: {
      labels: countries,
      datasets: [
        {
          label: 'Confirmed',
          backgroundColor: chartColors.red,
          borderColor: chartColors.red,
          data: confirmed,
          fill: false,
        },
      ]
    },
    options: {
      responsive: true,
      title: {
        display: true,
        text: 'Top 10 confirmed by country'
      },
      tooltips: {
        mode: 'index',
        intersect: false,
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
          // ticks: {
          //   beginAtZero: true,
          // }
        }]
      }
    }
  }

  useEffect(() => {
    const myChartRef = chartRef.current.getContext("2d")

    new Chart(myChartRef, chartConfig);
  }, [chartRef, chartConfig])

  return (
    <div className="container-xl">
      <div id={id}>
        <canvas
          id={`canvas-${id}`}
          ref={chartRef}
        ></canvas>
      </div>
    </div>
  )
}

export default TopXBarGraph
