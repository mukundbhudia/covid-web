import React from 'react'

const PanelRecoveredCount = ({
  caseCount,
  }) => {

  return (
    <>
      <div className="alert alert-success" role="alert">
        <h5>Total recovered</h5>
        <div id="recoveredCounter" className="total-cases text-success">
          { caseCount.toLocaleString() }
        </div>
      </div>
    </>
  )
}

export default PanelRecoveredCount
