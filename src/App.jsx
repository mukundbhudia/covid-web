import React from 'react'

import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'

import './App.css'
import TimeSeries from './components/TimeSeries'
import TopXBarGraph from './components/TopXBarGraph'
import PieChart from './components/PieChart'

const COVID_TOTALS = gql`
  fragment CaseFields on Cases {
    confirmed
    active
    recovered
    deaths
  }
  query {
    lastUpdated
    totalCases {
      ...CaseFields
    }
    globalTimeSeries {
      ...CaseFields
      day
    }
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

const App = (
  {
    lastUpdated,
    totalCases,
    globalTimeSeries,
    topXconfirmedByCountry,
    topXactiveByCountry,
    topXrecoveredByCountry,
    topXdeathsByCountry,
  }) => (
  <>
    <div className="container-xl">
      <h3>COVID-19 Dashboard</h3>
    </div>
    <br></br>
    <div className="container-xl">
      <div className="row">
        <div className="col-sm">
          <div className="alert alert-danger" role="alert">
            <h5>Total confirmed</h5>
            <div id="confirmedCounter" className="total-cases text-danger">{ totalCases.confirmed.toLocaleString() }</div>
          </div>
        </div>
        <div className="col-sm">
          <div className="alert alert-primary" role="alert">
            <h5>Total active</h5>
            <div id="activeCounter" className="total-cases text-primary">{ totalCases.active.toLocaleString() }</div>
          </div> 
        </div>
        <div className="col-sm">
          <div className="alert alert-success" role="alert">
            <h5>Total recovered</h5>
            <div id="recoveredCounter" className="total-cases text-success">{ totalCases.recovered.toLocaleString() }</div>
          </div>
        </div>
        <div className="col-sm">
          <div className="alert alert-dark" role="alert">
            <h5>Total deaths</h5>
            <div id="deathsCounter" className="total-cases text-dark">{ totalCases.deaths.toLocaleString() }</div>
          </div>
        </div>
      </div>
    </div>
    <div className="container-xl">
      <div className="row">
        <PieChart
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
        />
      </div>
    </div>
    <TimeSeries lastUpdated={lastUpdated} data={globalTimeSeries} />
    <div className="container-xl">
      <div className="row">
        <TopXBarGraph data={topXconfirmedByCountry} id="top5confirmed" chartTitle="Top 5 confirmed by country" chartLabel="confirmed" labelColor="red" />
        <TopXBarGraph data={topXactiveByCountry} id="top5active" chartTitle="Top 5 active by country" chartLabel="active" labelColor="blue" />
      </div>
      <div className="row">
        <TopXBarGraph data={topXrecoveredByCountry} id="top5recovered" chartTitle="Top 5 recovered by country" chartLabel="recovered" labelColor="green" />
        <TopXBarGraph data={topXdeathsByCountry} id="top5deaths" chartTitle="Top 5 deaths by country" chartLabel="deaths" labelColor="grey" />
      </div>
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

export default () => {
  const { loading, error, data } = useQuery(COVID_TOTALS)
  if (loading) return <p>Loading dashbord ...</p>
  if (error) return <p>{JSON.stringify(error, null, 2)}</p>

  return <App {...data} />
}
