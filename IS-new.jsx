import React from 'react'
import {
  useHistory,
} from "react-router-dom"
import { Typeahead } from 'react-bootstrap-typeahead'
import './InputSearch.css'

const InputSearch = ({data}) => {
  const ref = React.createRef();
  const state = {
    disabled: false,
    dropup: false,
    flip: false,
    highlightOnlyResult: false,
    minLength: 2,
    open: undefined,
    // selectHintOnEnter: false,
  }

  const onBlur = (value) => {
    console.log(value);
    console.log(ref.current);
    
  }

  let history = useHistory()
    return (
      <>
        <Typeahead
          {...state}
          ref={ref}
          labelKey={(option) => {
            let label = option.country
            if (option.province !== null) {
              label = label + ` - ${option.province}`
            }
            return label
          }}
          onChange={(selected) => {
            if (selected[0]) {
              history.push(`/${selected[0].idKey}`)
            }
          }}
          onBlur={ onBlur }
          options={data}
          className="w-100" id="searchBox" type="text" placeholder="Search for a country, state, province..." aria-label="Search"
        />
      </>
    )
}

export default InputSearch
