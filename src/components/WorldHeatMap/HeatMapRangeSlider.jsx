import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'

import WorldHeatMap from './WorldHeatMap'

const getGlobalCasesGivenDate = gql`
query Test($day: String!) {
  getGlobalCasesByDate(day: $day) {
    countryCode
    confirmed
    active
    recovered
    deaths
    confirmedCasesToday
    deathsToday
  }
}
`

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
      <WorldHeatMap mapDataLabel="Confirmed" showMoreThanOneDataItem={true} caseType="confirmed" data={[]} date={""} lightColour="#ffeaef" darkColour="#ff6384"/>
    )
  } else if (error) {
    content = (<p>{JSON.stringify(error, null, 2)}</p>)
  } else {
    const getGlobalCasesByDate = data.getGlobalCasesByDate
    content = (
      <WorldHeatMap mapDataLabel="Confirmed" showMoreThanOneDataItem={true} caseType="confirmed" data={getGlobalCasesByDate} date={currentDay} lightColour="#ffeaef" darkColour="#ff6384"/>
    )
  }

  return (
    <>
    <div className="card bg-light mb-3">
      <div className="card-body pt-0">
          {content}
          <label>
            <span className="heatMapHeader confirmedText">Confirmed cases.</span> Drag the slider below to change heatmap date. Currently viewing cases on&nbsp;
            <strong>{currentDayAsDate.toLocaleDateString()}</strong>
          </label>
          <input type="range" className="custom-range" min="1" max={timeSeriesLength} id="heatMapDateSlider" value={sliderValue}
            onMouseOver={() => {prefetchLastFewDays(sliderValue)}}
            onChange={changeEvent => { moveSlider(changeEvent.target.value) }}>
          </input>
      </div>
    </div>
    </>
  )
}

export default HeatMapRangeSlider
