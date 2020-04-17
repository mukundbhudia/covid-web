import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'

import WorldHeatMap from './WorldHeatMap'
// TODO: Remove this componant?
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

const HeatMap = ({ date }) => {
  const { loading, error, data } = useQuery(getGlobalCasesGivenDate(date))

  if (data) { 
    const getGlobalCasesByDate = data.getGlobalCasesByDate
  
    return (
      <>
      <WorldHeatMap mapDataLabel="Confirmed" showMoreThanOneDataItem={true} caseType="confirmed" data={getGlobalCasesByDate} date={date} lightColour="#ffeaef" darkColour="#ff6384"/>
      </>
    )
  } else {
    if (loading) return <p>Loading data for heatmap ...</p>
    if (error) return <p>{JSON.stringify(error, null, 2)}</p>
  }

  return (
    <>
    </>
  )
}

export default HeatMap
