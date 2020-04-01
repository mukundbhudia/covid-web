import React from 'react'

const PanelActiveCount = ({
  caseCount,
  }) => {

  return (
    <>
      <div className="alert alert-primary" role="alert">
        <h5>Total active</h5>
        <div id="activeCounter" className="total-cases text-primary">
          { caseCount.toLocaleString() }
        </div>
      </div> 
    </>
  )
}

export default PanelActiveCount
