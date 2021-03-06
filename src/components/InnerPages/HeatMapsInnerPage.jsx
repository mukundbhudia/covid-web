import React, { useState, useEffect } from 'react'
import {
  useHistory,
  useLocation,
} from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'

import ErrorInnerPage from './ErrorInnerPage'
import LoadingInnerPage from './LoadingInnerPage'
import DataUpdatedTimeStamp from '../Nav/DataUpdatedTimeStamp'
import WorldHeatMap from '../WorldHeatMap/WorldHeatMap'
import { getHeatMapCases } from '../../modules/queries'

const caseMaps = {
  confirmed: {
    label: 'Confirmed',
    lightColour: "#fee0d2",
    darkColour:"#de2d26",
    textClassName: 'confirmedText'
  },
  active: {
    label: 'Active',
    lightColour: "#deebf7",
    darkColour:"#3182bd",
    textClassName: 'activeText'
  },
  recovered: {
    label: 'Recovered',
    lightColour: "#e5f5e0",
    darkColour:"#31a354",
    textClassName: 'recoveredText'
  },
  deaths: {
    label: 'Deaths',
    lightColour: "#f0f0f0",
    darkColour:"#636363",
    textClassName: 'deathsText'
  },
  confirmedCasesToday: {
    label: 'Confirmed today',
    lightColour: "#efedf5",
    darkColour:"#756bb1",
    textClassName: 'confirmedTodayText'
  },
  deathsToday: {
    label: 'Deaths today',
    lightColour: "#fff7bc",
    darkColour:"#d95f0e",
    textClassName: 'deathsTodayText'
  },
}

let caseTypeState = 'confirmed'

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

const HeatMapsInnerPage = ({ title, lastUpdated }) => {
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
        setCaseType('confirmed')
      }
    })
  }, [caseType, history])

  const { loading, error, data } = useQuery(getHeatMapCases)
  if (loading) return <LoadingInnerPage/>
  if (error) return <ErrorInnerPage errorData={error} />

  const setMapType = (mapType) => {
    if (caseType !== mapType) {
      setCaseType(mapType)
      history.push(`?${setParams({ mapType }, 'mapType')}`)
    }
  }

  const casesByLocationWithNoProvince = data.casesByLocationWithNoProvince

  return (
    <>
      <div id="global-page" className="">
        <h3>{title}</h3>
      </div>
      <div className="row">
        <DataUpdatedTimeStamp lastUpdated={lastUpdated}/>
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
    </>
  )
}

export default HeatMapsInnerPage
