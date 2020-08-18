import React from 'react'

import PanelNotableDates from './PanelNotableDates'
import { calculateCaseScores } from '../../modules/numeric'

const MultiPanelNotableDates = ({ cases, currentCases }) => {
  const countryScores = calculateCaseScores(cases, currentCases)

  return (
    <>
      <div className="row">
        <div className="col-sm">
           <PanelNotableDates
            data={countryScores.firstCase}
            message="First case"
          />
        </div>
        <div className="col-sm">
          <PanelNotableDates
            data={countryScores.firstDeath}
            message="First death"
          />
        </div>
        <div className="col-sm">
          <PanelNotableDates
            data={countryScores.highestCases}
            message="Most cases"
          />
        </div>
        <div className="col-sm">
          <PanelNotableDates
            data={countryScores.highestDeaths}
            message="Most deaths"
          />
        </div>
      </div>
    </>
  )
}

export default MultiPanelNotableDates
