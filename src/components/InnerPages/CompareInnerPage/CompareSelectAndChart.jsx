import React, { useState } from 'react'
import CompareCharts from './CompareCharts'

const getCheckedCountries = (countries) => {
  return countries.filter((country) => {
    return country.checked
  }).map((country) => {
    return country.idKey
  })
}

const MAX_CHECKED_ALLOWED = 5

const CompareSelectAndChart = ({ countries,}) => {

  const [ comparisonCountries, setComparisonCountries] = useState(countries)

  const updateCountryList = (countries, checked, idKey) => {
    if (checked === true) {
      countries.forEach((country, i) => {
        if (country.idKey === idKey) {
          country.checked = checked
        }
      })
    } else {
      countries.forEach((country) => {
        if (country.idKey === idKey) {
          country.checked = checked
        }
      })
    }
    return countries
  }

  const tickCountryBox = (checked, idKey) => {
    let countriesToUpdate = [...comparisonCountries]
    const updatedCountryList = updateCountryList(countriesToUpdate, checked, idKey)
    setComparisonCountries(updatedCountryList)
  }

  return (
    <>
      <div className="row mb-4">
        <div className="col-sm">
          <p>Choose { MAX_CHECKED_ALLOWED } or fewer countries to compare with one another:</p>
          <div className="btn-toolbar justify-content-center" role="toolbar" aria-label="Toolbar with button groups">
            <div className="" data-toggle="buttons">
              {comparisonCountries.map((item, i) => {   
                return  (
                  <div key={item.idKey} className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`inlineCheckbox${i}`}
                      value={`option${i}`}
                      onChange={ changeEvent => { tickCountryBox(changeEvent.target.checked, item.idKey) } }
                      defaultChecked={ item.checked }
                      disabled={ (item.checked) || (getCheckedCountries(comparisonCountries).length < MAX_CHECKED_ALLOWED) ? false : true }
                    />
                    <label className="form-check-label" htmlFor={`inlineCheckbox${i}`}>{ item.country }</label>
                  </div>
                )
              } )}
            </div>
          </div>
        </div>
      </div>

      <CompareCharts countries={getCheckedCountries(comparisonCountries)}/>
    </>
  )
}

export default CompareSelectAndChart
