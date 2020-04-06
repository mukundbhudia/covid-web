import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import DataUpdatedTimeStamp from '../Nav/DataUpdatedTimeStamp'
import WorldHeatMap from '../WorldHeatMap/WorldHeatMap'

const getTopCases = () => gql`
  query {
    casesByLocationWithNoProvince {
      countryCode
      confirmed
      active
      recovered
      deaths
    }
  }
`

const HeatMapsInnerPage = ({
   title,
   lastUpdated,
  }) => {
  const { loading, error, data } = useQuery(getTopCases())
  if (loading) return <p>Loading data for dashboard ...</p>
  if (error) return <p>{JSON.stringify(error, null, 2)}</p>

  const casesByLocationWithNoProvince = data.casesByLocationWithNoProvince

  return (
    <>
      <div id="global-page" className="">
        <h3>{title}</h3>
      </div>
      <div className="row">
        <DataUpdatedTimeStamp lastUpdated={lastUpdated}/>
      </div>

      <div className="row">
        <div className="col-sm">
          <p className="heatMapHeader confirmedText">Confirmed cases</p>
        </div>
      </div>
      <div className="row">
        <div className="col-sm">
          <WorldHeatMap mapDataLabel="Confirmed" caseType="confirmed" data={casesByLocationWithNoProvince} lightColour="#fee0d2" darkColour="#de2d26"/>
        </div>
      </div>

      <div className="row">
        <div className="col-sm">
          <p className="heatMapHeader activeText">Active cases</p>
        </div>
      </div>
      <div className="row">
        <div className="col-sm">
          <WorldHeatMap mapDataLabel="Active" caseType="active" data={casesByLocationWithNoProvince} lightColour="#deebf7" darkColour="#3182bd"/>
        </div>
      </div>

      <div className="row">
        <div className="col-sm">
          <p className="heatMapHeader recoveredText">Recovered cases</p>
        </div>
      </div>
      <div className="row">
        <div className="col-sm">
          <WorldHeatMap mapDataLabel="Recovered" caseType="recovered" data={casesByLocationWithNoProvince} lightColour="#e5f5e0" darkColour="#31a354"/>
        </div>
      </div>

      <div className="row">
        <div className="col-sm">
          <p className="heatMapHeader deathsText">Death cases</p>
        </div>
      </div>
      <div className="row">
        <div className="col-sm">
          <WorldHeatMap mapDataLabel="Deaths" caseType="deaths" data={casesByLocationWithNoProvince} lightColour="#f0f0f0" darkColour="#636363"/>
        </div>
      </div>
    </>
  )
}

export default HeatMapsInnerPage
