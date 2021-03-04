import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import * as timeago from 'timeago.js'
import { shortenString } from '../../../modules/string'

const setParams = (params) => {
  const searchParams = new URLSearchParams()
  searchParams.set('sort', params.sortKey)
  searchParams.set('order', params.order)
  return searchParams.toString()
}

const sortedItems = (tableData, sortConfig) => {
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

const requestSort = (sortKey, history, sortConfig) => {
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

const showLabel = (headerSortKey, sortConfig) => {
  let indicator = ''
  if (sortConfig.sortKey === headerSortKey) {
    indicator = sortConfig.order === 'asc' ? '(↑)' : '(↓)'
  }
  return indicator
}

const applySelectedColumnStyle = (headerSortKey, sortConfig) => {
  let style = ''
  if (sortConfig && sortConfig.sortKey === headerSortKey) {
    style = 'selectedForSortColumn'
  }
  return style
}

const applySelectedColumnHeaderStyle = (headerSortKey, sortConfig) => {
  let style = ''
  if (sortConfig && sortConfig.sortKey === headerSortKey) {
    style = 'sortableTableHeader sorted'
  } else {
    style = 'sortableTableHeader'
  }
  return style
}

const DataTable = ({ sortConfig, tableData, columnSchema }) => {
  let history = useHistory()

  let sortedTableData = sortedItems(tableData, sortConfig)

  return (
    <>
      <div className="col-sm table-responsive">
        <table className="table table-sm table-hover sortable-data-table">
          <thead className="thead-light">
            <tr>
              {columnSchema.map((colData) => {
                return (
                  <th
                    key={`colKey-${colData.key}`}
                    scope="col"
                    className={applySelectedColumnHeaderStyle(
                      colData.key,
                      sortConfig
                    )}
                    onClick={() =>
                      requestSort(colData.key, history, sortConfig)
                    }
                  >
                    {colData.name} {showLabel(colData.key, sortConfig)}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {sortedTableData.map((tableRow) => {
              return (
                <tr key={tableRow.idKey}>
                  {columnSchema.map((colData) => {
                    let percentageExtra =
                      colData.type === 'percentage' ? '%' : ''
                    let innerData = (
                      <>
                        {' '}
                        {tableRow[colData.key]
                          ? `${tableRow[
                              colData.key
                            ].toLocaleString()}${percentageExtra}`
                          : `0${percentageExtra}`}
                      </>
                    )
                    if (colData.type === 'link') {
                      innerData = (
                        <Link title={tableRow[colData.key]} to={tableRow.idKey}>
                          {shortenString(tableRow[colData.key], 19)}
                        </Link>
                      )
                    } else if (colData.type === 'date') {
                      innerData = (
                        <>
                          {timeago.format(
                            new Date(parseInt(tableRow[colData.key]))
                          )}
                        </>
                      )
                    }
                    return (
                      <td
                        key={`colsForRows-${colData.key}`}
                        className={applySelectedColumnStyle(
                          colData.key,
                          sortConfig
                        )}
                      >
                        {innerData}
                      </td>
                    )
                  })}
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
