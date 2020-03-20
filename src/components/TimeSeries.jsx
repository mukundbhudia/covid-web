import React, { useEffect } from 'react'
import Chart from 'chart.js'

const TimeSeries = ({lastUpdated, globalTimeSeries}) => {
  const chartRef = React.createRef()

  const lastUpdatedTimeStamp = (new Date(parseInt(lastUpdated))).toLocaleString()
  const allDates = []
  const confirmed = []
  const recovered = []
  const deaths = []
  const active = []

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
    type: 'line',
    data: {
      labels: allDates,
      datasets: [
        {
        label: 'Confirmed',
        backgroundColor: chartColors.red,
        borderColor: chartColors.red,
        data: confirmed,
        fill: false,
      }, 
      {
        label: 'Active',
        fill: false,
        backgroundColor: chartColors.blue,
        borderColor: chartColors.blue,
        data: active,
      }, 
      {
        label: 'Recovered',
        fill: false,
        backgroundColor: chartColors.green,
        borderColor: chartColors.green,
        data: recovered,
      }, 
      {
        label: 'Deaths',
        fill: false,
        backgroundColor: chartColors.grey,
        borderColor: chartColors.grey,
        data: deaths,
      }
    ]
    },
    options: {
      responsive: true,
      title: {
        display: true,
        text: 'Covid-19 cases by day'
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
            labelString: 'Date'
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
            callback: function(value, index, values) {
                return value.toLocaleString()
            }
          }
        }]
      }
    }
  }

  useEffect(() => {
    const myChartRef = chartRef.current.getContext("2d")

    new Chart(myChartRef, chartConfig);
  }, [chartRef, chartConfig])
  
  globalTimeSeries.forEach(element => {
    const dateFromString = new Date(element.day)
    allDates.push((dateFromString).toLocaleDateString())
    confirmed.push({x: dateFromString, y: element.confirmed})
    recovered.push({x: dateFromString, y: element.recovered})
    deaths.push({x: dateFromString, y: element.deaths})
    active.push({x: dateFromString, y: element.active})
  })
  
  return (
    <div className="container-xl">
      <div id="chart">
        <canvas
          id="canvas"
          ref={chartRef}
        ></canvas>
      </div>
      <p className="lastUpdatedTimeStamp">Data last updated: <span id="lastUpdated">{lastUpdatedTimeStamp}</span></p>
      <button type="button" className="btn btn-sm btn-primary mr-1" id="changeScale">View logarithmic</button>
      <button type="button" className="btn btn-sm btn-primary mr-1" id="changeChartType">View bar chart</button>
      <button type="button" className="btn btn-sm btn-secondary mr-1" id="toggleCurrentCases">Add current cases</button>
      <br />
      <br/>
    </div>
  )
}

export default TimeSeries
