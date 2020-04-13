import React, { useState } from 'react'
import HeatMap from './HeatMap'

const HeatMapRangeSlider = ({ dates }) => {
  const timeSeriesLength = dates.length
  const [ value, setValue ] = useState(timeSeriesLength)

  let currentDay = dates[value-1]
  let currentDayAsDate = new Date(currentDay)

  return (
    <>
    <HeatMap date={currentDay} />
    <label>Drag slider to change heatmap date. Currently at: <strong>{currentDayAsDate.toLocaleDateString()}</strong></label>
    <input type="range" className="custom-range" min="1" max={timeSeriesLength} id="heatMapDateSlider" value={value}
      onChange={changeEvent => setValue(changeEvent.target.value)}></input>
    </>
  )
}

export default HeatMapRangeSlider
