import React, { useEffect, useState } from 'react'
import Chart from 'chart.js'
import { movingAverage } from '../../modules/numeric'

const TimeSeries = ({ chartTitle, casesToHide, data, currentCases }) => {
  const chartRef = React.createRef()
  const [ dataType, setDataType] = useState('linear')
  const [ chartType, setChartType] = useState('line')
  const [ movingAveragePeriod, setMovingAveragePeriod] = useState(7)

  const allDates = []
  let confirmed = []
  let confirmedToday = []
  let deaths = []
  let deathsToday = []

  const chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    darkPurple: 'rgb(102, 68, 170)',
    grey: 'rgb(201, 203, 207)',
    darkGrey: 'rgb(160, 161, 164)',
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
        allDates.push((dateFromString).toLocaleDateString())
        confirmed.push({x: dateFromString, y: previousCase.confirmed})
        deaths.push({x: dateFromString, y: previousCase.deaths})
        confirmedToday.push({x: dateFromString, y: previousCase.confirmedCasesToday})
        deathsToday.push({x: dateFromString, y: previousCase.deathsToday})
      } else {
        allDates.push((dateFromString).toLocaleDateString())
        confirmed.push({x: dateFromString, y: cases.confirmed})
        deaths.push({x: dateFromString, y: cases.deaths})
        confirmedToday.push({x: dateFromString, y: cases.confirmedCasesToday})
        deathsToday.push({x: dateFromString, y: cases.deathsToday})       
      }
    }
  })

  const today = new Date()
  allDates.push((today).toLocaleDateString())
  confirmed.push({x: today, y: currentCases.confirmed})
  deaths.push({x: today, y: currentCases.deaths})
  confirmedToday.push({x: today, y: currentCases.confirmedCasesToday})
  deathsToday.push({x: today, y: currentCases.deathsToday})

  const confirmedTodayArray = data.map((element, i) => {
    return element.confirmedCasesToday
  })

  const deathsTodayArray = data.map((element, i) => {
    return element.deathsToday
  })

  const movingAverageConfirmedToday = movingAverage(confirmedTodayArray, movingAveragePeriod)
  const movingAverageDeathsToday = movingAverage(deathsTodayArray, movingAveragePeriod)

  const movingAverageConfirmedTodayChartData = allDates.map((element, i) => {
    const date = new Date(element)
    const average = movingAverageConfirmedToday[i]
    return { x: date, y: average }
  })

  const movingAverageDeathsTodayChartData = allDates.map((element, i) => {
    const date = new Date(element)
    const average = movingAverageDeathsToday[i]
    return { x: date, y: average }
  })
  

  const chartConfig = {
    type: chartType,
    data: {
      labels: allDates,
      datasets: [
        {
          type: chartType,
          label: 'Cumulative confirmed cases',
          fill: false,
          backgroundColor: chartColors.red,
          borderColor: chartColors.red,
          order: 0,
          data: confirmed,
          hidden: casesToHide['confirmed'],
        },
        {
          type : chartType,
          label: 'Cumulative deaths',
          fill: false,
          backgroundColor: chartColors.grey,
          borderColor: chartColors.grey,
          order: 1,
          data: deaths,
          hidden: casesToHide['deaths'],
        },
        {
          type : 'bar',
          label: 'Daily confirmed cases',
          fill: false,
          backgroundColor: chartColors.purple,
          borderColor: chartColors.purple,
          order: 3,
          data: confirmedToday,
          hidden: casesToHide['confirmedToday'],
        },
        {
          type : 'line',
          label: `Daily confirmed ${movingAveragePeriod} day moving average`,
          fill: false,
          backgroundColor: chartColors.darkPurple,
          borderColor: chartColors.darkPurple,
          order: 2,
          data: movingAverageConfirmedTodayChartData.slice(3, -3),
          hidden: casesToHide['confirmedTodayMovingAverage'],
        },
        {
          type : 'bar',
          label: 'Daily deaths',
          fill: false,
          backgroundColor: chartColors.yellow,
          borderColor: chartColors.yellow,
          order: 5,
          data: deathsToday,
          hidden: casesToHide['deathsToday'],
        },
        {
          type : 'line',
          label: `Daily deaths ${movingAveragePeriod} day moving average`,
          fill: false,
          backgroundColor: chartColors.darkGrey,
          borderColor: chartColors.darkGrey,
          order: 4,
          data: movingAverageDeathsTodayChartData.slice(3, -3),
          hidden: casesToHide['deathsTodayMovingAverage'],
        },
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 0
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
      elements: {
        point: {
            radius: 0
        }
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
          },
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
    const chart = new Chart(myChartRef, chartConfig)
    return () => chart.destroy()
  }, [chartRef, chartConfig])
  
  return (
    <>
    <div className="chart timeSeries">
      <canvas
        className="canvas"
        ref={chartRef}
      ></canvas>
    </div>

    <div className="btn-toolbar justify-content-end" role="toolbar" aria-label="Toolbar with button groups">
      <div className="btn-group btn-group-toggle mr-1" data-tip={`Moving average period in days (${movingAveragePeriod})`}>
        <input
          type="range"
          className="movingAverage custom-range"
          min="1"
          max={30}
          id="movingAverageSlider"
          value={movingAveragePeriod}
          onChange={changeEvent => { setMovingAveragePeriod(changeEvent.target.value) }}>
        </input>
      </div>
      <div className="btn-group btn-group-toggle mr-1" data-toggle="buttons">
        <label className={`btn btn-sm btn-light ${dataType === 'linear' ? 'active' : ''}`}>
          <input type="radio" name="data-type" onClick={() => {
            setDataType('linear')
          }} /> Linear
        </label>
        <label className={`btn btn-sm btn-light ${dataType === 'logarithmic' ? 'active' : ''}`}>
          <input type="radio" name="data-type" onClick={() => {
            setDataType('logarithmic')
          }}/> Logarithmic
        </label>
      </div>
      <div className="btn-group btn-group-toggle mr-1" data-toggle="buttons">
        <label className={`btn btn-sm btn-light ${chartType === 'line' ? 'active' : ''}`}>
          <input type="radio" name="chart-type" onClick={() => {setChartType('line')}}/> Line
        </label>
        <label className={`btn btn-sm btn-light ${chartType === 'bar' ? 'active' : ''}`}>
          <input type="radio" name="chart-type" onClick={() => {setChartType('bar')}}/> Bar
        </label>
      </div>
    </div>
    </>
  )
}

export default TimeSeries
