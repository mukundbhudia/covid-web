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
import ProgressBar from './ProgressBar'

const getCountry = (idKey) => gql`
  query {
    getCasesByIdKey(idKey: "${idKey}"){
      country
      province
      confirmed
      active
      recovered
      deaths
      latitude
      longitude
      lastUpdate
      casesByDate {
        confirmed
        deaths
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

  return (
    <>
      <div id={idKey} className="">
        <h3>{genPageTitle(getCasesByIdKey.country, getCasesByIdKey.province)}</h3>
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
      <br></br>
      <div className="">
      <div className="row">
          <div className="col-sm">
          <div className="alert alert-danger" role="alert">
              <h5>Total confirmed</h5>
              <div id="confirmedCounter" className="total-cases text-danger">{ getCasesByIdKey.confirmed.toLocaleString() }</div>
          </div>
          </div>
          <div className="col-sm">
          <div className="alert alert-primary" role="alert">
              <h5>Total active</h5>
              <div id="activeCounter" className="total-cases text-primary">{ getCasesByIdKey.active.toLocaleString() }</div>
          </div> 
          </div>
          <div className="col-sm">
          <div className="alert alert-success" role="alert">
              <h5>Total recovered</h5>
              <div id="recoveredCounter" className="total-cases text-success">{ getCasesByIdKey.recovered.toLocaleString() }</div>
          </div>
          </div>
          <div className="col-sm">
          <div className="alert alert-dark" role="alert">
              <h5>Total deaths</h5>
              <div id="deathsCounter" className="total-cases text-dark">{ getCasesByIdKey.deaths.toLocaleString() }</div>
          </div>
          </div>
      </div>
      </div>
      <div className="">
      <div className="row">
        <div className="col-sm">
          <div className="card bg-light mb-3">
            <div className="card-body">
              <h6 className="card-title">Confirmed/Active</h6>
              <ProgressBar
                  dataSet={confirmedVsActiveProgressBar}
              />
            </div>
          </div>
        </div>
        <div className="col-sm">
          <div className="card bg-light mb-3">
            <div className="card-body">
              <h6 className="card-title">Recoveries/Deaths</h6>
                <ProgressBar
                  dataSet={recoveredVsDeathsProgressBar}
                />
            </div>
          </div>
        </div>
      </div>
      <div className="row">
      </div>
      </div>
      {getCasesByIdKey.casesByDate &&
        <TimeSeries lastUpdated={lastUpdated} data={getCasesByIdKey.casesByDate} />
      }
      <div className="">
      </div>
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
