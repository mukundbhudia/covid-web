import React from 'react'

const PanelTotalTestsPerThousand = ({ data }) => {
  return (
    <>
      <div className="alert test-badge" role="alert">
        <h5>Tests per thousand</h5>
        <div
          id="totalTestsPerThousandCounter"
          className="total-tests-per-thousand text-test"
        >
          {data && data >= 0 ? data.toLocaleString() : '0'}
        </div>
      </div>
    </>
  )
}

export default PanelTotalTestsPerThousand
