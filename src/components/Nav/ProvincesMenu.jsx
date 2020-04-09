import React from 'react'

import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'

const getProvincesGivenCountryName = (countryName) => gql`
  query {
    getProvincesGivenCountryName(country: "${countryName}") {
      idKey
      province
    }
  }
`

const ProvincesMenu = ({ countryName, idKey }) => {
  const { loading, error, data } = useQuery(getProvincesGivenCountryName(countryName))
  if (loading) return <p>Loading provinces data ...</p>
  if (error) return <p>{JSON.stringify(error, null, 2)}</p>

  let provinceList = data && data.getProvincesGivenCountryName
  provinceList.push({ idKey: countryName.replace(/,/g, '').replace(/\s+/g, '-').toLowerCase(), province: countryName})

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
                <a className="nav-link" href={`${process.env.PUBLIC_URL}/${provinceKey.idKey}`}>{`${provinceKey.province}`}</a>
              </li>)
              })}
            </ul>
          }
        </div>
      </div> 
    </>
  )
}

export default ProvincesMenu
