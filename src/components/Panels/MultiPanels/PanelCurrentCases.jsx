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

const PanelCurrentCases = ({ cases, currentCases, confirmedVsActiveProgressBar, recoveredVsDeathsProgressBar }) => {
  return (
    <>
      <div className="row">
        <div className="col-sm">
          <PanelConfirmedCount caseCount={currentCases.confirmed}/>
        </div>
        <div className="col-sm">
          <PanelActiveCount caseCount={currentCases.active}/>
        </div>
        <div className="col-sm">
          <PanelRecoveredCount caseCount={currentCases.recovered}/>
        </div>
        <div className="col-sm">
          <PanelDeathCount caseCount={currentCases.deaths}/>
        </div>
      </div>

      <div className="row">
        <div className="col-sm">
          <PanelConfirmedToday caseCount={currentCases.confirmedCasesToday}/>
        </div>
        <div className="col-sm">
          <PanelDeathsToday caseCount={currentCases.deathsToday} />
        </div>
      </div>

      <PanelNotableDates
        cases={ cases }
        currentCases={ currentCases }
      />

      <div className="row">
        <div className="col-sm">
          <PanelConfirmedVsActive data={confirmedVsActiveProgressBar}/>
        </div>
        <div className="col-sm">
          <PanelRecoveriesVsDeaths data={recoveredVsDeathsProgressBar}/>
        </div>
      </div>

    </>
  )
}

export default PanelCurrentCases
