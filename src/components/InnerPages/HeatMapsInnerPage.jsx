import React, { useState } from 'react'
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

const caseMaps = {
  confirmed: {
    label: 'Confirmed',
    lightColour: "#fee0d2",
    darkColour:"#de2d26",
    textClassName: 'confirmedText'
  },
  active: {
    label: 'Active',
    lightColour: "#deebf7",
    darkColour:"#3182bd",
    textClassName: 'activeText'
  },
  recovered: {
    label: 'Recovered',
    lightColour: "#e5f5e0",
    darkColour:"#31a354",
    textClassName: 'recoveredText'
  },
  deaths: {
    label: 'Deaths',
    lightColour: "#f0f0f0",
    darkColour:"#636363",
    textClassName: 'deathsText'
  },
}

const HeatMapsInnerPage = ({ title, lastUpdated }) => {
  const [ caseType, setCaseType] = useState('confirmed')
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

      <div className="row mb-4">
        <div className="col-sm">
          <div className="btn-toolbar justify-content-center" role="toolbar" aria-label="Toolbar with button groups">
            <div className="btn-group btn-group-toggle mr-1" data-toggle="buttons">
              <label className={`btn btn-sm btn-light ${caseType === 'confirmed' ? 'active' : ''}`}>
                <input type="radio" name="chart-type" onClick={() => {setCaseType('confirmed')}}/> {caseMaps.confirmed.label}
              </label>
              <label className={`btn btn-sm btn-light ${caseType === 'active' ? 'active' : ''}`}>
                <input type="radio" name="chart-type" onClick={() => {setCaseType('active')}}/> {caseMaps.active.label}
              </label>
              <label className={`btn btn-sm btn-light ${caseType === 'recovered' ? 'active' : ''}`}>
                <input type="radio" name="chart-type" onClick={() => {setCaseType('recovered')}}/> {caseMaps.recovered.label}
              </label>
              <label className={`btn btn-sm btn-light ${caseType === 'deaths' ? 'active' : ''}`}>
                <input type="radio" name="chart-type" onClick={() => {setCaseType('deaths')}}/> {caseMaps.deaths.label}
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm">
          <WorldHeatMap
            mapDataLabel="Cases"
            caseType={caseType}
            date={caseType}
            data={casesByLocationWithNoProvince}
            lightColour={caseMaps[caseType].lightColour}
            darkColour={caseMaps[caseType].darkColour}
          />
        </div>
      </div>
    </>
  )
}

export default HeatMapsInnerPage
