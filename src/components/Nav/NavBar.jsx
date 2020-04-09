import React, { useState } from 'react'
import InputSearch from './InputSearch/InputSearch'


const NavBar = ({ searchData }) => {
  const [ collapsed, setCollapsed] = useState(true)
  let classOne = collapsed ? 'collapse navbar-collapse' : 'collapse navbar-collapse show'
  let classTwo = collapsed ? 'navbar-toggler collapsed' : 'navbar-toggler'

  const toggleNavbar = () => {
    if (collapsed === true) {
      setCollapsed(false)
    } else {
      setCollapsed(true)
    }
  }

  return (
    <>
      <nav className="navbar navbar-expand-sm fixed-top navbar-dark bg-dark flex-md-nowrap p-0 shadow">

        <a className="navbar-brand" href={`${process.env.PUBLIC_URL}/`}>COVID-19 Dashboard</a>

        <button onClick={() => { toggleNavbar() }} className={`${classTwo}`} type="button" data-toggle="collapse" data-target="#navbarsExample04" aria-controls="navbarsExample04" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`${classOne}`} id="navbarsExample04">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <a className="nav-link" href={`${process.env.PUBLIC_URL}/today`}>Today <span className="sr-only">(current)</span></a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href={`${process.env.PUBLIC_URL}/top-cases`}>Top&nbsp;cases</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href={`${process.env.PUBLIC_URL}/heatmaps`}>Heatmaps</a>
            </li>
          </ul>
        </div>

        <InputSearch data={searchData}/>

      </nav>
    </>
  )
}

export default NavBar
