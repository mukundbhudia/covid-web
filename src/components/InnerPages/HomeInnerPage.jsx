import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'

import GlobalInnerPage from './GlobalInnerPage'
import CountryInnerPage from './CountryInnerPage'
import TopCasesInnerPage from './TopCasesInnerPage'
import TodayInnerPage from './TodayInnerPage'
import CountryNotFound from './CountryNotFound'
import Footer from '../Nav/Footer'
import HeatMapsInnerPage from './HeatMapsInnerPage'
import NavBar from '../Nav/NavBar'
import NavSideBar from '../Nav/NavSideBar'
import DataTableInnerPage from './DataTableInnerPage/DataTableInnerPage'
import CompareInnerPage from './CompareInnerPage/CompareInnerPage'

const HomeInnerPage = ({ casesByLocation, lastUpdated, }) => {
  return (
    <>
    <Router basename={process.env.PUBLIC_URL}>

      <NavBar searchData={casesByLocation}/>

      <div className="container-fluid">
        <div className="row">

        <NavSideBar casesByLocation={casesByLocation}/>

          <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
            <div className="container-xl">
              <Switch>
                <Route exact path="/">
                <GlobalInnerPage
                    title="Global"
                    lastUpdated={lastUpdated}
                  />
                </Route>
                <Route path="/top-cases" children={
                  <TopCasesInnerPage
                    lastUpdated={lastUpdated}
                  />
                } />
                <Route path="/compare" children={
                  <CompareInnerPage
                    lastUpdated={lastUpdated}
                    countries={casesByLocation}
                  />
                } />
                <Route path="/today" children={
                  <TodayInnerPage
                    title="Today's cases"
                    lastUpdated={lastUpdated}
                  />
                } />
                <Route path="/heatmaps" children={
                  <HeatMapsInnerPage
                    title="Heatmaps"
                    lastUpdated={lastUpdated}
                  />
                } />
                <Route path="/table" children={
                  <DataTableInnerPage
                    title="Data Table"
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
      <Footer/>
    </Router>
    </>
  )
}

export default HomeInnerPage
