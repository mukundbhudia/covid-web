import React from 'react'

import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'

import './App.css'
import TimeSeries from './components/TimeSeries'
import TopXBarGraph from './components/TopXBarGraph'

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
    <TimeSeries lastUpdated={lastUpdated} data={globalTimeSeries} />
    <div className="container-xl">
      <div className="row">
        <TopXBarGraph data={topXconfirmedByCountry} id="top5confirmed" chartTitle="Top 5 confirmed by country" chartLabel="confirmed" labelColor="red" />
        <TopXBarGraph data={topXactiveByCountry} id="top5active" chartTitle="Top 5 active by country" chartLabel="active" labelColor="blue" />
      </div>
      <div className="row">
        <TopXBarGraph data={topXrecoveredByCountry} id="top5confirmed" chartTitle="Top 5 recovered by country" chartLabel="recovered" labelColor="green" />
        <TopXBarGraph data={topXdeathsByCountry} id="top5active" chartTitle="Top 5 deaths by country" chartLabel="deaths" labelColor="grey" />
      </div>
    </div>
    <footer className="footer mt-auto py-3">
      <div className="container">
        <span className="text-muted">Data sources: WHO, John Hopkins University</span>
      </div>
    </footer>
  </>
)

export default () => {
  const { loading, error, data } = useQuery(COVID_TOTALS)
  if (loading) return <p>Loading dashbord da5...</p>
  if (error) return <p>{JSON.stringify(error, null, 2)}</p>

  return <App {...data} />
}
