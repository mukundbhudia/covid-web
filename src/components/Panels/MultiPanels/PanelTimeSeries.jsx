import React from 'react'

import TimeSeries from '../../Charts/TimeSeries'

const PanelTimeSeries = ({ cases, currentCases, title }) => {

  let tsTitle = "Global time series cases by day"
  let tsDailyTitle = "Global time series daily cases by day"

  if (title) {
    tsTitle = `Time series cases by day for ${title}`
    tsDailyTitle = `Time series daily cases by day for ${title}`
  }

  return (
    <>
      <div className="row">
        <div className="col-sm">
          <TimeSeries
            chartTitle={ tsTitle }
            casesToHide={ {
              confirmed: false,
              deaths: false,
              confirmedToday: false,
              confirmedTodayMovingAverage: true,
              deathsToday: false,
              deathsTodayMovingAverage: true,
            } }
            data={ cases }
            currentCases={ currentCases }
          />
        </div>
      </div>
      <br/>
      <div className="row">
        <div className="col-sm">
          <TimeSeries
            chartTitle={ tsDailyTitle }
            casesToHide={ {
              confirmed: true,
              deaths: true,
              confirmedToday: false,
              confirmedTodayMovingAverage: false,
              deathsToday: false,
              deathsTodayMovingAverage: false,
            } }
            data={ cases }
            currentCases={ currentCases }
          />
        </div>
      </div>
    </>
  )
}

export default PanelTimeSeries
