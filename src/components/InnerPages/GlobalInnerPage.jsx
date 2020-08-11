import React from 'react'
import { useQuery } from '@apollo/react-hooks'

import ErrorInnerPage from './ErrorInnerPage'
import LoadingInnerPage from './LoadingInnerPage'
import TimeSeries from '../Charts/TimeSeries'
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
import PanelTopX from '../Panels/PanelTopX'
import { COVID_GLOBAL_PAGE } from '../../modules/queries'

const InnerPage = ({
   title,
   lastUpdated,
  }) => {
  const { loading, error, data } = useQuery(COVID_GLOBAL_PAGE)
  if (loading) return <LoadingInnerPage/>
  if (error) return <ErrorInnerPage errorData={error} />

  const totalCases = data.totalCases
  const globalTimeSeries = data.globalTimeSeries
  const getAllDaysWithCases = data.getAllDaysWithCases
  const topXdata = {
    topXconfirmedByCountry: {data: data.topXconfirmedByCountry, label: 'Top 5 confirmed by country'},
    topXactiveByCountry: {data: data.topXactiveByCountry, label: 'Top 5 active by country'},
    topXrecoveredByCountry: {data: data.topXrecoveredByCountry, label: 'Top 5 recovered by country'},
    topXdeathsByCountry: {data: data.topXdeathsByCountry, label: 'Top 5 deaths by country'},
  }

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
      color: 'progressBadGrey',
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
        <div className="col-sm">
          <HeatMapRangeSlider dates={getAllDaysWithCases}/>
        </div>
      </div>

      <div className="row">
        <div className="col-sm">
          <TimeSeries
            chartTitle="Global time series cases by day"
            casesToHide={ {
              confirmed: false,
              deaths: false,
              confirmedToday: false,
              confirmedTodayMovingAverage: true,
              deathsToday: false,
              deathsTodayMovingAverage: true,
            } }
            data={globalTimeSeries}
            currentCases={totalCases}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-sm">
          <TimeSeries
            chartTitle="Global time series daily cases by day"
            casesToHide={ {
              confirmed: true,
              deaths: true,
              confirmedToday: false,
              confirmedTodayMovingAverage: false,
              deathsToday: false,
              deathsTodayMovingAverage: false,
            } }
            data={globalTimeSeries}
            currentCases={totalCases}
          />
        </div>
      </div>

      <PanelTopX data={topXdata}/>
    </>
  )
}

export default InnerPage
