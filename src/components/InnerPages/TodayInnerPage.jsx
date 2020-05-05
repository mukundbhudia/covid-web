import React, { useState } from 'react'
import TopXBarGraph from '../Charts/TopXBarGraph'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import DataUpdatedTimeStamp from '../Nav/DataUpdatedTimeStamp'
import PanelConfirmedToday from '../Panels/PanelConfirmedToday'
import PanelDeathsToday from '../Panels/PanelDeathsToday'
import WorldHeatMap from '../WorldHeatMap/WorldHeatMap'

const getTopCases = () => gql`
  query {
    totalCases {
      confirmedCasesToday
      deathsToday
    }
    topXconfirmedTodayByCountry(limit: 10) {
      country
      confirmedCasesToday
    }
    topXdeathsTodayByCountry(limit: 10) {
      country
      deathsToday
    }
    casesByLocationWithNoProvince {
      countryCode
      confirmedCasesToday
      deathsToday
    }
  }
`

const isGreaterThanZero = (array, key) => {
  return array.filter((element) => { return element[key] > 0 })
}

const caseMaps = {
  confirmedCasesToday: {
    label: 'Confirmed cases today',
    lightColour: "#efedf5",
    darkColour:"#756bb1",
    textClassName: 'confirmedTodayText'
  },
  deathsToday: {
    label: 'Confirmed deaths today',
    lightColour: "#fff7bc",
    darkColour:"#d95f0e",
    textClassName: 'deathsTodayText'
  },
}

let caseTypeState = 'confirmedCasesToday'

const TodayInnerPage = ({ title, lastUpdated }) => {
  const [ caseType, setCaseType] = useState(caseTypeState)
  caseTypeState = caseType
  const { loading, error, data } = useQuery(getTopCases())
  if (loading) return <p>Loading data for dashboard ...</p>
  if (error) return <p>{JSON.stringify(error, null, 2)}</p>

  const totalCases = data.totalCases
  const casesByLocationWithNoProvince = data.casesByLocationWithNoProvince

  return (
    <>
      <div id="global-page" className="">
        <h3>{title} | {(new Date()).toLocaleDateString()}</h3>
      </div>

      <div className="row">
        <DataUpdatedTimeStamp lastUpdated={lastUpdated}/>
      </div>

      <div className="row">
        <div className="col-sm">
          <PanelConfirmedToday caseCount={totalCases.confirmedCasesToday}/>
        </div>
        <div className="col-sm">
          <PanelDeathsToday caseCount={totalCases.deathsToday}/>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-sm">
          <div className="btn-toolbar justify-content-center" role="toolbar" aria-label="Toolbar with button groups">
            <div className="btn-group btn-group-toggle mr-1" data-toggle="buttons">
              <label className={`btn btn-sm btn-light ${caseType === 'confirmedCasesToday' ? 'active' : ''}`}>
                <input type="radio" name="chart-type" onClick={() => {setCaseType('confirmedCasesToday')}}/> {caseMaps.confirmedCasesToday.label}
              </label>
              <label className={`btn btn-sm btn-light ${caseType === 'deathsToday' ? 'active' : ''}`}>
                <input type="radio" name="chart-type" onClick={() => {setCaseType('deathsToday')}}/> {caseMaps.deathsToday.label}
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

      <div className="row multiTopBar">
        <TopXBarGraph
          data={isGreaterThanZero(data.topXconfirmedTodayByCountry, 'confirmedCasesToday')}
          id="top10confirmedToday"
          chartTitle="Top 10 confirmed cases today by country"
          chartLabel="Confirmed cases today"
          chartLabelKey="confirmedCasesToday"
          labelColor="purple"
        />

        <TopXBarGraph
          data={isGreaterThanZero(data.topXdeathsTodayByCountry, 'deathsToday')}
          id="top10deathsToday"
          chartTitle="Top 10 deaths today by country"
          chartLabel="Deaths today"
          chartLabelKey="deathsToday"
          labelColor="yellow"
        />
      </div>
    </>
  )
}

export default TodayInnerPage
