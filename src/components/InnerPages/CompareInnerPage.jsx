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
  { 
    idKey: 'us',
    countryName: 'US',
    checked: false,
  },
  { 
    idKey: 'brazil',
    countryName: 'Brazil',
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
  
  const { loading, error, data } = useQuery(getCountry, {
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
    setComparisonCountries(updatedCountryList)
  }

let cumulativeConfirmed
let cumulativeDeaths
let dailyConfirmedMovingAverage
let dailyDeathsMovingAverage

if (loading) {
  cumulativeConfirmed = (
    <MultiCountryTimeSeries
      chartTitle={ `Time series daily cases by day` }
      casesToHide={ {} }
      data={ [] }
      currentCases={ [] }
    />
  )
  cumulativeDeaths = cumulativeConfirmed
  dailyConfirmedMovingAverage = cumulativeConfirmed
  dailyDeathsMovingAverage = cumulativeConfirmed
} else if (error) {
  cumulativeConfirmed = (<p>{JSON.stringify(error, null, 2)}</p>)
  cumulativeDeaths = cumulativeConfirmed
  dailyConfirmedMovingAverage = cumulativeConfirmed
  dailyDeathsMovingAverage = cumulativeConfirmed
} else {
  let getCasesByIdKey = data && data.getManyCasesByIdKey
  const countryNamesAsList = getCasesByIdKey.map((caseByIdKey) => { return caseByIdKey.country }).join(', ')
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

  cumulativeConfirmed = (
    <MultiCountryTimeSeries
      chartTitle={ `Time series cumulative confirmed cases by day for ${countryNamesAsList}` }
      casesToHide={ {
        confirmed: false,
        deaths: true,
        confirmedToday: true,
        confirmedTodayMovingAverage: true,
        deathsToday: true,
        deathsTodayMovingAverage: true,
      } }
      data={ getCasesByIdKey }
      currentCases={ currentCases }
    />
  )

  cumulativeDeaths = (
    <MultiCountryTimeSeries
      chartTitle={ `Time series cumulative deaths by day for ${countryNamesAsList}` }
      casesToHide={ {
        confirmed: true,
        deaths: false,
        confirmedToday: true,
        confirmedTodayMovingAverage: true,
        deathsToday: true,
        deathsTodayMovingAverage: true,
      } }
      data={ getCasesByIdKey }
      currentCases={ currentCases }
    />
  )

  dailyConfirmedMovingAverage = (
    <MultiCountryTimeSeries
      chartTitle={ `Daily cumulative deaths by day for ${countryNamesAsList}` }
      casesToHide={ {
        confirmed: true,
        deaths: true,
        confirmedToday: true,
        confirmedTodayMovingAverage: false,
        deathsToday: true,
        deathsTodayMovingAverage: true,
      } }
      data={ getCasesByIdKey }
      currentCases={ currentCases }
    />
  )

  dailyDeathsMovingAverage = (
    <MultiCountryTimeSeries
      chartTitle={ `Daily cumulative deaths by day for ${countryNamesAsList}` }
      casesToHide={ {
        confirmed: true,
        deaths: true,
        confirmedToday: true,
        confirmedTodayMovingAverage: true,
        deathsToday: true,
        deathsTodayMovingAverage: false,
      } }
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
          <div className="row justify-content-center"><h6>Cumulative confirmed cases</h6></div>
          { cumulativeConfirmed }
        </div>
      </div>

      <div className="row">
        <div className="col-sm">
        <div className="row justify-content-center"><h6>Cumulative deaths</h6></div>
          { cumulativeDeaths }
        </div>
      </div>

      <div className="row">
        <div className="col-sm">
        <div className="row justify-content-center"><h6>Daily confirmed moving average</h6></div>
          { dailyConfirmedMovingAverage }
        </div>
      </div>

      <div className="row">
        <div className="col-sm">
        <div className="row justify-content-center"><h6>Daily deaths moving average</h6></div>
          { dailyDeathsMovingAverage }
        </div>
      </div>
    </>
  )
}

export default CompareInnerPage
