import React from 'react'
import {
  Link,
} from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import ProvincesBarGraph from '../Charts/ProvincesBarGraph'

const getProvincesGivenCountryName = (countryName) => gql`
  query {
    getProvincesGivenCountryName(country: "${countryName}") {
      province
      idKey
      active
      confirmed
      deaths
      confirmedCasesToday
      deathsToday
      recovered
    }
  }
`

const ProvincesMenu = ({ countryName, idKey }) => {
  const { loading, error, data } = useQuery(getProvincesGivenCountryName(countryName))
  if (loading) return <p>Loading provinces data ...</p>
  if (error) return <p>{JSON.stringify(error, null, 2)}</p>

  let provinceList = []
  if (data) {
    let countryAsProvince = [{ idKey: countryName.replace(/,/g, '').replace(/\s+/g, '-').toLowerCase(), province: countryName}]
    provinceList = countryAsProvince.concat(data.getProvincesGivenCountryName)
  }

  return (
    <>
      <div className="row">
        <div className="col-sm provinceNav">
          {provinceList.length > 0 &&
            <ul className="nav">
              {provinceList.map((provinceKey, i) => {
                let className = "nav-item provinceNavLink"
                if (provinceKey.idKey === idKey) {
                  className = "nav-item provinceNavLink active disabled"
                }
                return (<li className={className} key={i}>
                <Link className="nav-link" to={provinceKey.idKey}>{`${provinceKey.province}`}</Link>
              </li>)
              })}
            </ul>
          }
        </div>
      </div>
      <div className="row">
        <ProvincesBarGraph countryName={countryName} data={provinceList} id="provinceBarChart"/>
      </div>
    </>
  )
}

export default ProvincesMenu
