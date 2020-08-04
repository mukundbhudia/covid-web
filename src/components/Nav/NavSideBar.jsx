import {
  Link,
} from 'react-router-dom'

import React from 'react'
import NavLink from './NavLink'

const NavSideBar = ({ casesByLocation }) => {

  return (
    <>
    <nav className="col-md-2 d-none d-md-block sidebar">
      <div className="sidebar-sticky">
        <ul className="nav flex-column">
          <li className="nav-item">
            <NavLink path="/" label="Global" icon="home"/>
          </li>
          <li className="nav-item">
            <NavLink path="/today" label="Today" icon="chart"/>
          </li>
          <li className="nav-item">
            <NavLink path="/top-cases" label="Top&nbsp;cases" icon="chart"/>
          </li>
          <li className="nav-item">
            <NavLink path="/compare" label="Compare" icon="chart"/>
          </li>
          <li className="nav-item">
            <NavLink path="/heatmaps" label="Heatmaps" icon="report"/>
          </li>
          <li className="nav-item">
            <NavLink path="/table" label="Data&nbsp;table" icon="report"/>
          </li>
        </ul>

        <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
          <span>Reports by country</span>
        </h6>
        <ul className="nav flex-column mb-2">
          {casesByLocation && casesByLocation.sort((a, b) => {
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
    </>
  )
}

export default NavSideBar
