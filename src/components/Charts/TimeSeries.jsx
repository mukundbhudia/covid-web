import React, { useEffect, useState } from 'react'
import Chart from 'chart.js'

const isNumeric = subject => typeof subject === 'number'

/**
 * Moving average
 * --------------
 * Courtesy of `kaelzhang`_, under MIT License.
 *
 * .. _kaelzhang: https://github.com/kaelzhang/moving-averages
 *
 * With alterations and optimisation by Pouria Hadjibagheri.
 *
 * @param data { Array<number> } Array of numbers
 * @param size { number } Size of the moving window
 * @returns { Array<number> } Array of moving averages
 */
const movingAverage = ( data, size ) => {
  const
      length = data.length,
      prepare = size - 1,
      ret = Array(length).fill(NaN);

  let
      sum = 0,
      i = 0,
      counter = 0,
      datum;

  for ( ; i < length && counter < prepare; i++ ) {
      datum = data[i]

      if ( isNumeric(datum) ) {
          sum += datum;
          counter++
      }
  }

  for ( ; i < length; i++ ) {
      datum = data[i]

      if ( isNumeric(datum) )
          sum += datum;

      if ( isNumeric(data[i - size]) )
          sum -= data[i - size];

      ret[i] = sum / size
  }
  return ret.slice(size - 1)
}

const TimeSeries = ({ chartTitle, casesToHide, data, currentCases }) => {
  const chartRef = React.createRef()
  const [ dataType, setDataType] = useState('linear')
  const [ chartType, setChartType] = useState('line')

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

  const movingAverageConfirmedToday = movingAverage(confirmedTodayArray, 7)
  const movingAverageDeathsToday = movingAverage(deathsTodayArray, 7)

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
          label: 'Daily confirmed 7 day moving average',
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
          label: 'Daily deaths 7 day moving average',
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
          ticks: {
            maxTicksLimit: 25,
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
