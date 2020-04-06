import React from 'react'

const PanelConfirmedCount = ({
  caseCount,
  }) => {

  return (
    <>
      <div className="alert alert-danger" role="alert">
        <h5>Total confirmed</h5>
        <div id="confirmedCounter" className="total-cases text-danger">
          { caseCount.toLocaleString() }
        </div>
      </div>
    </>
  )
}

export default PanelConfirmedCount
