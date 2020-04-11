import React, { useState } from 'react'
import WorldHeatMap from './WorldHeatMap'

const HeatMapRangeSlider = ({ data }) => {
  const timeSeriesLength = data.length
  const [ value, setValue ] = useState(timeSeriesLength)

  let currentDay = new Date(data[value-1].day)
  let currentCases = data[value-1]
// console.log(currentCases, timeSeriesLength)

  return (
    <>
    {/* <WorldHeatMap mapDataLabel="Confirmed" caseType="confirmed" data={currentCases} lightColour="#fee0d2" darkColour="#de2d26"/> */}
    <label>Drag slider to change heatmap date. Currently at: <strong>{currentDay.toLocaleDateString()}</strong></label>
    <input type="range" className="custom-range" min="1" max={timeSeriesLength} id="heatMapDateSlider" value={value}
      onChange={changeEvent => setValue(changeEvent.target.value)}></input>
    </>
  )
}

export default HeatMapRangeSlider
