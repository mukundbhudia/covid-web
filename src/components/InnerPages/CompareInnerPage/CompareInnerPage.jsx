import React from 'react'
import { useQuery } from '@apollo/react-hooks'

import ErrorInnerPage from '../ErrorInnerPage'
import DataUpdatedTimeStamp from '../../Nav/DataUpdatedTimeStamp'
import CompareSelectAndChart from '../CompareInnerPage/CompareSelectAndChart'
import { getCountryWithNoProvince } from '../../../modules/queries'

let initialComparisonCountries = []

const CompareInnerPage = ({ lastUpdated }) => {
  
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
