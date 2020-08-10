import React from 'react'

const PanelConfirmedCount = ({ caseCount }) => {
  return (
    <>
      <div className="alert alert-danger" role="alert">
        <h5>Total confirmed</h5>
        <div id="confirmedCounter" className="total-cases text-danger">
          { caseCount >= 0 ? caseCount.toLocaleString() : 'N/A' }
        </div>
      </div>
    </>
  )
}

export default PanelConfirmedCount
