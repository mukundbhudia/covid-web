import React from 'react'

const PanelVaccinatedWithPercent = ({ title, total, percentage }) => {
  return (
    <>
      <div className="alert vaccine-badge" role="alert">
        <h5>{title}</h5>
        <div
          id="peopleFullyVaccinatedCounter"
          className="total-fully-vaccinated text-vaccine"
        >
          {total && total >= 0 ? total.toLocaleString() : '0'}
          &nbsp;
          <span
            className="notable-tooltip"
            data-tip="As a percentage of the population"
          >
            ({total && total >= 0 ? percentage : '0.0'}
            %)
          </span>
        </div>
      </div>
    </>
  )
}

export default PanelVaccinatedWithPercent
