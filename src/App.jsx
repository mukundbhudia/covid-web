import React from 'react'

import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'

import './App.css'
import TimeSeries from './components/TimeSeries'

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
  }
`

const App = ({ lastUpdated, totalCases, globalTimeSeries }) => (
  <div>
    <div className="container-xl">
      <h3>COVID-19 global cases by day</h3>
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
  </div>
)

export default () => {
  const { loading, error, data } = useQuery(COVID_TOTALS)
  if (loading) return <p>Loading...</p>
  if (error) return <p>{JSON.stringify(error, null, 2)}</p>

  return <App {...data} />
}
