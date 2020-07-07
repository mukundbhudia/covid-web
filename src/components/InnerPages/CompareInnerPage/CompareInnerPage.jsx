import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import DataUpdatedTimeStamp from '../../Nav/DataUpdatedTimeStamp'
import CompareSelectAndChart from '../CompareInnerPage/CompareSelectAndChart'

const getCountry = gql`
  query {
    casesByLocationWithNoProvince {
      idKey
      country
    }
  }
`

let initialComparisonCountries = []

const CompareInnerPage = ({ lastUpdated, countries,}) => {
  
  const { loading, error, data } = useQuery(getCountry)

  if (loading) return <p>Loading data for dashboard ...</p>
  if (error) return <p>{JSON.stringify(error, null, 2)}</p>

  initialComparisonCountries = data.casesByLocationWithNoProvince.filter((country, i) => {
    if (country.idKey === 'brazil' || country.idKey === 'germany') {
      country.checked = true
    } else {
      country.checked = false
    }
    return country
  }).sort((a, b) => {
    const countryA = a.country.toUpperCase();
    const countryB = b.country.toUpperCase();

    let comparison = 0;
    if (countryA > countryB) {
      comparison = 1;
    } else if (countryA < countryB) {
      comparison = -1;
    }
    return comparison;
  })

  return (
    <>
      <div id="global-page" className="">
        <h3>Compare countries</h3>
      </div>

      <div className="row">
        <DataUpdatedTimeStamp lastUpdated={lastUpdated}/>
      </div>

      <CompareSelectAndChart countries={initialComparisonCountries}/>

    </>
  )
}

export default CompareInnerPage
