import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'

import WorldHeatMap from './WorldHeatMap'

const getGlobalCasesGivenDate = (date) => gql`
query {
  getGlobalCasesByDate(day: "${date}") {
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

const HeatMapRangeSlider = ({ dates }) => {
  const timeSeriesLength = dates.length
  const [ value, setValue ] = useState(timeSeriesLength)

  let currentDay = dates[value-1]
  let currentDayAsDate = new Date(currentDay)
  const { loading, error, data, client } = useQuery(getGlobalCasesGivenDate(currentDay))

  const prefetchLastFewDays = (daysBefore) => {
    for (let index = 2; index < daysBefore; index++) {
      let dayToQuery = dates[value-index]
      client.query({
        query: getGlobalCasesGivenDate(dayToQuery),
      })
    }
    return dates[daysBefore-2]
  }

  const moveSlider = (newValue) => {
    setValue(newValue)
    prefetchLastFewDays(10)
  }

  let content
  if (loading) {
    let dayBefore = prefetchLastFewDays(0)
    content = (
      <WorldHeatMap mapDataLabel="Confirmed" showMoreThanOneDataItem={true} caseType="confirmed" data={[]} date={dayBefore} lightColour="#ffeaef" darkColour="#ff6384"/>
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
          <input type="range" className="custom-range" min="1" max={timeSeriesLength} id="heatMapDateSlider" value={value}
            onMouseOver={() => {prefetchLastFewDays(10)}}
            onChange={changeEvent => {moveSlider(changeEvent.target.value)}}>
          </input>
      </div>
    </div>

    </>
  )
}

export default HeatMapRangeSlider
