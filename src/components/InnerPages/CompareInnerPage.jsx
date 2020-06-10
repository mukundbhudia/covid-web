import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import DataUpdatedTimeStamp from '../Nav/DataUpdatedTimeStamp'
// import TimeSeries from '../Charts/TimeSeries'
import MultiCountryTimeSeries from '../Charts/MultiCountryTimeSeries'

const getCountry = gql`
  query GetCases($idKeys: [String]!) {
    getManyCasesByIdKey(idKeys: $idKeys){
      idKey
      country
      province
      confirmed
      active
      recovered
      deaths
      confirmedCasesToday
      deathsToday
      lastUpdate
      casesByDate {
        confirmed
        deaths
        confirmedCasesToday
        deathsToday
        day
      }
    }
  }
`

let initialComparisonCountries = [ 
  { 
    idKey: 'belgium',
    countryName: 'Belgium',
    checked: true,
  },
  { 
    idKey: 'italy',
    countryName: 'Italy',
    checked: false,
  },
  { 
    idKey: 'australia',
    countryName: 'Australia',
    checked: true,
  },
  { 
    idKey: 'bosnia-and-herzegovina',
    countryName: 'Bosnia and Herzegovina',
    checked: false,
  },
  { 
    idKey: 'qatar',
    countryName: 'Qatar',
    checked: false,
  },
]

const getCheckedCountries = (countries) => {
  return countries.filter((country) => {
    return country.checked
  }).map((country) => {
    return country.idKey
  })
}

const CompareInnerPage = ({ lastUpdated, }) => {
  const [ comparisonCountries, setComparisonCountries] = useState(getCheckedCountries(initialComparisonCountries))
  
  const { loading, error, data, client } = useQuery(getCountry, {
    variables: { idKeys: comparisonCountries },
  })

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
      list = newList
    }
    return list
  }

  const tickCountryBox = (checked, idKey) => {
    console.log(checked, idKey)
    setComparisonCountries(updateCountryList(checked, idKey))
  }

let content

if (loading) {
  content = (
    <MultiCountryTimeSeries
      chartTitle={ `Time series daily cases by day` }
      casesToHide={ {
        confirmed: false,
        deaths: false,
        confirmedToday: true,
        confirmedTodayMovingAverage: false,
        deathsToday: true,
        deathsTodayMovingAverage: false,
      } }
      data={ [] }
      currentCases={ [] }
    />
  )
} else if (error) {
  content = (<p>{JSON.stringify(error, null, 2)}</p>)
} else {
  let getCasesByIdKey = data && data.getManyCasesByIdKey
// console.log(getCasesByIdKey);

  const currentCases = getCasesByIdKey.map((caseByIdKey) => {
    return {
      idKey: caseByIdKey.idKey,
      country: caseByIdKey.country,
      confirmed: caseByIdKey.confirmed,
      active: caseByIdKey.active,
      recovered: caseByIdKey.recovered,
      deaths: caseByIdKey.deaths,
      confirmedCasesToday: caseByIdKey.confirmedCasesToday,
      deathsToday: caseByIdKey.deathsToday,
    }
  })

  content = (
    <MultiCountryTimeSeries
      chartTitle={ `Time series daily cases by day for ${getCasesByIdKey.map((caseByIdKey) => { return caseByIdKey.country }).join(', ')}` }
      casesToHide={ {} }
      data={ getCasesByIdKey }
      currentCases={ currentCases }
    />
  )
}

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
            <div className="btn-group btn-group-toggle mr-1" data-toggle="buttons">
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
                    />
                    <label className="form-check-label" htmlFor={`inlineCheckbox${i}`}>{ item.countryName }</label>
                  </div>
                )
              } )}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm">
          { content }
        </div>
      </div>
    </>
  )
}

export default CompareInnerPage
