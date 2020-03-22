import React from 'react'

import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'

import './App.css'
import TimeSeries from './components/TimeSeries'
import TopXBarGraph from './components/TopXBarGraph'
// import PieChart from './components/PieChart'
import ProgressBar from './components/ProgressBar'

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
    getAllCountries
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
    getAllCountries,
  }) => (
  <>
    <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
      <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="#">COVID-19 Dashboard</a>
      {/* <input className="form-control form-control-dark w-100" type="text" placeholder="Search" aria-label="Search" /> */}
      <ul className="navbar-nav px-3">
        <li className="nav-item text-nowrap">
          {/* <a className="nav-link" href="#">Sign out</a> */}
        </li>
      </ul>
    </nav>

    <div className="container-fluid">
      <div className="row">
        <nav className="col-md-2 d-none d-md-block bg-light sidebar">
          <div className="sidebar-sticky">
            <ul className="nav flex-column">
              <li className="nav-item">
                <a className="nav-link active" href="#">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-home"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                  Global <span className="sr-only">(current)</span>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-bar-chart-2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                  Reports
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-layers"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                  Stats
                </a>
              </li>
            </ul>

            <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
              <span>Reports by country</span>
              <a className="d-flex align-items-center text-muted" href="#" aria-label="Add a new report">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus-circle"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
              </a>
            </h6>
            <ul className="nav flex-column mb-2">
              {getAllCountries.sort().map(title =>
                <li key={title} className="nav-item">
                  <a className="nav-link" href={`/${title}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-text"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    {title}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </nav>

        <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
          <div className="">
            <h3>COVID-19 | Global</h3>
          </div>
          <br></br>
          <div className="">
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
          <div className="">
            <div className="row">
              <div className="col-sm">
                <ProgressBar
                  data1={totalCases.confirmed}
                  data2={totalCases.active}
                  id="barConfirmedAndActive"
                  chartLabel1="confirmed"
                  chartLabel2="active"
                />
              </div>
              <div className="col-sm">
                <ProgressBar
                  data1={totalCases.recovered}
                  data2={totalCases.deaths}
                  id="barRecoveredAndDeaths"
                  chartLabel1="recovered"
                  chartLabel2="deaths"
                />
              </div>
            </div>
            <div className="row">
              {/* <PieChart
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
              /> */}
            </div>
          </div>
          <TimeSeries lastUpdated={lastUpdated} data={globalTimeSeries} />
          <div className="">
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
        </main>
      </div>
    </div>
  </>
)

export default () => {
  const { loading, error, data } = useQuery(COVID_TOTALS)
  if (loading) return <p>Loading data for dashboard ...</p>
  if (error) return <p>{JSON.stringify(error, null, 2)}</p>

  return <App {...data} />
}
