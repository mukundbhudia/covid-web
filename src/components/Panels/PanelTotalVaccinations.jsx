import React from 'react'

const PanelTotalVaccinations = ({ data }) => {
  return (
    <>
      <div className="alert vaccine-badge" role="alert">
        <h5>Total vaccinations</h5>
        <div
          id="totalVaccinationsCounter"
          className="total-vaccinations text-vaccine"
        >
          {data && data >= 0 ? data.toLocaleString() : '0'}
        </div>
      </div>
    </>
  )
}

export default PanelTotalVaccinations
