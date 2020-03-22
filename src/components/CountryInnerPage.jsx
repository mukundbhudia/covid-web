import React from 'react'
import {
  useParams
} from "react-router-dom";

import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'

import TimeSeries from './TimeSeries'
// import TopXBarGraph from './TopXBarGraph'
// import PieChart from '../components/PieChart'
import ProgressBar from './ProgressBar'

const getCountry = (country) => gql`
  query {
    getCasesWithCountryAndProvince(country: "${country}", province: ""){
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
        active
        deaths
        recovered
        day
      }
    }
  }
`

const InnerPage = (pData) => {
  let { id } = useParams()
  const { loading, error, data } = useQuery(getCountry(id))
  if (loading) return <p>Loading data for dashboard ...</p>
  if (error) return <p>{JSON.stringify(error, null, 2)}</p>

  let getCasesWithCountryAndProvince = data.getCasesWithCountryAndProvince[0]
  let lastUpdated = getCasesWithCountryAndProvince.lastUpdated
  let countryName = id

  return (
    <>
      <div id={countryName} className="">
        <h3>COVID-19 | {getCasesWithCountryAndProvince.country}</h3>
      </div>
      <br></br>
      <div className="">
      <div className="row">
          <div className="col-sm">
          <div className="alert alert-danger" role="alert">
              <h5>Total confirmed</h5>
              <div id="confirmedCounter" className="total-cases text-danger">{ getCasesWithCountryAndProvince.confirmed.toLocaleString() }</div>
          </div>
          </div>
          <div className="col-sm">
          <div className="alert alert-primary" role="alert">
              <h5>Total active</h5>
              <div id="activeCounter" className="total-cases text-primary">{ getCasesWithCountryAndProvince.active.toLocaleString() }</div>
          </div> 
          </div>
          <div className="col-sm">
          <div className="alert alert-success" role="alert">
              <h5>Total recovered</h5>
              <div id="recoveredCounter" className="total-cases text-success">{ getCasesWithCountryAndProvince.recovered.toLocaleString() }</div>
          </div>
          </div>
          <div className="col-sm">
          <div className="alert alert-dark" role="alert">
              <h5>Total deaths</h5>
              <div id="deathsCounter" className="total-cases text-dark">{ getCasesWithCountryAndProvince.deaths.toLocaleString() }</div>
          </div>
          </div>
      </div>
      </div>
      <div className="">
      <div className="row">
        <div className="col-sm">
          <ProgressBar
              data1={getCasesWithCountryAndProvince.confirmed}
              data2={getCasesWithCountryAndProvince.active}
              id="barConfirmedAndActive"
              chartLabel1="confirmed"
              chartLabel2="active"
          />
        </div>
        <div className="col-sm">
          <ProgressBar
              data1={getCasesWithCountryAndProvince.recovered}
              data2={getCasesWithCountryAndProvince.deaths}
              id="barRecoveredAndDeaths"
              chartLabel1="recovered"
              chartLabel2="deaths"
          />
        </div>
      </div>
      <div className="row">
      </div>
      </div>
      {getCasesWithCountryAndProvince.casesByDate &&
        <TimeSeries lastUpdated={lastUpdated} data={getCasesWithCountryAndProvince.casesByDate} />
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
