import React from 'react'

const chartColors = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(201, 203, 207)'
}

const calcPercentageFromTwoInts = (int1, int2) => {
  const percentage1 = Math.floor( (int1/(int1 +int2))*100 )
  const percentage2 = 100 - percentage1
  return {
    percentage1: percentage1,
    percentage2: percentage2,
  }
}

const ProgressBar = ({ data1, data2, id, chartTitle, chartLabel1, chartLabel2, labelColor1, labelColor2 }) => {
  const percentages = calcPercentageFromTwoInts(data1, data2)
  return (
    <div className="progress">
      <div
        className="progress-bar"
        role="progressbar"
        style={{width: `${percentages.percentage1}%`, backgroundColor: `${chartColors['green']}`}}
        aria-valuenow={percentages.percentage1}
        aria-valuemin="0"
        aria-valuemax="100"
        data-toggle="tooltip" data-placement="top" title={data1}
      >{percentages.percentage1}%</div>
      <div
        className="progress-bar"
        role="progressbar"
        style={{width: `${percentages.percentage2}%`, backgroundColor: `${chartColors['grey']}`}}
        aria-valuenow={percentages.percentage2}
        aria-valuemin="0"
        aria-valuemax="100"
        data-toggle="tooltip" data-placement="top" title={data1}
      >{percentages.percentage2}%</div>
    </div>
  )
}

export default ProgressBar
