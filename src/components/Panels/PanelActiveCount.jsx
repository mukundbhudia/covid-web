import React from 'react'

const PanelActiveCount = ({ caseCount }) => {
  return (
    <>
      <div className="alert alert-primary" role="alert">
        <h5>Active</h5>
        <div id="activeCounter" className="total-cases text-primary">
          {caseCount >= 0 ? caseCount.toLocaleString() : 'N/A'}
        </div>
      </div>
    </>
  )
}

export default PanelActiveCount
