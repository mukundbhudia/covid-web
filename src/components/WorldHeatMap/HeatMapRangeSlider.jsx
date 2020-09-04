import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'

import ErrorInnerPage from '../InnerPages/ErrorInnerPage'
import WorldHeatMap from './WorldHeatMap'
import { getGlobalCasesGivenDate } from '../../modules/queries'

const clamp = (number, min, max) => {
  return Math.min(Math.max(number, min), max)
}

let datesVisited = []

const HeatMapRangeSlider = ({ dates }) => {
  const timeSeriesLength = dates.length
  const [ sliderValue, setSliderValue ] = useState(timeSeriesLength)

  datesVisited[sliderValue] = true

  let currentDay = dates[sliderValue-1]
  let currentDayAsDate = new Date(currentDay)
  const { loading, error, data, client } = useQuery(getGlobalCasesGivenDate, {
    variables: { day: currentDay },
  })

  const prefetchLastFewDays = (sliderValueToPrefetch) => {
    sliderValueToPrefetch = parseInt(sliderValueToPrefetch)
    const MAX_TO_PREFETCH = 5

    let rangeBefore = clamp(sliderValueToPrefetch - MAX_TO_PREFETCH, 0, timeSeriesLength)
    let rangeAfter = clamp(sliderValueToPrefetch + MAX_TO_PREFETCH, 0, timeSeriesLength)

    for (let i = rangeBefore; i < rangeAfter; i++) {
      const dateVisited = datesVisited[i]
      if (!dateVisited) {
        let dayToQuery = dates[i]
        client.query({
          query: getGlobalCasesGivenDate,
          variables: { day: dayToQuery }
        })
        datesVisited[i] = true
      }
    }
  }

  const moveSlider = (newSliderValue) => {
    setSliderValue(newSliderValue)
    prefetchLastFewDays(newSliderValue)
  }

  let content
  if (loading) {
    content = (
      <WorldHeatMap mapDataLabel="Confirmed"
        showMoreThanOneDataItem={true}
        caseType="confirmed"
        data={[]}
        date={""}
        lightColour="#ffeaef"
        darkColour="#ff6384"
      />
    )
  } else if (error) {
    content = (<ErrorInnerPage errorData={error} />)
  } else {
    const getGlobalCasesByDate = data.getGlobalCasesByDate
    content = (
      <WorldHeatMap mapDataLabel="Confirmed"
        showMoreThanOneDataItem={true}
        caseType="confirmed"
        data={getGlobalCasesByDate}
        date={currentDay}
        lightColour="#ffeaef"
        darkColour="#ff6384"
      />
    )
  }

  return (
    <>
    <div className="card bg-light mb-3">
      <div className="card-body pt-0">
        {content}
        <div className="heatmapSliderHeader d-flex justify-content-end">
          <span>Confirmed cases on <strong>{currentDayAsDate.toLocaleDateString()}</strong></span>
        </div>
        <div className="heatmapSliderControls" style={ {display: "none"} }> 
          <input type="range"
            className="custom-range"
            min="1"
            max={timeSeriesLength}
            id="heatMapDateSlider"
            value={sliderValue}
            onMouseOver={() => {prefetchLastFewDays(sliderValue)}}
            onChange={changeEvent => { moveSlider(changeEvent.target.value) }}
            disabled
          >
          </input>
        </div>
      </div>
    </div>
    </>
  )
}

export default HeatMapRangeSlider
