import React from 'react'
import {
  Link,
  useHistory,
} from 'react-router-dom'
import * as timeago from 'timeago.js'

const setParams = (params) => {
  const searchParams = new URLSearchParams()
  searchParams.set("sort", params.sortKey)
  searchParams.set("order", params.order)
  return searchParams.toString()
}

const DataTable = ({ sortConfig, tableData }) => {
  let history = useHistory()

  const sortedItems = () => {
    let sortableItems = [...tableData]
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.sortKey] < b[sortConfig.sortKey]) {
          return sortConfig.order === 'asc' ? -1 : 1
        }
        if (a[sortConfig.sortKey] > b[sortConfig.sortKey]) {
          return sortConfig.order === 'asc' ? 1 : -1
        }
        return 0
      })
    }
    return sortableItems
  }

  const requestSort = (sortKey) => {
    let order = 'asc'
    if (
      sortConfig &&
      sortConfig.sortKey === sortKey &&
      sortConfig.order === 'asc'
    ) {
      order = 'desc'
    }
    history.push(`?${setParams({ sortKey, order })}`)
  }

  const showLabel = (headerSortKey) => {
    let indicator = ''
    if (sortConfig.sortKey === headerSortKey) {
      indicator = sortConfig.order === 'asc' ? '(↑)' : '(↓)'
    }
    return indicator
  }

  const applySelectedColumnStyle = (headerSortKey) => {
    let style = ''
    if (sortConfig.sortKey === headerSortKey) {
      style = 'selectedForSortColumn'
    }
    return style
  }

  const applySelectedColumnHeaderStyle = (headerSortKey) => {
    let style = ''
    if (sortConfig.sortKey === headerSortKey) {
      style = 'sortableTableHeader sorted'
    } else {
      style = 'sortableTableHeader'
    }
    return style
  }

  let sortedTableData = sortedItems(tableData)

  return (
    <>
      <div className="col-sm table-responsive">
        <table className="table table-sm table-hover sortable-data-table">
          <thead className="thead-light">
            <tr>
              <th scope="col" className={applySelectedColumnHeaderStyle('country')} onClick={() => requestSort('country')}>Country {showLabel('country')}</th>
              <th scope="col" className={applySelectedColumnHeaderStyle('confirmed')} onClick={() => requestSort('confirmed')}>Confirmed cases {showLabel('confirmed')}</th>
              <th scope="col" className={applySelectedColumnHeaderStyle('confirmedCasesToday')} onClick={() => requestSort('confirmedCasesToday')}>Confrimed today {showLabel('confirmedCasesToday')}</th>
              <th scope="col" className={applySelectedColumnHeaderStyle('active')} onClick={() => requestSort('active')}>Active {showLabel('active')}</th>
              <th scope="col" className={applySelectedColumnHeaderStyle('recovered')} onClick={() => requestSort('recovered')}>Recovered {showLabel('recovered')}</th>
              <th scope="col" className={applySelectedColumnHeaderStyle('deaths')} onClick={() => requestSort('deaths')}>Deaths {showLabel('deaths')}</th>
              <th scope="col" className={applySelectedColumnHeaderStyle('deathsToday')} onClick={() => requestSort('deathsToday')}>Deaths today {showLabel('deathsToday')}</th>
              <th scope="col" className={applySelectedColumnHeaderStyle('lastUpdate')} onClick={() => requestSort('lastUpdate')}>Last updated {showLabel('lastUpdate')}</th>
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
    </>
  )
}

export default DataTable
