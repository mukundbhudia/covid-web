import React, { useState, useEffect } from 'react'
import {
  useHistory,
  useLocation,
} from 'react-router-dom'
import TopXBarGraph from '../Charts/TopXBarGraph'
import { useQuery } from '@apollo/react-hooks'

import DataUpdatedTimeStamp from '../Nav/DataUpdatedTimeStamp'
import PanelConfirmedToday from '../Panels/PanelConfirmedToday'
import PanelDeathsToday from '../Panels/PanelDeathsToday'
import WorldHeatMap from '../WorldHeatMap/WorldHeatMap'
import { getTodayTopCases } from '../../modules/queries'

const isGreaterThanZero = (array, key) => {
  return array.filter((element) => { return element[key] > 0 })
}

const caseMaps = {
  confirmedCasesToday: {
    label: 'Confirmed cases today',
    lightColour: "#efedf5",
    darkColour:"#756bb1",
    textClassName: 'confirmedTodayText'
  },
  deathsToday: {
    label: 'Confirmed deaths today',
    lightColour: "#fff7bc",
    darkColour:"#d95f0e",
    textClassName: 'deathsTodayText'
  },
}

let caseTypeState = 'confirmedCasesToday'

const validateQueryParams = (objectsToCheck, paramKeyGiven) => {
  const objectKeys = Object.keys(objectsToCheck)
  const isValidQueryParam = objectKeys.includes(paramKeyGiven)
  if (isValidQueryParam) {
    return paramKeyGiven
  } else {
    return objectKeys[0]
  }
}

const getUrlQuery = (loc, paramToGet) => {
  const urlParams = new URLSearchParams(loc.search);
  return urlParams.get(paramToGet)
}

const setParams = (params, paramToSet) => {
  const searchParams = new URLSearchParams()
  searchParams.set(paramToSet, params.mapType)
  return searchParams.toString()
}

const TodayInnerPage = ({ title, lastUpdated }) => {
  let location = useLocation()
  let history = useHistory()
  const mapTypeQueryParam = getUrlQuery(location, 'mapType')

  if (mapTypeQueryParam) {
    caseTypeState = validateQueryParams(caseMaps, mapTypeQueryParam)
  }
  const [ caseType, setCaseType] = useState(caseTypeState)

  useEffect(() => {
    return history.listen((location) => {
      const mapTypeQueryParam = getUrlQuery(location, 'mapType')
      let mapType = null
    
      if (mapTypeQueryParam) {
        try {
          mapType = validateQueryParams(caseMaps, mapTypeQueryParam)
        } catch (error) {
          console.error(error)
        }
      }

      if ( mapType ) {
        setCaseType(mapType)
      } else {
        setCaseType('confirmedCasesToday')
      }
    })
  }, [caseType, history])

  const { loading, error, data } = useQuery(getTodayTopCases)
  if (loading) return <p>Loading data for dashboard ...</p>
  if (error) return <p>{JSON.stringify(error, null, 2)}</p>

  const setMapType = (mapType) => {
    if (caseType !== mapType) {
      setCaseType(mapType)
      history.push(`?${setParams({ mapType }, 'mapType')}`)
    }
  }

  const totalCases = data.totalCases
  const casesByLocationWithNoProvince = data.casesByLocationWithNoProvince

  return (
    <>
      <div id="global-page" className="">
        <h3>{title} | {(new Date()).toLocaleDateString()}</h3>
      </div>

      <div className="row">
        <DataUpdatedTimeStamp lastUpdated={lastUpdated}/>
      </div>

      <div className="row">
        <div className="col-sm">
          <PanelConfirmedToday caseCount={totalCases.confirmedCasesToday}/>
        </div>
        <div className="col-sm">
          <PanelDeathsToday caseCount={totalCases.deathsToday}/>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-sm">
          <div className="btn-toolbar justify-content-center" role="toolbar" aria-label="Toolbar with button groups">
            <div className="btn-group btn-group-toggle mr-1" data-toggle="buttons">
              {Object.keys(caseMaps).map((caseKey) => {
                const item = caseMaps[caseKey]
                return  (
                <label key={item.label} className={`btn btn-sm btn-light ${caseType === caseKey ? 'active' : ''}`}>
                  <input type="radio" name="chart-type" onClick={() => { setMapType(caseKey) }}/>{item.label}
                </label>
                )
              } )}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm">
          <WorldHeatMap
            mapDataLabel="Cases"
            caseType={caseType}
            date={caseType}
            data={casesByLocationWithNoProvince}
            lightColour={caseMaps[caseType].lightColour}
            darkColour={caseMaps[caseType].darkColour}
          />
        </div>
      </div>

      <div className="row multiTopBar">
        <TopXBarGraph
          data={isGreaterThanZero(data.topXconfirmedTodayByCountry, 'confirmedCasesToday')}
          id="top10confirmedToday"
          chartTitle="Top 10 confirmed cases today by country"
          chartLabel="Confirmed cases today"
          chartLabelKey="confirmedCasesToday"
          labelColor="purple"
        />

        <TopXBarGraph
          data={isGreaterThanZero(data.topXdeathsTodayByCountry, 'deathsToday')}
          id="top10deathsToday"
          chartTitle="Top 10 deaths today by country"
          chartLabel="Deaths today"
          chartLabelKey="deathsToday"
          labelColor="yellow"
        />
      </div>
    </>
  )
}

export default TodayInnerPage
