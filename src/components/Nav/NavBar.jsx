import React, { useState } from 'react'
import NavLink from './NavLink'
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
              <NavLink path="/" label="Global"/>
            </li>
            <li className="nav-item">
              <NavLink path="/today" label="Today"/>
            </li>
            <li className="nav-item">
              <NavLink path="/vaccinations" label="Vaccinations"/>
            </li>
            <li className="nav-item">
              <NavLink path="/top-cases" label="Top&nbsp;cases"/>
            </li>
            <li className="nav-item">
              <NavLink path="/compare" label="Compare"/>
            </li>
            <li className="nav-item">
              <NavLink path="/heatmaps" label="Heatmaps"/>
            </li>
            <li className="nav-item">
              <NavLink path="/table" label="Data&nbsp;table"/>
            </li>
          </ul>
        </div>

        <InputSearch data={searchData}/>

      </nav>
    </>
  )
}

export default NavBar
