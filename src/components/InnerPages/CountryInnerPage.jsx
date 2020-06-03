import React from 'react'
import {
  useParams
} from "react-router-dom";

import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'

import CountryNotFound from './CountryNotFound'
import TimeSeries from '../Charts/TimeSeries'
import DataUpdatedTimeStamp from '../Nav/DataUpdatedTimeStamp';
import ProvincesMenu from '../Nav/ProvincesMenu';
import PanelConfirmedCount from '../Panels/PanelConfirmedCount';
import PanelActiveCount from '../Panels/PanelActiveCount';
import PanelRecoveredCount from '../Panels/PanelRecoveredCount';
import PanelDeathCount from '../Panels/PanelDeathCount';
import PanelDeathsToday from '../Panels/PanelDeathsToday';
import PanelConfirmedToday from '../Panels/PanelConfirmedToday';
import PanelConfirmedVsActive from '../Panels/PanelConfirmedVsActive';
import PanelRecoveriesVsDeaths from '../Panels/PanelRecoveriesVsDeaths';

const getCountry = gql`
  query GetCases($idKey: String!) {
    getCasesByIdKey(idKey: $idKey){
      country
      province
      confirmed
      active
      recovered
      deaths
      confirmedCasesToday
      deathsToday
      latitude
      longitude
      lastUpdate
      casesByDate {
        confirmed
        deaths
        confirmedCasesToday
        deathsToday
        day
      }
      provincesList {
        idKey
        province
      }
      hasProvince
    }
  }
`

const InnerPage = (pData) => {
  let { id } = useParams()
  const { loading, error, data } = useQuery(getCountry, {
     variables: { idKey: id }
  })
  if (loading) return <p>Loading data for dashboard ...</p>
  if (error) return <p>{JSON.stringify(error, null, 2)}</p>

  let getCasesByIdKey = data && data.getCasesByIdKey[0]

  if (!getCasesByIdKey) {
    return ( <CountryNotFound /> )
  }
  let lastUpdated = getCasesByIdKey.lastUpdate
  let idKey = id

  const genPageTitle = (country, province) => {
    if (province) {
      return `${country} - ${province}`
    } else {
      return `${country}`
    }
  }

  const confirmedVsActiveProgressBar = [
    {
      data: getCasesByIdKey.confirmed,
      label: 'confirmed',
      color: 'red',
    },
    {
      data: getCasesByIdKey.confirmed - getCasesByIdKey.active,
      label: 'active',
      color: 'blue',
    },
  ]

  const recoveredVsDeathsProgressBar = [
    {
      data: getCasesByIdKey.recovered,
      label: 'recovered',
      color: 'green',
    },
    {
      data: getCasesByIdKey.deaths,
      label: 'deaths',
      color: 'grey',
    },
  ]

  const currentCases = {
    confirmed: getCasesByIdKey.confirmed,
    active: getCasesByIdKey.active,
    recovered: getCasesByIdKey.recovered,
    deaths: getCasesByIdKey.deaths,
    confirmedCasesToday: getCasesByIdKey.confirmedCasesToday,
    deathsToday: getCasesByIdKey.deathsToday,
  }

  const pageTitle = genPageTitle(getCasesByIdKey.country, getCasesByIdKey.province)

  return (
    <>
      <div id={idKey} className="">
        <h3>{pageTitle}</h3>
      </div>
      <div className="row">
        <DataUpdatedTimeStamp lastUpdated={lastUpdated}/>
      </div>

      <div className="row">
        <div className="col-sm">
          <PanelConfirmedCount caseCount={currentCases.confirmed}/>
        </div>
        <div className="col-sm">
          <PanelActiveCount caseCount={currentCases.active}/>
        </div>
        <div className="col-sm">
          <PanelRecoveredCount caseCount={currentCases.recovered}/>
        </div>
        <div className="col-sm">
          <PanelDeathCount caseCount={currentCases.deaths}/>
        </div>
      </div>
      <div className="row">
        <div className="col-sm">
          <PanelConfirmedToday caseCount={currentCases.confirmedCasesToday}/>
        </div>
        <div className="col-sm">
          <PanelDeathsToday caseCount={currentCases.deathsToday}/>
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

      {
        (getCasesByIdKey.province || getCasesByIdKey.hasProvince) &&
        <ProvincesMenu countryName={getCasesByIdKey.country} idKey={idKey}/>
      }

      {getCasesByIdKey.casesByDate &&
        <div className="row">
          <div className="col-sm">
            <TimeSeries
              chartTitle={ `Time series cases by day for ${pageTitle}` }
              casesToHide={ {
                confirmed: false,
                deaths: false,
                confirmedToday: false,
                confirmedTodayMovingAverage: true,
                deathsToday: false,
                deathsTodayMovingAverage: true,
              } }
              data={getCasesByIdKey.casesByDate}
              currentCases={currentCases}
            />
          </div>
        </div>
      }
      <br/>
      {getCasesByIdKey.casesByDate &&
        <div className="row">
          <div className="col-sm">
            <TimeSeries
              chartTitle={ `Time series daily cases by day for ${pageTitle}` }
              casesToHide={ {
                confirmed: true,
                deaths: true,
                confirmedToday: false,
                confirmedTodayMovingAverage: false,
                deathsToday: false,
                deathsTodayMovingAverage: false,
              } }
              data={getCasesByIdKey.casesByDate}
              currentCases={currentCases}
            />
          </div>
        </div>
      }
    </>
  )
}

export default InnerPage
