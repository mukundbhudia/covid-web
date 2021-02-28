import React from 'react'

const PanelTotalTests = ({ data }) => {
  return (
    <>
      <div className="alert test-badge" role="alert">
        <h5>Total tests</h5>
        <div id="totalTestsCounter" className="total-tests text-test">
          {data && data >= 0 ? data.toLocaleString() : '0'}
        </div>
      </div>
    </>
  )
}

export default PanelTotalTests
