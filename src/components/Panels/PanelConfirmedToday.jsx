import React from 'react'

const PanelConfirmedToday = ({
  caseCount,
  }) => {

  return (
    <>
      <div className="alert alert-purple" role="alert">
        <h5>New confirmed cases today</h5>
        <div id="confirmedTodayCounter" className="total-cases text-purple">
          { caseCount.toLocaleString() }
        </div>
      </div>
    </>
  )
}

export default PanelConfirmedToday