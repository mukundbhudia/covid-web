import React from 'react'

const chartColors = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: '#b0b0b0'
}

const ProgressBar = ({ dataSet }) => {

  const percentageDataSet = dataSet.map((item, i) => {
    const total = dataSet.reduce((count, dataItem) => {
      return count + dataItem.data
    }, 0)
    if (total === 0) {
      return 0
    } else {
      if (i+1 === dataSet.length) {
        item.percentage = Math.ceil((item.data/(total))*100) - 1
      } else {
        item.percentage = Math.ceil((item.data/(total))*100)
      }
      return item
    }
  })

  return (
    <div className="progress">
      {percentageDataSet.map((dataItem, i) => {
        if (dataItem !== 0) {
          return (
            <div
              key={i}
              className="progress-bar"
              role="progressbar"
              style={{width: `${dataItem.percentage}%`, backgroundColor: `${chartColors[dataItem.color]}`}}
              aria-valuenow={dataItem.percentage}
              aria-valuemin="0"
              aria-valuemax="100"
              data-toggle="tooltip" data-placement="top" title={dataItem.label}
            >
              {dataItem.percentage}%
            </div>
          )
        } else {
          return null
        }
      })}
    </div>
  )
}

export default ProgressBar
