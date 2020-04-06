import React from 'react'
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

const TodayInnerPage = ({
   title,
   lastUpdated,
  }) => {
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

      <div className="row">
        <div className="col-sm">
          <div className="heatMapHeader confirmedTodayText">Confirmed cases today</div>
          <WorldHeatMap mapDataLabel="Confirmed Today" caseType="confirmedCasesToday" data={casesByLocationWithNoProvince} lightColour="#efedf5" darkColour="#756bb1"/>
        </div>
      </div>
      <div className="row">
          <TopXBarGraph data={data.topXconfirmedTodayByCountry} id="top10confirmedToday" chartTitle="Top 10 confirmed today by country" chartLabel="confirmedCasesToday" labelColor="purple" />
      </div>

      <div className="row">
        <div className="col-sm">
          <div className="heatMapHeader deathsTodayText">Confirmed deaths today</div>
          <WorldHeatMap mapDataLabel="Deaths Today" caseType="deathsToday" data={casesByLocationWithNoProvince} lightColour="#fff7bc" darkColour="#d95f0e"/>
        </div>
      </div>
      <div className="row">
        <TopXBarGraph data={data.topXdeathsTodayByCountry} id="top10deathsToday" chartTitle="Top 10 deaths today by country" chartLabel="deathsToday" labelColor="yellow" />
      </div>
    </>
  )
}

export default TodayInnerPage
