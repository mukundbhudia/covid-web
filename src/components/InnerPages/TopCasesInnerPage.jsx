import React, { useState } from 'react'
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

const useUrlQuery = (loc) => {
  let urlParams = new URLSearchParams(loc.search);
  return urlParams
}

const setParams = (params) => {
  const searchParams = new URLSearchParams()
  searchParams.set('top', params.limit)
  return searchParams.toString()
}

const TopCasesInnerPage = ({ lastUpdated, }) => {
  let history = useHistory()
  let location = useLocation()
  let query = useUrlQuery(location)
  const topCasesLimitQueryParam = query.get('top')

  if (topCasesLimitQueryParam) {
    try {
      const parsedTopCasesLimit = parseInt(topCasesLimitQueryParam)
      if (parsedTopCasesLimit && topCaseOptions.includes(parsedTopCasesLimit)) {
        defaultLimit = parsedTopCasesLimit
      }
    } catch (error) {
      console.error(error)
    }
  }
  const [ topLimit, setTopLimit] = useState(defaultLimit)

  const { loading, error, data, client } = useQuery(getTopCasesByLimit, {
    variables: { limit: topLimit },
  })

  if (loading) return <p>Loading data for dashboard ...</p>
  if (error) return <p>{JSON.stringify(error, null, 2)}</p>

  const setTopCasesLimit = (limit) => {
    if (topLimit !== limit) {
      setTopLimit(limit)
      history.push(`?${setParams({ limit })}`)
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
