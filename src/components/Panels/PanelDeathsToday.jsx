import React from 'react'

const PanelDeathsToday = ({ caseCount }) => {
  return (
    <>
      <div className="alert alert-warning" role="alert">
        <h5>Deaths&nbsp;today</h5>
        <div id="deathsTodayCounter" className="total-cases text-yellow">
          { caseCount >= 0 ? caseCount.toLocaleString() : 'N/A' }
        </div>
      </div>
    </>
  )
}

export default PanelDeathsToday
