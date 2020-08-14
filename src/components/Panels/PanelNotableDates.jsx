import React from 'react'
import * as timeago from 'timeago.js'

const PanelNotableDates = ({ date, message }) => {
  const notableDate = new Date(date)
  const timeAgoDate = timeago.format(date)
  const renderedDate = (
    <>
      { notableDate.toLocaleDateString() }
      <span> ({ timeAgoDate })</span>
    </>
  )

  return (
    <>
      <div className="alert alert-notable" role="alert">
        <div className="notable-dates text-notable">
          <strong>{ message }</strong>: { date ? renderedDate : 'N/A' }
        </div>
      </div> 
    </>
  )
}

export default PanelNotableDates
