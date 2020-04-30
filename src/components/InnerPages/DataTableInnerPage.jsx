import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import {
  Link,
} from 'react-router-dom'
import * as timeago from 'timeago.js'
import DataUpdatedTimeStamp from '../Nav/DataUpdatedTimeStamp'

const getTopCases = () => gql`
  query {
    casesByLocationWithNoProvince {
      idKey
      country
      confirmed
      confirmedCasesToday
      active
      recovered
      deaths
      deathsToday
      lastUpdate
    }
  }
`

const DataTableInnerPage = ({ title, lastUpdated }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'country', direction: 'ascending' })

  const { loading, error, data } = useQuery(getTopCases())
  if (loading) return <p>Loading data for dashboard ...</p>
  if (error) return <p>{JSON.stringify(error, null, 2)}</p>

  const tableData = data.casesByLocationWithNoProvince

  const sortedItems = () => {
    let sortableItems = [...tableData]
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1
        }
        return 0
      })
    }
    return sortableItems
  }

  const requestSort = (key) => {
    let direction = 'ascending'
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const showLabel = (headerKey) => {
    let indicator = ''
    if (sortConfig.key === headerKey) {
      indicator = sortConfig.direction === 'ascending' ? '(↑)' : '(↓)'
    }
    return indicator
  }

  const applySelectedColumnStyle = (headerKey) => {
    let style = ''
    if (sortConfig.key === headerKey) {
      style = 'selectedForSortColumn'
    }
    return style
  }

  let sortedTableData = sortedItems(tableData)

  return (
    <>
      <div id="global-page" className="">
        <h3>{title}</h3>
      </div>

      <div className="row">
        <DataUpdatedTimeStamp lastUpdated={lastUpdated}/>
      </div>

      <div className="row">
        <div className="col-sm table-responsive">
          <table className="table table-sm table-hover sortable-data-table">
            <thead className="thead-light">
              <tr>
                <th scope="col" className="sortableTableHeader" onClick={() => requestSort('country')}>Country {showLabel('country')}</th>
                <th scope="col" className="sortableTableHeader" onClick={() => requestSort('confirmed')}>Confirmed cases {showLabel('confirmed')}</th>
                <th scope="col" className="sortableTableHeader" onClick={() => requestSort('confirmedCasesToday')}>Confrimed today {showLabel('confirmedCasesToday')}</th>
                <th scope="col" className="sortableTableHeader" onClick={() => requestSort('active')}>Active {showLabel('active')}</th>
                <th scope="col" className="sortableTableHeader" onClick={() => requestSort('recovered')}>Recovered {showLabel('recovered')}</th>
                <th scope="col" className="sortableTableHeader" onClick={() => requestSort('deaths')}>Deaths {showLabel('deaths')}</th>
                <th scope="col" className="sortableTableHeader" onClick={() => requestSort('deathsToday')}>Deaths today {showLabel('deathsToday')}</th>
                <th scope="col" className="sortableTableHeader" onClick={() => requestSort('lastUpdate')}>Last updated {showLabel('lastUpdate')}</th>
              </tr>
            </thead>
            <tbody>
              {sortedTableData.map((tableRow) => {
                return (
                  <tr key={tableRow.idKey}>
                    <th className={applySelectedColumnStyle('country')} scope="row"><Link to={tableRow.idKey}>{tableRow.country}</Link></th>
                    <td className={applySelectedColumnStyle('confirmed')}>{tableRow.confirmed}</td>
                    <td className={applySelectedColumnStyle('confirmedCasesToday')}>{tableRow.confirmedCasesToday}</td>
                    <td className={applySelectedColumnStyle('active')}>{tableRow.active}</td>
                    <td className={applySelectedColumnStyle('recovered')}>{tableRow.recovered}</td>
                    <td className={applySelectedColumnStyle('deaths')}>{tableRow.deaths}</td>
                    <td className={applySelectedColumnStyle('deathsToday')}>{tableRow.deathsToday}</td>
                    <td className={applySelectedColumnStyle('lastUpdate')}>{timeago.format(new Date(parseInt(tableRow.lastUpdate)))}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default DataTableInnerPage
