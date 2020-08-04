import React from 'react'
import { useQuery } from '@apollo/react-hooks'

import ErrorInnerPage from '../ErrorInnerPage'
import DataUpdatedTimeStamp from '../../Nav/DataUpdatedTimeStamp'
import CompareSelectAndChart from '../CompareInnerPage/CompareSelectAndChart'
import { getCountryWithNoProvince } from '../../../modules/queries'

let initialComparisonCountries = []

const CompareInnerPage = ({ lastUpdated, countries,}) => {
  
  const { loading, error, data } = useQuery(getCountryWithNoProvince)

  if (loading) return <p>Loading data for dashboard ...</p>
  if (error) return <ErrorInnerPage errorData={error} />

  initialComparisonCountries = data.casesByLocationWithNoProvince.filter((country, i) => {
    if (country.idKey === 'germany' || 
        country.idKey === 'mexico' ||
        country.idKey === 'peru' || 
        country.idKey === 'south-africa'
    ) {
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
