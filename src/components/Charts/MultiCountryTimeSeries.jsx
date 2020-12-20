import React, { useEffect, useState } from 'react'
import Chart from 'chart.js'
import { movingAverage } from '../../modules/numeric'
import { multiChartColours } from './chartSettings'

const DEFAULT_MOVING_AVERAGE_PERIOD_IN_DAYS = 7
const dataSetColours = Object.keys(multiChartColours)

const TimeSeries = ({ chartTitle, casesToHide, data, currentCases }) => {

  const chartRef = React.createRef()
  const [ dataType, setDataType] = useState('linear')
  const [ chartType, setChartType] = useState('line')
  const [ movingAveragePeriod, setMovingAveragePeriod] = useState(DEFAULT_MOVING_AVERAGE_PERIOD_IN_DAYS)

  const allDates = []

  let processedCountryData = []

  data.forEach((countryData, j) => {
    let confirmed = []
    let confirmedToday = []
    let deaths = []
    let deathsToday = []

    const pushDataToCasesArray = (date, caseToPush) => {
      confirmed.push({x: date, y: caseToPush.confirmed})
      deaths.push({x: date, y: caseToPush.deaths})
      confirmedToday.push({x: date, y: caseToPush.confirmedCasesToday})
      deathsToday.push({x: date, y: caseToPush.deathsToday})
    }

    countryData.casesByDate.forEach((cases) => {     
      const dateFromString = new Date(cases.day)
      if (allDates.length < countryData.casesByDate.length) {
        allDates.push((dateFromString).toLocaleDateString())
      }     
      pushDataToCasesArray(dateFromString, cases)
    })
  
    const confirmedTodayArray = countryData.casesByDate.map((element) => {
      return element.confirmedCasesToday
    })
  
    const deathsTodayArray = countryData.casesByDate.map((element) => {
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

    processedCountryData.push({
      country: countryData.country,
      confirmed,
      confirmedToday,
      deaths,
      deathsToday,
      movingAverageConfirmedTodayChartData,
      movingAverageDeathsTodayChartData,
      dataSetColour: multiChartColours[dataSetColours[j]]
    })
  })

  const generateDataSets = (countryData) => {
    let outputDataSet = []
    countryData.forEach((country) => {    
      outputDataSet.push(
        {
          type: chartType,
          label: `Cumulative confirmed cases ${country.country}`,
          fill: false,
          backgroundColor: country.dataSetColour,
          borderColor: country.dataSetColour,
          order: 0,
          data: country.confirmed,
          hidden: casesToHide['confirmed'],
        },
        {
          type : chartType,
          label: `Cumulative deaths ${country.country}`,
          fill: false,
          backgroundColor: country.dataSetColour,
          borderColor: country.dataSetColour,
          order: 1,
          data: country.deaths,
          hidden: casesToHide['deaths'],
        },
        // {
        //   type : 'bar',
        //   label: `Daily confirmed cases ${country.country}`,
        //   fill: false,
        //   backgroundColor: countryColours[country.country],
        //   borderColor: countryColours[country.country],
        //   order: 3,
        //   data: country.confirmedToday,
        //   hidden: casesToHide['confirmedToday'],
        // },
        {
          type : 'line',
          label: `Daily confirmed ${movingAveragePeriod} day moving average ${country.country}`,
          fill: false,
          backgroundColor: country.dataSetColour,
          borderColor: country.dataSetColour,
          order: 2,
          data: country.movingAverageConfirmedTodayChartData.slice(3, -3),
          hidden: casesToHide['confirmedTodayMovingAverage'],
        },
        // {
        //   type : 'bar',
        //   label: `Daily deaths ${country.country}`,
        //   fill: false,
        //   backgroundColor: chartColors.yellow,
        //   borderColor: chartColors.yellow,
        //   order: 5,
        //   data: country.deathsToday,
        //   hidden: casesToHide['deathsToday'],
        // },
        {
          type : 'line',
          label: `Daily deaths ${movingAveragePeriod} day moving average ${country.country}`,
          fill: false,
          backgroundColor: country.dataSetColour,
          borderColor: country.dataSetColour,
          order: 4,
          data: country.movingAverageDeathsTodayChartData.slice(3, -3),
          hidden: casesToHide['deathsTodayMovingAverage'],
        },
      )
    })
    return outputDataSet
  }

  const chartConfig = {
    type: chartType,
    data: {
      labels: allDates,
      datasets: generateDataSets(processedCountryData)
    },
    options: {
      legend: {
        display: false,
        position: 'bottom'
      },
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
        mode: 'nearest',
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
