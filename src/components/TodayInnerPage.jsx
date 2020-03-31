import React from 'react'
import TopXBarGraph from './TopXBarGraph'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import DataUpdatedTimeStamp from './DataUpdatedTimeStamp'

const getTopCases = () => gql`
  query {
    totalCases {
      confirmedCasesToday
      deathsToday
    }
    topXconfirmedTodayByCountry(limit: 10) {
      country
      confirmedCasesToday
    }
    topXdeathsTodayByCountry(limit: 10) {
      country
      deathsToday
    }
  }
`

const TodayInnerPage = ({
   title,
   lastUpdated,
  }) => {
  const { loading, error, data } = useQuery(getTopCases())
  if (loading) return <p>Loading data for dashboard ...</p>
  if (error) return <p>{JSON.stringify(error, null, 2)}</p>

  const totalCases = data.totalCases

  return (
    <>
      <div id="global-page" className="">
        <h3>{title} | {(new Date()).toLocaleDateString()}</h3>
      </div>
      <div className="row">
        <DataUpdatedTimeStamp lastUpdated={lastUpdated}/>
      </div>
      <div className="row">
        <div className="col-sm">
          <div className="alert alert-purple" role="alert">
            <h5>New confirmed cases globally</h5>
            <div id="confirmedTodayCounter" className="total-cases text-purple">
              { totalCases.confirmedCasesToday.toLocaleString() }
            </div>
          </div>
        </div>
        <div className="col-sm">
          <div className="alert alert-warning" role="alert">
            <h5>New deaths globally</h5>
            <div id="deathsTodayCounter" className="total-cases text-yellow">
              { totalCases.deathsToday.toLocaleString() }
            </div>
          </div>
        </div>
      </div>
      <div className="row">
          <TopXBarGraph data={data.topXconfirmedTodayByCountry} id="top10confirmedToday" chartTitle="Top 10 confirmed today by country" chartLabel="confirmedCasesToday" labelColor="purple" />
      </div>
      <div className="row">
        <TopXBarGraph data={data.topXdeathsTodayByCountry} id="top10deathsToday" chartTitle="Top 10 deaths today by country" chartLabel="deathsToday" labelColor="yellow" />
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

export default TodayInnerPage
