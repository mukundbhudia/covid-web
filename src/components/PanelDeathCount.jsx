import React from 'react'

const PanelDeathCount = ({
  caseCount,
  }) => {

  return (
    <>
      <div className="alert alert-dark" role="alert">
        <h5>Total deaths</h5>
        <div id="deathsCounter" className="total-cases text-dark">
          { caseCount.toLocaleString() }
        </div>
      </div>
    </>
  )
}

export default PanelDeathCount
