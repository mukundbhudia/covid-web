import React from 'react'
import { chartColors } from './chartSettings'
import { getPercentageFromDataSet } from '../../modules/numeric'

const ProgressBar = ({ dataSet }) => {

  const percentageDataSet = getPercentageFromDataSet(dataSet)

  return (
    <div className="progress">
      {percentageDataSet.map((dataItem, i) => {
        if (dataItem.percentage > 0) {
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
