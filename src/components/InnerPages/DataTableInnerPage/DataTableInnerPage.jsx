import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { useLocation } from 'react-router-dom'

import ErrorInnerPage from '../ErrorInnerPage'
import LoadingInnerPage from '../LoadingInnerPage'
import DataUpdatedTimeStamp from '../../Nav/DataUpdatedTimeStamp'
import DataTable from './DataTable'
import { getDataTableCases } from '../../../modules/queries'

let tableSortParams = { sortKey: 'country', order: 'asc' }

const useUrlQuery = (loc) => {
  let urlParams = new URLSearchParams(loc.search)
  return urlParams
}

const DataTableInnerPage = ({ title, lastUpdated }) => {
  let location = useLocation()
  let query = useUrlQuery(location)

  const sortQueryParam = query.get('sort')
  const orderQueryParam = query.get('order')

  if (sortQueryParam && orderQueryParam) {
    tableSortParams = { sortKey: sortQueryParam, order: orderQueryParam }
  }

  const { loading, error, data } = useQuery(getDataTableCases)
  if (loading) return <LoadingInnerPage />
  if (error) return <ErrorInnerPage errorData={error} />

  const columns = [
    {
      key: 'country',
      name: 'Country',
      type: 'link',
    },
    {
      key: 'confirmed',
      name: 'Confirmed cases',
      type: 'number',
    },
    {
      key: 'confirmedCasesToday',
      name: 'Cases today',
      type: 'number',
    },
    {
      key: 'recovered',
      name: 'Recovered',
      type: 'number',
    },
    {
      key: 'deaths',
      name: 'Deaths',
      type: 'number',
    },
    {
      key: 'deathsToday',
      name: 'Deaths today',
      type: 'number',
    },
    {
      key: 'totalTests',
      name: 'Total tests',
      type: 'number',
    },
    {
      key: 'totalTestsPerThousand',
      name: 'Tests per 1000',
      type: 'number',
    },
    {
      key: 'totalVaccinations',
      name: 'Vaccinations',
      type: 'number',
    },
    {
      key: 'totalVaccinationsPerHundred',
      name: '% vaccinated',
      type: 'percentage',
    },
    {
      key: 'lastUpdate',
      name: 'Last updated',
      type: 'date',
    },
  ]

  return (
    <>
      <div id="global-page" className="">
        <h3>{title}</h3>
      </div>

      <div className="row">
        <DataUpdatedTimeStamp lastUpdated={lastUpdated} />
      </div>

      <div className="row">
        <DataTable
          sortConfig={tableSortParams}
          tableData={data.casesByLocationWithNoProvince}
          columnSchema={columns}
        />
      </div>
    </>
  )
}

export default DataTableInnerPage
