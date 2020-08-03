import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'

import { useQuery } from '@apollo/react-hooks'

import './App.css'
import GlobalInnerPage from './components/InnerPages/GlobalInnerPage'
import CountryInnerPage from './components/InnerPages/CountryInnerPage'
import TopCasesInnerPage from './components/InnerPages/TopCasesInnerPage'
import TodayInnerPage from './components/InnerPages/TodayInnerPage'
import CountryNotFound from './components/InnerPages/CountryNotFound'
import Footer from './components/Nav/Footer';
import HeatMapsInnerPage from './components/InnerPages/HeatMapsInnerPage';
import NavBar from './components/Nav/NavBar';
import NavSideBar from './components/Nav/NavSideBar';
import DataTableInnerPage from './components/InnerPages/DataTableInnerPage/DataTableInnerPage'
import CompareInnerPage from './components/InnerPages/CompareInnerPage/CompareInnerPage'
import { COVID_TOTALS } from './modules/queries'

const App = () => {
  const { loading, error, data } = useQuery(COVID_TOTALS)
  if (loading) return <p>Loading data for dashboard ...</p>
  if (error) return <p>{JSON.stringify(error, null, 2)}</p>

  const lastUpdated = data.lastUpdated
  const casesByLocation = data.casesByLocation

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

export default App
