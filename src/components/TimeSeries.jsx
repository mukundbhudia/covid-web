import React, { useEffect, useState } from 'react'
import Chart from 'chart.js'

const TimeSeries = ({ lastUpdated, data, currentCases }) => {
  const chartRef = React.createRef()
  const [ dataType, setDataType ] = useState('linear')
  const [ chartType, setChartType ] = useState('line')

  const allDates = []
  let confirmed = []
  let confirmedToday = []
  // const recovered = []
  let deaths = []
  let deathsToday = []
  // const active = []
  let firstConfirmedCase = null

  const chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
  }

  let firstCaseAdded = false
  data.forEach((element, i) => {
    const cases = element
    if (cases.confirmed > 0) {
      const dateFromString = new Date(cases.day)
      if (!firstCaseAdded && i > 0) {
        const previousCase = data[i-1]        
        const dateFromString = new Date(previousCase.day)
        firstCaseAdded = true
        firstConfirmedCase = cases
        allDates.push((dateFromString).toLocaleDateString())
        confirmed.push({x: dateFromString, y: previousCase.confirmed})
        // recovered.push({x: dateFromString, y: previousCase.recovered})
        deaths.push({x: dateFromString, y: previousCase.deaths})
        // active.push({x: dateFromString, y: previousCase.active})
        confirmedToday.push({x: dateFromString, y: previousCase.confirmedCasesToday})
        deathsToday.push({x: dateFromString, y: previousCase.deathsToday})
      } else {
        allDates.push((dateFromString).toLocaleDateString())
        confirmed.push({x: dateFromString, y: cases.confirmed})
        // recovered.push({x: dateFromString, y: cases.recovered})
        deaths.push({x: dateFromString, y: cases.deaths})
        // active.push({x: dateFromString, y: cases.active})   
        confirmedToday.push({x: dateFromString, y: cases.confirmedCasesToday})
        deathsToday.push({x: dateFromString, y: cases.deathsToday})       
      }
    }
  })

  const today = new Date()
  allDates.push((today).toLocaleDateString())
  confirmed.push({x: today, y: currentCases.confirmed})
  // recovered.push({x: today, y: currentCases.recovered})
  deaths.push({x: today, y: currentCases.deaths})
  // active.push({x: today, y: currentCases.active})   
  confirmedToday.push({x: today, y: currentCases.confirmedCasesToday})
  deathsToday.push({x: today, y: currentCases.deathsToday}) 
  
  const chartConfig = {
    type: chartType,
    data: {
      labels: allDates,
      datasets: [
        {
          type: 'line',
          label: 'Confirmed',
          fill: false,
          backgroundColor: chartColors.red,
          borderColor: chartColors.red,
          data: confirmed,
        },
        // {
        //   label: 'Active',
        //   fill: false,
        //   backgroundColor: chartColors.blue,
        //   borderColor: chartColors.blue,
        //   data: active,
        // }, 
        // {
        //   label: 'Recovered',
        //   fill: false,
        //   backgroundColor: chartColors.green,
        //   borderColor: chartColors.green,
        //   data: recovered,
        // }, 
        {
          type : 'line',
          label: 'Deaths',
          fill: false,
          backgroundColor: chartColors.grey,
          borderColor: chartColors.grey,
          data: deaths,
        },
        {
          type : 'bar',
          label: 'New confirmed cases',
          fill: false,
          backgroundColor: chartColors.purple,
          borderColor: chartColors.purple,
          data: confirmedToday,
        },
        {
          type : 'bar',
          label: 'New deaths',
          fill: false,
          backgroundColor: chartColors.yellow,
          borderColor: chartColors.yellow,
          data: deathsToday,
        },
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
          type: dataType,
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
    // console.log('Rendering again!')

    new Chart(myChartRef, chartConfig);
  }, [chartRef, chartConfig])
  
  return (
    <div className="">
      <div className="chart">
        <canvas
          className="canvas"
          ref={chartRef}
        ></canvas>
      </div>

      {/* <div className="btn-group btn-group-toggle mr-1" data-toggle="buttons">
        <label className={`btn btn-sm btn-secondary ${dataType === 'linear' ? 'active' : ''}`}>
          <input type="radio" name="data-type" onClick={() => {
            setDataType('linear')
            chartRef.current.options.scales.yAxes[0].type = 'linear'
          }} /> Linear
        </label>
        <label className={`btn btn-sm btn-secondary ${dataType === 'logarithmic' ? 'active' : ''}`}>
          <input type="radio" name="data-type" onClick={() => {
            setDataType('logarithmic')
            chartRef.current.options.scales.yAxes[0].type = 'logarithmic'
          }}/> Logarithmic
        </label>
      </div>
      <div className="btn-group btn-group-toggle mr-1" data-toggle="buttons">
        <label className={`btn btn-sm btn-secondary ${chartType === 'line' ? 'active' : ''}`}>
          <input type="radio" name="chart-type" onClick={() => {setChartType('line')}}/> Line
        </label>
        <label className={`btn btn-sm btn-secondary ${chartType === 'bar' ? 'active' : ''}`}>
          <input type="radio" name="chart-type" onClick={() => {setChartType('bar')}}/> Bar
        </label>
      </div>

      <button type="button" className="btn btn-sm btn-primary" id="toggleCurrentCases">Add current cases</button>
      <br />
      <br/> */}
    </div>
  )
}

export default TimeSeries
