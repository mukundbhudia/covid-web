import React from 'react'
import ProgressBar from '../Charts/ProgressBar'

const PanelConfirmedVsActive = ({
  data,
  }) => {

  return (
    <>
      <div className="card bg-light mb-3">
        <div className="card-body">
          <h6 className="card-title">Confirmed/Active</h6>
          <ProgressBar
              dataSet={data}
          />
        </div>
      </div>
    </>
  )
}

export default PanelConfirmedVsActive
