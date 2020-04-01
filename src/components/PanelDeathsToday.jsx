import React from 'react'

const PanelDeathsToday = ({
  caseCount,
  }) => {

  return (
    <>
      <div className="alert alert-warning" role="alert">
        <h5>New deaths today</h5>
        <div id="deathsTodayCounter" className="total-cases text-yellow">
          { caseCount.toLocaleString() }
        </div>
      </div>
    </>
  )
}

export default PanelDeathsToday
