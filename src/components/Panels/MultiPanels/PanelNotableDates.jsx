import React from 'react'

import PanelNotableDate from '../PanelNotableDate'

const PanelNotableDates = ({ currentCases }) => {
  const countryScores = {
    firstCase: { count: null, day: currentCases.dateOfFirstCase },
    firstDeath: { count: null, day: currentCases.dateOfFirstDeath },
    highestCases: {
      count: currentCases.highestDailyConfirmed.count,
      day: currentCases.highestDailyConfirmed.date,
    },
    highestDeaths: {
      count: currentCases.highestDailyDeaths.count,
      day: currentCases.highestDailyDeaths.date,
    },
  }

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
