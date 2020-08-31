import React, { Fragment } from 'react'
import { Typeahead, Highlighter } from 'react-bootstrap-typeahead'
import {
  useHistory,
} from "react-router-dom"

import './InputSearch.css'

const generateOptionLabel = (option) => {
  let label = option.country
  if (option.province !== null) {
    label = label + ` - ${option.province}`
  }
  return label
}

const InputSearch = ({data}) => {
  const state = {
    disabled: false,
    dropup: false,
    flip: false,
    highlightOnlyResult: true,
    minLength: 2,
    open: undefined,
  }
  let history = useHistory()
  return (
    <>
      <Typeahead
        {...state}
        labelKey={generateOptionLabel}
        renderMenuItemChildren={(option, { text }) => {
          const label = generateOptionLabel(option)
          return(
            <Fragment>
                <Highlighter search={text}>
                  { label }
                </Highlighter>&nbsp;
                <span className="inputSearchBadge badge searchBadge-danger"> 
                  { option.confirmed.toLocaleString() }
                </span>
                <span className="inputSearchBadge badge searchBadge-primary">
                  { option.active.toLocaleString() }
                </span>
                <span className="inputSearchBadge badge searchBadge-success">
                  { option.recovered.toLocaleString() }
                </span>
                <span className="inputSearchBadge badge searchBadge-secondary">
                  { option.deaths.toLocaleString() }
                </span>
            </Fragment>
          )
        }}
        onChange={(selected) => {
          if (selected[0]) {
            history.push(`/${selected[0].idKey}`)
          }
        }}
        options={data}
        className="w-100" id="searchBox" type="text" placeholder="Search for a country, state, province..." aria-label="Search"
      />
    </>
  )
}

export default InputSearch
