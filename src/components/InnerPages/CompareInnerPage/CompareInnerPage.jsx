import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import DataUpdatedTimeStamp from '../../Nav/DataUpdatedTimeStamp'
// import TimeSeries from '../Charts/TimeSeries'
import MultiCountryTimeSeries from '../../Charts/MultiCountryTimeSeries'
import CompareCharts from '../CompareInnerPage/CompareCharts'

const getCountry = gql`
  query {
    casesByLocationWithNoProvince {
      idKey
      country
    }
  }
`

let initialComparisonCountries = ['brazil', 'nepal']

const getCheckedCountries = (countries) => {
  return countries.filter((country) => {
    return country.checked
  }).map((country) => {
    return country.idKey
  })
}

const MAX_CHECKED_ALLOWED = 5

const CompareInnerPage = ({ lastUpdated, countries,}) => {
  // initialComparisonCountries = countries
  const [ comparisonCountries, setComparisonCountries] = useState(['brazil', 'nepal'])
  
  const { loading, error, data } = useQuery(getCountry)

  if (loading) return <p>Loading data for dashboard ...</p>
  if (error) return <p>{JSON.stringify(error, null, 2)}</p>

  initialComparisonCountries = data.casesByLocationWithNoProvince.filter((country, i) => {
    if (i === 20 || i === 100) {    // TODO: compare with initialComparisonCountries
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
  // setComparisonCountries((getCheckedCountries(initialComparisonCountries)))

  const updateCountryList = (checked, idKey) => {
    let list = getCheckedCountries(initialComparisonCountries)
    if (checked === true) {
      initialComparisonCountries.forEach((country, i) => {
        if (country.idKey === idKey) {
          country.checked = checked
          list.push(idKey)
        }
      })
    } else {
      let newList = list.filter((comparisonIdKey) => {
        return comparisonIdKey !== idKey
      })
      initialComparisonCountries.forEach((country) => {
        if (country.idKey === idKey) {
          country.checked = checked
        }
      })
      list = newList
    }
    return list
  }

  const tickCountryBox = (checked, idKey) => {
    const updatedCountryList = updateCountryList(checked, idKey)
    console.log(updatedCountryList)
    // setComparisonCountries(updatedCountryList)
    // initialComparisonCountries = updateCountryList
  }
console.log(comparisonCountries);

  return (
    <>
      <div id="global-page" className="">
        <h3>Compare countries</h3>
      </div>

      <div className="row">
        <DataUpdatedTimeStamp lastUpdated={lastUpdated}/>
      </div>

      <div className="row mb-4">
        <div className="col-sm">
          <div className="btn-toolbar justify-content-center" role="toolbar" aria-label="Toolbar with button groups">
            <div className="" data-toggle="buttons">
              {initialComparisonCountries.map((item, i) => {   
                return  (
                  <div key={item.idKey} className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`inlineCheckbox${i}`}
                      value={`option${i}`}
                      onChange={ changeEvent => { tickCountryBox(changeEvent.target.checked, item.idKey) } }
                      defaultChecked={ item.checked }
                      disabled={ (item.checked) || (comparisonCountries.length < MAX_CHECKED_ALLOWED) ? false : true }
                    />
                    <label className="form-check-label" htmlFor={`inlineCheckbox${i}`}>{ item.country }</label>
                  </div>
                )
              } )}
            </div>
          </div>
        </div>
      </div>

      {/* <CompareCharts countries={getCheckedCountries(initialComparisonCountries)}/> */}
    </>
  )
}

export default CompareInnerPage
