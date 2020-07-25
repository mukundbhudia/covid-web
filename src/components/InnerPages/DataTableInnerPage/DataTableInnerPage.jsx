import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import {
  useLocation,
} from 'react-router-dom'

import DataUpdatedTimeStamp from '../../Nav/DataUpdatedTimeStamp'
import DataTable from './DataTable'
import { getDataTableCases } from '../../../modules/queries'

let sortParams = { sortKey: 'country', order: 'asc' }

const useUrlQuery = (loc) => {
  let urlParams = new URLSearchParams(loc.search);
  return urlParams
}

const DataTableInnerPage = ({ title, lastUpdated }) => {
  let location = useLocation()
  let query = useUrlQuery(location)

  const sortQueryParam = query.get('sort')
  const orderQueryParam = query.get('order')

  if (sortQueryParam && orderQueryParam) {
    sortParams = { sortKey: sortQueryParam, order: orderQueryParam }
  }

  const { loading, error, data } = useQuery(getDataTableCases)
  if (loading) return <p>Loading data for dashboard ...</p>
  if (error) return <p>{JSON.stringify(error, null, 2)}</p>

  return (
    <>
      <div id="global-page" className="">
        <h3>{title}</h3>
      </div>

      <div className="row">
        <DataUpdatedTimeStamp lastUpdated={lastUpdated}/>
      </div>

      <div className="row">
        <DataTable sortConfig={sortParams} tableData={data.casesByLocationWithNoProvince}/>
      </div>
    </>
  )
}

export default DataTableInnerPage
