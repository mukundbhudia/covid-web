import React from 'react'

import PanelNotableDate from '../PanelNotableDate'
import { calculateCaseScores } from '../../../modules/numeric'

const PanelNotableDates = ({ cases, currentCases }) => {
  const countryScores = calculateCaseScores(cases, currentCases)

  return (
    <>
      <div className="row">
        <div className="col-sm">
           <PanelNotableDate
            data={countryScores.firstCase}
            message="First case"
          />
        </div>
        <div className="col-sm">
          <PanelNotableDate
            data={countryScores.firstDeath}
            message="First death"
          />
        </div>
        <div className="col-sm">
          <PanelNotableDate
            data={countryScores.highestCases}
            message="Most cases"
          />
        </div>
        <div className="col-sm">
          <PanelNotableDate
            data={countryScores.highestDeaths}
            message="Most deaths"
          />
        </div>
      </div>
    </>
  )
}

export default PanelNotableDates
