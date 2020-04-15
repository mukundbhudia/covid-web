import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'

import TimeSeries from '../Charts/TimeSeries'
import TopXBarGraph from '../Charts/TopXBarGraph'
// import PieChart from '../components/PieChart'
import DataUpdatedTimeStamp from '../Nav/DataUpdatedTimeStamp'
import PanelDeathsToday from '../Panels/PanelDeathsToday'
import PanelConfirmedToday from '../Panels/PanelConfirmedToday'
import PanelConfirmedCount from '../Panels/PanelConfirmedCount'
import PanelActiveCount from '../Panels/PanelActiveCount'
import PanelRecoveredCount from '../Panels/PanelRecoveredCount'
import PanelDeathCount from '../Panels/PanelDeathCount'
import PanelConfirmedVsActive from '../Panels/PanelConfirmedVsActive'
import PanelRecoveriesVsDeaths from '../Panels/PanelRecoveriesVsDeaths'
import HeatMapRangeSlider from '../WorldHeatMap/HeatMapRangeSlider'

const COVID_GLOBAL_PAGE = gql`
  query {
    totalCases {
      confirmed
      active
      recovered
      deaths
      confirmedCasesToday
      deathsToday
    }
    globalTimeSeries {
      confirmed
      deaths
      confirmedCasesToday
      deathsToday
      day
    }
    getAllDaysWithCases
    topXconfirmedByCountry(limit: 5) {
      country
      confirmed
    }
    topXactiveByCountry(limit: 5) {
      country
      active
    }
    topXrecoveredByCountry(limit: 5) {
      country
      recovered
    }
    topXdeathsByCountry(limit: 5) {
      country
      deaths
    }
  }
`

const InnerPage = ({
   title,
   lastUpdated,
  }) => {
  const { loading, error, data } = useQuery(COVID_GLOBAL_PAGE)
  if (loading) return <p>Loading data for dashboard ...</p>
  if (error) return <p>{JSON.stringify(error, null, 2)}</p>

  const totalCases = data.totalCases
  const globalTimeSeries = data.globalTimeSeries
  const topXconfirmedByCountry = data.topXconfirmedByCountry
  const topXactiveByCountry = data.topXactiveByCountry
  const topXrecoveredByCountry = data.topXrecoveredByCountry
  const topXdeathsByCountry = data.topXdeathsByCountry
  const getAllDaysWithCases = data.getAllDaysWithCases

  const confirmedVsActiveProgressBar = [
    {
      data: totalCases.confirmed,
      label: 'confirmed',
      color: 'red',
    },
    {
      data: totalCases.confirmed - totalCases.active,
      label: 'active',
      color: 'blue',
    },
  ]

  const recoveredVsDeathsProgressBar = [
    {
      data: totalCases.recovered,
      label: 'recovered',
      color: 'green',
    },
    {
      data: totalCases.deaths,
      label: 'deaths',
      color: 'grey',
    },
  ]

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
          <PanelConfirmedCount caseCount={totalCases.confirmed}/>
        </div>
        <div className="col-sm">
          <PanelActiveCount caseCount={totalCases.active}/>
        </div>
        <div className="col-sm">
          <PanelRecoveredCount caseCount={totalCases.recovered}/>
        </div>
        <div className="col-sm">
          <PanelDeathCount caseCount={totalCases.deaths}/>
        </div>
      </div>
      <div className="row">
        <div className="col-sm">
          <PanelConfirmedToday caseCount={totalCases.confirmedCasesToday}/>
        </div>
        <div className="col-sm">
          <PanelDeathsToday caseCount={totalCases.deathsToday} />
        </div>
      </div>
      <div className="row">
        <div className="col-sm">
          <PanelConfirmedVsActive data={confirmedVsActiveProgressBar}/>
        </div>
        <div className="col-sm">
          <PanelRecoveriesVsDeaths data={recoveredVsDeathsProgressBar}/>
        </div>
      </div>
      <div className="row">
          {/* <PieChart
          data1={totalCases.confirmed}
          data2={totalCases.active}
          id="pieConfirmedAndActive"
          chartTitle="Convirmed v Active"
          chartLabel1="confirmed"
          chartLabel2="active"
          labelColor1="red"
          labelColor2="blue"
          />
          <PieChart
          data1={totalCases.recovered}
          data2={totalCases.deaths}
          id="pieRecoveredAndDeaths"
          chartTitle="Recovered v Deaths"
          chartLabel1="recovered"
          chartLabel2="deaths"
          labelColor1="green"
          labelColor2="grey"
          /> */}
      </div>

      <div className="row">
        <div className="col-sm">
          <p className="heatMapHeader confirmedText">Confirmed cases</p>
        </div>
      </div>
      <div className="row">
        <div className="col-sm">
          <HeatMapRangeSlider dates={getAllDaysWithCases}/>
        </div>
      </div>

      <div className="row">
        <div className="col-sm">
        <TimeSeries lastUpdated={lastUpdated} data={globalTimeSeries} currentCases={totalCases} />
        </div>
      </div>

      <div className="row multiTopBar">
          <TopXBarGraph data={topXconfirmedByCountry} id="top5confirmed" chartTitle="Top 5 confirmed by country" chartLabel="Confirmed" chartLabelKey="confirmed" labelColor="red" />
          <TopXBarGraph data={topXactiveByCountry} id="top5active" chartTitle="Top 5 active by country" chartLabel="Active" chartLabelKey="active" labelColor="blue" />
      </div>
      <div className="row multiTopBar">
          <TopXBarGraph data={topXrecoveredByCountry} id="top5recovered" chartTitle="Top 5 recovered by country" chartLabel="Recovered" chartLabelKey="recovered" labelColor="green" />
          <TopXBarGraph data={topXdeathsByCountry} id="top5deaths" chartTitle="Top 5 deaths by country" chartLabel="Deaths" chartLabelKey="deaths" labelColor="grey" />
      </div>
    </>
  )
}

export default InnerPage