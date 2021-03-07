import React from 'react'

const PanelRecoveredCount = ({ caseCount }) => {
  return (
    <>
      <div className="alert alert-success" role="alert">
        <h5>Recovered</h5>
        <div id="recoveredCounter" className="total-cases text-success">
          { caseCount >= 0 ? caseCount.toLocaleString() : 'N/A' }
        </div>
      </div>
    </>
  )
}

export default PanelRecoveredCount
