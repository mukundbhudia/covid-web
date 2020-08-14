import React from 'react'

import PanelNotableDates from './PanelNotableDates'
import { calculateCaseScores } from '../../modules/numeric'

const MultiPanelNotableDates = ({ cases, currentCases }) => {
  const countryScores = calculateCaseScores(cases, currentCases)

  return (
    <>
      <div className="row">
        <div className="col-sm">
           <PanelNotableDates date={countryScores.firstCase} message="First case" />
        </div>
        <div className="col-sm">
          <PanelNotableDates date={countryScores.firstDeath} message="First death" />
        </div>
        <div className="col-sm">
          <PanelNotableDates date={countryScores.highestCases} message="Most cases" />
        </div>
        <div className="col-sm">
          <PanelNotableDates date={countryScores.highestDeaths} message="Most deaths" />
        </div>
      </div>
    </>
  )
}

export default MultiPanelNotableDates
