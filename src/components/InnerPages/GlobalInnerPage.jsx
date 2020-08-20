import React from 'react'
import { useQuery } from '@apollo/react-hooks'

import ErrorInnerPage from './ErrorInnerPage'
import LoadingInnerPage from './LoadingInnerPage'
import PanelTimeSeries from '../Panels/MultiPanels/PanelTimeSeries'
import DataUpdatedTimeStamp from '../Nav/DataUpdatedTimeStamp'
import PanelCurrentCases from '../Panels/MultiPanels/PanelCurrentCases'
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
      <div id="global-page">
        <h3>{title}</h3>
      </div>

      <div className="row">
        <DataUpdatedTimeStamp lastUpdated={lastUpdated}/>
      </div>

      <PanelCurrentCases
       cases= { globalTimeSeries }
       currentCases = { totalCases }
       confirmedVsActiveProgressBar = { confirmedVsActiveProgressBar }
       recoveredVsDeathsProgressBar = { recoveredVsDeathsProgressBar }
      />

      <div className="row">
        <div className="col-sm">
          <HeatMapRangeSlider dates={getAllDaysWithCases}/>
        </div>
      </div>

      <PanelTimeSeries
        cases={ globalTimeSeries }
        currentCases={ totalCases }
      />

      <PanelTopX data={topXdata}/>
    </>
  )
}

export default InnerPage
