import React from 'react'

import PanelConfirmedCount from '../PanelConfirmedCount'
import PanelActiveCount from '../PanelActiveCount'
import PanelRecoveredCount from '../PanelRecoveredCount'
import PanelDeathCount from '../PanelDeathCount'
import PanelConfirmedToday from '../PanelConfirmedToday'
import PanelDeathsToday from '../PanelDeathsToday'
import PanelNotableDates from './PanelNotableDates'
import PanelConfirmedVsActive from '../PanelConfirmedVsActive'
import PanelRecoveriesVsDeaths from '../PanelRecoveriesVsDeaths'
import PanelVaccinatedWithPercent from '../PanelVaccinatedWithPercent'
import PanelTotalTests from '../PanelTotalTests'
import PanelTotalTestsPerThousand from '../PanelTotalTestsPerThousand'

const PanelCurrentCases = ({
  cases,
  currentCases,
  confirmedVsActiveProgressBar,
  recoveredVsDeathsProgressBar,
}) => {
  const vaccineAndTotals =
    currentCases.peopleFullyVaccinated &&
    currentCases.totalVaccinations &&
    currentCases.totalTests &&
    currentCases.totalTestsPerThousand
  let showVaccineAndTotalPanel = false
  if (vaccineAndTotals >= 0 && vaccineAndTotals !== null) {
    showVaccineAndTotalPanel = true
  }

  return (
    <>
      <div className="row">
        <div className="col-sm">
          <PanelConfirmedCount caseCount={currentCases.confirmed} />
        </div>
        <div className="col-sm">
          <PanelActiveCount caseCount={currentCases.active} />
        </div>
        <div className="col-sm">
          <PanelRecoveredCount caseCount={currentCases.recovered} />
        </div>
        <div className="col-sm">
          <PanelDeathCount caseCount={currentCases.deaths} />
        </div>
      </div>

      <div className="row">
        <div className="col-sm">
          <PanelConfirmedToday caseCount={currentCases.confirmedCasesToday} />
        </div>
        <div className="col-sm">
          <PanelDeathsToday caseCount={currentCases.deathsToday} />
        </div>
      </div>

      {showVaccineAndTotalPanel && (
        <div className="row">
          <div className="col-sm">
            <PanelVaccinatedWithPercent
              title="Total vaccinations"
              total={currentCases.totalVaccinations}
              percentage={currentCases.totalVaccinationsPerHundred}
            />
          </div>
          <div className="col-sm">
            <PanelVaccinatedWithPercent
              title="Total fully vaccinated"
              total={currentCases.peopleFullyVaccinated}
              percentage={currentCases.peopleFullyVaccinatedPerHundred}
            />
          </div>
          <div className="col-sm">
            <PanelTotalTests
              title="Total tests"
              data={currentCases.totalTests}
            />
          </div>
          <div className="col-sm">
            <PanelTotalTestsPerThousand
              title="Tests per thousand"
              data={currentCases.totalTestsPerThousand}
            />
          </div>
        </div>
      )}

      <PanelNotableDates cases={cases} currentCases={currentCases} />

      <div className="row">
        <div className="col-sm">
          <PanelConfirmedVsActive data={confirmedVsActiveProgressBar} />
        </div>
        <div className="col-sm">
          <PanelRecoveriesVsDeaths data={recoveredVsDeathsProgressBar} />
        </div>
      </div>
    </>
  )
}

export default PanelCurrentCases
