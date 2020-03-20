import React from 'react'

import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'

import './App.css'

const COVID_TOTALS = gql`
  query {
    totalCases {
      confirmed
      recovered
      deaths
      active
    }
  }
`

const App = () => {
  const { loading, error, data } = useQuery(COVID_TOTALS)
  if (loading) return <p>Loading...</p>
  if (error) return <p>{JSON.stringify(error, null, 2)}</p>

  return (
    <div>
      <div className='container'>
        <h1>Coronavirus COVID-19</h1>
      </div>
      <div className='container'>
        <div className='row'>
          <div className="col-sm">
            <h3>Total Confirmed</h3>
            <div className='total-cases text-danger'>{data.totalCases.confirmed.toLocaleString()}</div>
          </div>
          <div className="col-sm">
            <h3>Total Deaths</h3>
            <div className='total-cases text-dark'>{data.totalCases.deaths.toLocaleString()}</div>
          </div>
          <div className="col-sm">
            <h3>Total Recovered</h3>
            <div className='total-cases text-success'>{data.totalCases.recovered.toLocaleString()}</div>
          </div>
        </div>
      </div>
      <div className='container'>
      <ul>
        {/* {data.casesByLocation.map(({ country, province, confirmed }: Cases, index: number) => (
          <li key={index}>{country} - {province}: {confirmed}</li>
        ))} */}
      </ul>
      </div>
    </div>
  )
}

export default App
