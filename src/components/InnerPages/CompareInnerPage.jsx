import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import DataUpdatedTimeStamp from '../Nav/DataUpdatedTimeStamp'
import TimeSeries from '../Charts/TimeSeries'

const getCountry = gql`
  query GetCases($idKey: String!) {
    getCasesByIdKey(idKey: $idKey){
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

let initialComparisonIdKeys = [ 
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

const CompareInnerPage = ({ lastUpdated, }) => {
  const [ comparisonIdKeys, setComparisonIdKeys] = useState(initialComparisonIdKeys)
  initialComparisonIdKeys = comparisonIdKeys
  let id = comparisonIdKeys[0].idKey
  const { loading, error, data, client } = useQuery(getCountry, {
    variables: { idKey: id },
  })

  if (loading) return <p>Loading data for dashboard ...</p>
  if (error) return <p>{JSON.stringify(error, null, 2)}</p>

  let getCasesByIdKey = data && data.getCasesByIdKey[0]

  // const prefetchTopCases = () => {
  //   topCaseOptions.forEach(topCaseLimit => {
  //     client.query({
  //       query: getCountry,
  //       variables: { limit: topCaseLimit },
  //     })
  //   })
  // }

  const currentCases = {
    confirmed: getCasesByIdKey.confirmed,
    active: getCasesByIdKey.active,
    recovered: getCasesByIdKey.recovered,
    deaths: getCasesByIdKey.deaths,
    confirmedCasesToday: getCasesByIdKey.confirmedCasesToday,
    deathsToday: getCasesByIdKey.deathsToday,
  }

  const tickCountryBox = (checked, idKey) => {
    console.log(checked, idKey)
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
              {comparisonIdKeys.map((item, i) => {
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

      {getCasesByIdKey.casesByDate &&
        <div className="row">
          <div className="col-sm">
            <TimeSeries
              chartTitle={ `Time series daily cases by day for ${getCasesByIdKey.country}` }
              casesToHide={ {
                confirmed: false,
                deaths: false,
                confirmedToday: true,
                confirmedTodayMovingAverage: true,
                deathsToday: true,
                deathsTodayMovingAverage: true,
              } }
              data={getCasesByIdKey.casesByDate}
              currentCases={currentCases}
            />
          </div>
        </div>
      }

      {getCasesByIdKey.casesByDate &&
        <div className="row">
          <div className="col-sm">
            <TimeSeries
              chartTitle={ `Time series daily cases by day for ${getCasesByIdKey.country}` }
              casesToHide={ {
                confirmed: true,
                deaths: true,
                confirmedToday: false,
                confirmedTodayMovingAverage: false,
                deathsToday: false,
                deathsTodayMovingAverage: false,
              } }
              data={getCasesByIdKey.casesByDate}
              currentCases={currentCases}
            />
          </div>
        </div>
      }
    </>
  )
}

export default CompareInnerPage
