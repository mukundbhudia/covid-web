import React, { useState } from 'react'
import {
  Link,
} from 'react-router-dom'
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
              <Link className="nav-link" to="">Global <span className="sr-only">(current)</span></Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="today">Today</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="top-cases">Top&nbsp;cases</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="heatmaps">Heatmaps</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="table">Data&nbsp;table</Link>
            </li>
          </ul>
        </div>

        <InputSearch data={searchData}/>

      </nav>
    </>
  )
}

export default NavBar
