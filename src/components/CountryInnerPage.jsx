import React from 'react'
import {
  useParams
} from "react-router-dom";

import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'

import CountryNotFound from '../components/CountryNotFound'
import TimeSeries from './TimeSeries'
// import TopXBarGraph from './TopXBarGraph'
// import PieChart from '../components/PieChart'
import DataUpdatedTimeStamp from './DataUpdatedTimeStamp';
import PanelConfirmedCount from './PanelConfirmedCount';
import PanelActiveCount from './PanelActiveCount';
import PanelRecoveredCount from './PanelRecoveredCount';
import PanelDeathCount from './PanelDeathCount';
import PanelDeathsToday from './PanelDeathsToday';
import PanelConfirmedToday from './PanelConfirmedToday';
import PanelConfirmedVsActive from './PanelConfirmedVsActive';
import PanelRecoveriesVsDeaths from './PanelRecoveriesVsDeaths';

const getCountry = (idKey) => gql`
  query {
    getCasesByIdKey(idKey: "${idKey}"){
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
  const { loading, error, data } = useQuery(getCountry(id))
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
      data: getCasesByIdKey.active,
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

  return (
    <>
      <div id={idKey} className="">
        <h3>{genPageTitle(getCasesByIdKey.country, getCasesByIdKey.province)}</h3>
      </div>
      <div className="row">
        <DataUpdatedTimeStamp lastUpdated={lastUpdated}/>
      </div>
      {getCasesByIdKey.hasProvince &&
        <ul className="nav">
          {getCasesByIdKey.provincesList.map((provinceKey, i) => {
            return (<li className="nav-item" key={i}>
            <a className="nav-link active" href={`/${provinceKey.idKey}`}>{`${provinceKey.province}`}</a>
          </li>)
          })}
        </ul>
      }
      {getCasesByIdKey.province &&
        <ul className="nav">
          <li className="nav-item">
            <a className="nav-link active" href={`/${getCasesByIdKey.country.replace(/,/g, '').replace(/\s+/g, '-').toLowerCase()}`}>{getCasesByIdKey.country}</a>
          </li>
      </ul>
      }

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
      {getCasesByIdKey.casesByDate &&
        <TimeSeries lastUpdated={lastUpdated} data={getCasesByIdKey.casesByDate} currentCases={currentCases} />
      }
      <footer className="footer mt-auto py-3">
      <div className="container pull-left">
          <span className="text-muted">Data sources: <a href="https://www.who.int/">WHO</a>, <a href="https://gisanddata.maps.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6">John Hopkins University</a></span>
      </div>
      <div className="container pull-right">
          <span className="text-muted">Made by: <a href="https://github.com/mukundbhudia">Mukund</a>, <a href="https://github.com/salomao-rodrigues">Sal</a></span>
      </div>
      </footer>
    </>
  )
}

export default InnerPage
