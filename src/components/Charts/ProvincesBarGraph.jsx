import React, { useEffect } from 'react'
import Chart from 'chart.js'
import { chartColors } from './chartSettings'

const ProvincesBarGraph = ({ countryName, data, id, }) => {
  const chartRef = React.createRef()

  const confirmedDataArray = []
  const confirmedTodayDataArray = []
  const activeDataArray = []
  const recoveredDataArray = []
  const deathsDataArray = []
  const deathsTodayDataArray = []
  const provinces = []

  data.forEach(element => {
    if (element.province !== 'mainland' && element.province !== countryName) {
      confirmedDataArray.push({ x: element.province, y: element.confirmed })
      confirmedTodayDataArray.push({ x: element.province, y: element.confirmedCasesToday })
      activeDataArray.push({ x: element.province, y: element.active })
      recoveredDataArray.push({ x: element.province, y: element.recovered })
      deathsDataArray.push({ x: element.province, y: element.deaths })
      deathsTodayDataArray.push({ x: element.province, y: element.deathsToday })
      provinces.push(element.province)
    }
  })
  
  const chartConfig = {
    type: 'bar',
    data: {
      labels: provinces,
      datasets: [
        {
          label: 'Confirmed',
          backgroundColor: chartColors.red,
          borderColor: chartColors.red,
          data: confirmedDataArray,
          fill: false,
          hidden: false,
        },
        {
          label: 'Active',
          backgroundColor: chartColors.blue,
          borderColor: chartColors.blue,
          data: activeDataArray,
          fill: false,
          hidden: true,
        },
        {
          label: 'Recovered',
          backgroundColor: chartColors.green,
          borderColor: chartColors.green,
          data: recoveredDataArray,
          fill: false,
          hidden: true,
        },
        {
          label: 'Deaths',
          backgroundColor: chartColors.grey,
          borderColor: chartColors.grey,
          data: deathsDataArray,
          fill: false,
          hidden: false,
        },
        {
          label: 'Confirmed today',
          backgroundColor: chartColors.purple,
          borderColor: chartColors.purple,
          data: confirmedTodayDataArray,
          fill: false,
          hidden: true,
        },
        {
          label: 'Deaths today',
          backgroundColor: chartColors.yellow,
          borderColor: chartColors.yellow,
          data: deathsTodayDataArray,
          fill: false,
          hidden: true,
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
        text: `Cases by each province/state of ${countryName}`
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
            labelString: 'Province/state'
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
    const chart = new Chart(myChartRef, chartConfig);
    return () => chart.destroy()
  }, [chartRef, chartConfig])

  return (
    <div className="col-sm">
      <div className="chart provinces barGraph" id={id}>
        <canvas
          id={`canvas`}
          ref={chartRef}
        ></canvas>
      </div>
    </div>
  )
}

export default ProvincesBarGraph
