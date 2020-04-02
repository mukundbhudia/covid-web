import React from 'react'
import TopXBarGraph from './TopXBarGraph'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import DataUpdatedTimeStamp from './DataUpdatedTimeStamp'

const getTopCases = () => gql`
  query {
    topXconfirmedByCountry(limit: 10) {
      country
      confirmed
    }
    topXactiveByCountry(limit: 10) {
      country
      active
    }
    topXrecoveredByCountry(limit: 10) {
      country
      recovered
    }
    topXdeathsByCountry(limit: 10) {
      country
      deaths
    }
  }
`

const TopCasesInnerPage = ({
   title,
   lastUpdated,
  }) => {
  const { loading, error, data } = useQuery(getTopCases())
  if (loading) return <p>Loading data for dashboard ...</p>
  if (error) return <p>{JSON.stringify(error, null, 2)}</p>

  return (
    <>
      <div id="global-page" className="">
        <h3>{title}</h3>
      </div>
      <div className="row">
        <DataUpdatedTimeStamp lastUpdated={lastUpdated}/>
      </div>
      <div className="row">
          <TopXBarGraph data={data.topXconfirmedByCountry} id="top5confirmed" chartTitle="Top 10 confirmed by country" chartLabel="confirmed" labelColor="red" />
      </div>
      <div className="row">
        <TopXBarGraph data={data.topXactiveByCountry} id="top5active" chartTitle="Top 10 active by country" chartLabel="active" labelColor="blue" />
      </div>
      <div className="row">
          <TopXBarGraph data={data.topXrecoveredByCountry} id="top5recovered" chartTitle="Top 10 recovered by country" chartLabel="recovered" labelColor="green" />
      </div> 
      <div className="row">
          <TopXBarGraph data={data.topXdeathsByCountry} id="top5deaths" chartTitle="Top 10 deaths by country" chartLabel="deaths" labelColor="grey" />
      </div>
    </>
  )
}

export default TopCasesInnerPage
