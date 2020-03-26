import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";

import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'

import './App.css'
import GlobalInnerPage from './components/GlobalInnerPage'
import CountryInnerPage from './components/CountryInnerPage'
import TopCasesInnerPage from './components/TopCasesInnerPage'
import CountryNotFound from './components/CountryNotFound'

const COVID_TOTALS = gql`
  query {
    lastUpdated
    totalCases {
      confirmed
      active
      recovered
      deaths
  }
    globalTimeSeries {
      confirmed
      deaths
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
    casesByLocation {
      idKey
      country
      province
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
    casesByLocation,
  }) => (
  <>
  <Router>
    <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
      <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="/">COVID-19 Dashboard</a>
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
                <a className="nav-link active" href="/">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-home"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                  Global <span className="sr-only">(current)</span>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/top-cases">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-bar-chart-2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                  Top cases
                </a>
              </li>
              {/* <li className="nav-item">
                <a className="nav-link" href="#">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-layers"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                  Stats
                </a>
              </li> */}
            </ul>

            <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
              <span>Reports by country</span>
              <a className="d-flex align-items-center text-muted" href="/" aria-label="Add a new report">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus-circle"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
              </a>
            </h6>
            <ul className="nav flex-column mb-2">
              {casesByLocation.sort((a, b) => {
                const countryA = a.country.toUpperCase();
                const countryB = b.country.toUpperCase();

                let comparison = 0;
                if (countryA > countryB) {
                  comparison = 1;
                } else if (countryA < countryB) {
                  comparison = -1;
                }
                return comparison;
              }).map(allCases => {
                let linkToRender = ""
                if (allCases.province === null) {
                  linkToRender = (<li key={allCases.idKey} className="nav-item">
                  <Link className="nav-link" to={allCases.idKey}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-text"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    {allCases.country}
                  </Link>
                </li>)
                }
                return linkToRender
              })}
            </ul>
          </div>
        </nav>

        <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
          <div className="container-xl">
            <Switch>
              <Route exact path="/">
              <GlobalInnerPage
                  title="Global"
                  totalCases={totalCases}
                  lastUpdated={lastUpdated}
                  globalTimeSeries={globalTimeSeries}
                  topXconfirmedByCountry={topXconfirmedByCountry}
                  topXactiveByCountry={topXactiveByCountry}
                  topXrecoveredByCountry={topXrecoveredByCountry}
                  topXdeathsByCountry={topXdeathsByCountry}
                />
              </Route>
              <Route path="/top-cases" children={
                <TopCasesInnerPage
                  title="Top cases globally"
                  lastUpdated={lastUpdated}
                />
              } />
              <Route path="/:id" children={
                <CountryInnerPage
                  lastUpdated={lastUpdated}
                />
              } />
              <Route path="*">
                <CountryNotFound />
              </Route>
            </Switch>
          </div>
        </main>
      </div>
    </div>
    </Router>
  </>
)

export default () => {
  const { loading, error, data } = useQuery(COVID_TOTALS)
  if (loading) return <p>Loading data for dashboard ...</p>
  if (error) return <p>{JSON.stringify(error, null, 2)}</p>

  return <App {...data} />
}
