import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import DataUpdatedTimeStamp from '../Nav/DataUpdatedTimeStamp'
import PanelTopX from '../Panels/PanelTopX'

const getTopCases = gql`
query TopCases($limit: Int!) {
    topXconfirmedByCountry(limit: $limit) {
      country
      confirmed
    }
    topXactiveByCountry(limit: $limit) {
      country
      active
    }
    topXrecoveredByCountry(limit: $limit) {
      country
      recovered
    }
    topXdeathsByCountry(limit: $limit) {
      country
      deaths
    }
  }
`

const topCaseOptions = [ 5, 10, 15, 20 ]

const TopCasesInnerPage = ({ lastUpdated, }) => {
  const [ topLimit, setTopLimit] = useState(topCaseOptions[1])
  const { loading, error, data, client } = useQuery(getTopCases, {
    variables: { limit: topLimit },
  })

  if (loading) return <p>Loading data for dashboard ...</p>
  if (error) return <p>{JSON.stringify(error, null, 2)}</p>

  const prefetchTopCases = () => {
    topCaseOptions.forEach(topCaseLimit => {
      client.query({
        query: getTopCases,
        variables: { limit: topCaseLimit },
      })
    })
  }

  const topXdata = {
    topXconfirmedByCountry: {data: data.topXconfirmedByCountry, label: `Top ${topLimit} confirmed by country`},
    topXactiveByCountry: {data: data.topXactiveByCountry, label: `Top ${topLimit} active by country`},
    topXrecoveredByCountry: {data: data.topXrecoveredByCountry, label: `Top ${topLimit} recovered by country`},
    topXdeathsByCountry: {data: data.topXdeathsByCountry, label: `Top ${topLimit} deaths by country`},
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
            <div className="btn-group btn-group-toggle mr-1" data-toggle="buttons" onMouseOver={() => {prefetchTopCases()}}>
              {topCaseOptions.map((item) => {
                return  (
                <label key={item} className={`btn btn-sm btn-light ${topLimit === item ? 'active' : ''}`}>
                  <input type="radio" name="chart-type" onClick={() => {setTopLimit(item)}}/> Top {item}
                </label>
                )
              } )}
            </div>
          </div>
        </div>
      </div>

      <div className="top-tab-container">
        <PanelTopX data={topXdata} />
      </div>
    </>
  )
}

export default TopCasesInnerPage
