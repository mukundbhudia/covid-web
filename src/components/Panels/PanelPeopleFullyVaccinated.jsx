import React from 'react'

const PanelPeopleFullyVaccinated = ({ data, population }) => {
  return (
    <>
      <div className="alert vaccine-badge" role="alert">
        <h5>Total fully vaccinated</h5>
        <div
          id="peopleFullyVaccinatedCounter"
          className="total-fully-vaccinated text-vaccine"
        >
          {data && data >= 0 ? data.toLocaleString() : '0'}
          &nbsp;
          <span
            className="notable-tooltip"
            data-tip={`Total population: ${population.toLocaleString()}`}
          >
            (
            {data && data >= 0 ? ((data / population) * 100).toFixed(2) : '0.0'}
            %)
          </span>
        </div>
      </div>
    </>
  )
}

export default PanelPeopleFullyVaccinated
