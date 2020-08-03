import React, { useState, useEffect } from 'react'
import {
  useHistory,
  useLocation,
} from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'

import DataUpdatedTimeStamp from '../Nav/DataUpdatedTimeStamp'
import PanelTopX from '../Panels/PanelTopX'
import { getTopCasesByLimit } from '../../modules/queries'

const topCaseOptions = [ 5, 10, 15, 20 ]
let defaultLimit = topCaseOptions[1]

const validateQueryParams = (objectsToCheck, paramKeyGiven) => {
  try {
    const paramAsInt = parseInt(paramKeyGiven)
    const isValidQueryParam = objectsToCheck.includes(paramAsInt)
    if (isValidQueryParam) {
      return paramAsInt
    } else {
      return objectsToCheck[1]
    }
  } catch (error) {
    console.error(error)
    return objectsToCheck[1]
  }
}

const getUrlQuery = (loc, paramToGet) => {
  const urlParams = new URLSearchParams(loc.search);
  return urlParams.get(paramToGet)
}

const setParams = (params, paramToSet) => {
  const searchParams = new URLSearchParams()
  searchParams.set(paramToSet, params.limit)
  return searchParams.toString()
}

const TopCasesInnerPage = ({ lastUpdated, }) => {
  let history = useHistory()
  let location = useLocation()
  const topCasesLimitQueryParam = getUrlQuery(location, 'top')

  if (topCasesLimitQueryParam) {
    defaultLimit = validateQueryParams(topCaseOptions, topCasesLimitQueryParam)
  }

  const [ topLimit, setTopLimit] = useState(defaultLimit)
  useEffect(() => {
    return history.listen((location) => {
      const topCasesLimitQueryParam = getUrlQuery(location, 'top')
      let topCasesLimit = null
    
      if (topCasesLimitQueryParam) {
        try {
          topCasesLimit = validateQueryParams(topCaseOptions, topCasesLimitQueryParam)
        } catch (error) {
          console.error(error)
        }
      }

      if ( topCasesLimit ) {
        setTopLimit(topCasesLimit)
      } else {
        setTopLimit(10)
      }
    })
  }, [history, topLimit])

  const { loading, error, data, client } = useQuery(getTopCasesByLimit, {
    variables: { limit: topLimit },
  })

  if (loading) return <p>Loading data for dashboard ...</p>
  if (error) return <p>{JSON.stringify(error, null, 2)}</p>

  const setTopCasesLimit = (limit) => {
    if (topLimit !== limit) {
      setTopLimit(limit)
      history.push(`?${setParams({ limit }, 'top')}`)
    }
  }

  const prefetchTopCases = () => {
    topCaseOptions.forEach(topCaseLimit => {
      client.query({
        query: getTopCasesByLimit,
        variables: { limit: topCaseLimit },
      })
    })
  }

  const topXdata = {
    topXconfirmedByCountry: {
      data: data.topXconfirmedByCountry,
      label: `Top ${topLimit} confirmed by country`,
    },
    topXactiveByCountry: {
      data: data.topXactiveByCountry,
      label: `Top ${topLimit} active by country`,
    },
    topXrecoveredByCountry: {
      data: data.topXrecoveredByCountry,
      label: `Top ${topLimit} recovered by country`,
    },
    topXdeathsByCountry: {
      data: data.topXdeathsByCountry,
      label: `Top ${topLimit} deaths by country`,
    },
    topXconfirmedTodayByCountry: {
      data: data.topXconfirmedTodayByCountry,
      label: `Top ${topLimit} confirmed cases today by country`,
    },
    topXdeathsTodayByCountry: {
      data: data.topXdeathsTodayByCountry,
      label: `Top ${topLimit} deaths today by country`,
    },
  }

  return (
    <>
      <div id="global-page" className="">
        <h3>Top {topLimit} cases globally</h3>
      </div>

      <div className="row">
        <DataUpdatedTimeStamp lastUpdated={lastUpdated}/>
      </div>

      <div className="row mb-4">
        <div className="col-sm">
          <div className="btn-toolbar justify-content-center" role="toolbar" aria-label="Toolbar with button groups">
            <div className="btn-group btn-group-toggle mr-1" data-toggle="buttons" onMouseOver={() => { prefetchTopCases() }}>
              {topCaseOptions.map((item) => {
                return  (
                <label key={item} className={`btn btn-sm btn-light ${topLimit === item ? 'active' : ''}`}>
                  <input type="radio" name="chart-type" onClick={() => { setTopCasesLimit(item) }}/> Top {item}
                </label>
                )
              } )}
            </div>
          </div>
        </div>
      </div>

      <div className="top-tab-container">
        <PanelTopX data={topXdata} includeToday={true} />
      </div>
    </>
  )
}

export default TopCasesInnerPage
