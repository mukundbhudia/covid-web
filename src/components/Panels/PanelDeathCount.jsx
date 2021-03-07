import React from 'react'

const PanelDeathCount = ({ caseCount }) => {
  return (
    <>
      <div className="alert alert-dark" role="alert">
        <h5>Deaths</h5>
        <div id="deathsCounter" className="total-cases text-dark">
          { caseCount >= 0 ? caseCount.toLocaleString() : 'N/A' }
        </div>
      </div>
    </>
  )
}

export default PanelDeathCount
