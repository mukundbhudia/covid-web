import React from 'react'
import { useQuery } from '@apollo/react-hooks'

import ErrorInnerPage from '../ErrorInnerPage'
import MultiCountryTimeSeries from '../../Charts/MultiCountryTimeSeries'
import { getCasesByIdKey } from '../../../modules/queries'

const CompareInnerPage = ({ lastUpdated, countries,}) => {
  
  const { loading, error, data } = useQuery(getCasesByIdKey, {
    variables: { idKeys: countries },
  })

let cumulativeConfirmed
let cumulativeDeaths
let dailyConfirmedMovingAverage
let dailyDeathsMovingAverage

if (loading) {
  cumulativeConfirmed = (
    <MultiCountryTimeSeries
      chartTitle={ `Time series daily cases by day` }
      casesToHide={ {} }
      data={ [] }
      currentCases={ [] }
    />
  )
  cumulativeDeaths = cumulativeConfirmed
  dailyConfirmedMovingAverage = cumulativeConfirmed
  dailyDeathsMovingAverage = cumulativeConfirmed
} else if (error) {
  cumulativeConfirmed = (<ErrorInnerPage errorData={error} />)
  cumulativeDeaths = cumulativeConfirmed
  dailyConfirmedMovingAverage = cumulativeConfirmed
  dailyDeathsMovingAverage = cumulativeConfirmed
} else {
  let getCasesByIdKey = data && data.getManyCasesByIdKey
  const countryNamesAsList = getCasesByIdKey.map((caseByIdKey) => { return caseByIdKey.country }).join(', ')
  const currentCases = getCasesByIdKey.map((caseByIdKey) => {
    return {
      idKey: caseByIdKey.idKey,
      country: caseByIdKey.country,
      confirmed: caseByIdKey.confirmed,
      active: caseByIdKey.active,
      recovered: caseByIdKey.recovered,
      deaths: caseByIdKey.deaths,
      confirmedCasesToday: caseByIdKey.confirmedCasesToday,
      deathsToday: caseByIdKey.deathsToday,
    }
  })

  cumulativeConfirmed = (
    <MultiCountryTimeSeries
      chartTitle={ `Time series cumulative confirmed cases by day for ${countryNamesAsList}` }
      casesToHide={ {
        confirmed: false,
        deaths: true,
        confirmedToday: true,
        confirmedTodayMovingAverage: true,
        deathsToday: true,
        deathsTodayMovingAverage: true,
      } }
      data={ getCasesByIdKey }
      currentCases={ currentCases }
    />
  )

  cumulativeDeaths = (
    <MultiCountryTimeSeries
      chartTitle={ `Time series cumulative deaths by day for ${countryNamesAsList}` }
      casesToHide={ {
        confirmed: true,
        deaths: false,
        confirmedToday: true,
        confirmedTodayMovingAverage: true,
        deathsToday: true,
        deathsTodayMovingAverage: true,
      } }
      data={ getCasesByIdKey }
      currentCases={ currentCases }
    />
  )

  dailyConfirmedMovingAverage = (
    <MultiCountryTimeSeries
      chartTitle={ `Daily cumulative deaths by day for ${countryNamesAsList}` }
      casesToHide={ {
        confirmed: true,
        deaths: true,
        confirmedToday: true,
        confirmedTodayMovingAverage: false,
        deathsToday: true,
        deathsTodayMovingAverage: true,
      } }
      data={ getCasesByIdKey }
      currentCases={ currentCases }
    />
  )

  dailyDeathsMovingAverage = (
    <MultiCountryTimeSeries
      chartTitle={ `Daily cumulative deaths by day for ${countryNamesAsList}` }
      casesToHide={ {
        confirmed: true,
        deaths: true,
        confirmedToday: true,
        confirmedTodayMovingAverage: true,
        deathsToday: true,
        deathsTodayMovingAverage: false,
      } }
      data={ getCasesByIdKey }
      currentCases={ currentCases }
    />
  )
}

  return (
    <>
      <div className="row">
        <div className="col-sm">
          <div className="row justify-content-center"><h6>Cumulative confirmed cases</h6></div>
          { cumulativeConfirmed }
        </div>
      </div>

      <div className="row">
        <div className="col-sm">
        <div className="row justify-content-center"><h6>Cumulative deaths</h6></div>
          { cumulativeDeaths }
        </div>
      </div>

      <div className="row">
        <div className="col-sm">
        <div className="row justify-content-center"><h6>Daily confirmed moving average</h6></div>
          { dailyConfirmedMovingAverage }
        </div>
      </div>

      <div className="row">
        <div className="col-sm">
        <div className="row justify-content-center"><h6>Daily deaths moving average</h6></div>
          { dailyDeathsMovingAverage }
        </div>
      </div>
    </>
  )
}

export default CompareInnerPage
