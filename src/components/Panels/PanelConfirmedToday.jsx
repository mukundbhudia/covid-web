import React from 'react'

const PanelConfirmedToday = ({ caseCount }) => {
  return (
    <>
      <div className="alert alert-purple" role="alert">
        <h5>Cases&nbsp;today</h5>
        <div id="confirmedTodayCounter" className="total-cases text-purple">
          {caseCount >= 0 ? caseCount.toLocaleString() : 'N/A'}
        </div>
      </div>
    </>
  )
}

export default PanelConfirmedToday
