import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import * as timeago from 'timeago.js'
import { shortenString } from '../../../modules/string'
import { calculatePercentageWithDp } from '../../../modules/numeric'

const setParams = (params) => {
  const searchParams = new URLSearchParams()
  searchParams.set('sort', params.sortKey)
  searchParams.set('order', params.order)
  return searchParams.toString()
}

const DataTable = ({ sortConfig, tableData }) => {
  let history = useHistory()

  // Calculate percentage of people vaccinated
  tableData = tableData.map((data) => {
    let percentage =
      data.peopleFullyVaccinated && data.peopleFullyVaccinated >= 0
        ? calculatePercentageWithDp(
            data.peopleFullyVaccinated,
            data.population,
            2
          )
        : 0
    percentage = parseFloat(percentage)
    data.percentOfPeopleFullyVaccinated = percentage
    return data
  })

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
              <th
                scope="col"
                className={applySelectedColumnHeaderStyle('country')}
                onClick={() => requestSort('country')}
              >
                Country {showLabel('country')}
              </th>
              <th
                scope="col"
                className={applySelectedColumnHeaderStyle('confirmed')}
                onClick={() => requestSort('confirmed')}
              >
                Confirmed cases {showLabel('confirmed')}
              </th>
              <th
                scope="col"
                className={applySelectedColumnHeaderStyle(
                  'confirmedCasesToday'
                )}
                onClick={() => requestSort('confirmedCasesToday')}
              >
                Confrimed today {showLabel('confirmedCasesToday')}
              </th>
              <th
                scope="col"
                className={applySelectedColumnHeaderStyle('recovered')}
                onClick={() => requestSort('recovered')}
              >
                Recovered {showLabel('recovered')}
              </th>
              <th
                scope="col"
                className={applySelectedColumnHeaderStyle('deaths')}
                onClick={() => requestSort('deaths')}
              >
                Deaths {showLabel('deaths')}
              </th>
              <th
                scope="col"
                className={applySelectedColumnHeaderStyle('deathsToday')}
                onClick={() => requestSort('deathsToday')}
              >
                Deaths today {showLabel('deathsToday')}
              </th>
              <th
                scope="col"
                className={applySelectedColumnHeaderStyle('totalTests')}
                onClick={() => requestSort('totalTests')}
              >
                Total tests {showLabel('totalTests')}
              </th>
              <th
                scope="col"
                className={applySelectedColumnHeaderStyle(
                  'peopleFullyVaccinated'
                )}
                onClick={() => requestSort('peopleFullyVaccinated')}
              >
                Fully vaccinated {showLabel('peopleFullyVaccinated')}
              </th>
              <th
                scope="col"
                className={applySelectedColumnHeaderStyle(
                  'percentOfPeopleFullyVaccinated'
                )}
                onClick={() => requestSort('percentOfPeopleFullyVaccinated')}
              >
                % fully vaccinated {showLabel('percentOfPeopleFullyVaccinated')}
              </th>
              <th
                scope="col"
                className={applySelectedColumnHeaderStyle('lastUpdate')}
                onClick={() => requestSort('lastUpdate')}
              >
                Last updated {showLabel('lastUpdate')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedTableData.map((tableRow) => {
              return (
                <tr key={tableRow.idKey}>
                  <td className={applySelectedColumnStyle('country')}>
                    <Link title={tableRow.country} to={tableRow.idKey}>
                      {shortenString(tableRow.country, 19)}
                    </Link>
                  </td>
                  <td className={applySelectedColumnStyle('confirmed')}>
                    {tableRow.confirmed.toLocaleString()}
                  </td>
                  <td
                    className={applySelectedColumnStyle('confirmedCasesToday')}
                  >
                    {tableRow.confirmedCasesToday.toLocaleString()}
                  </td>
                  <td className={applySelectedColumnStyle('recovered')}>
                    {tableRow.recovered.toLocaleString()}
                  </td>
                  <td className={applySelectedColumnStyle('deaths')}>
                    {tableRow.deaths.toLocaleString()}
                  </td>
                  <td className={applySelectedColumnStyle('deathsToday')}>
                    {tableRow.deathsToday.toLocaleString()}
                  </td>
                  <td className={applySelectedColumnStyle('totalTests')}>
                    {tableRow.totalTests
                      ? tableRow.totalTests.toLocaleString()
                      : 0}
                  </td>
                  <td
                    className={applySelectedColumnStyle(
                      'peopleFullyVaccinated'
                    )}
                  >
                    {tableRow.peopleFullyVaccinated
                      ? tableRow.peopleFullyVaccinated.toLocaleString()
                      : 0}
                  </td>
                  <td
                    className={applySelectedColumnStyle(
                      'percentOfPeopleFullyVaccinated'
                    )}
                  >
                    {tableRow.percentOfPeopleFullyVaccinated
                      ? `${tableRow.percentOfPeopleFullyVaccinated}%`
                      : '0%'}
                  </td>
                  <td className={applySelectedColumnStyle('lastUpdate')}>
                    {timeago.format(new Date(parseInt(tableRow.lastUpdate)))}
                  </td>
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
