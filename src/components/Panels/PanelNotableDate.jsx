import React from 'react'
import * as timeago from 'timeago.js'

const PanelNotableDate = ({ data, message }) => {
  const notableDate = new Date(data.day)
  const today = new Date()
  const timeAgoDate = timeago.format(data.day)
  const timeAgoInDays = Math.trunc(
    (today.getTime() - notableDate.getTime()) / (1000 * 3600 * 24)
  )

  let renderedDate = (
    <>
      {notableDate.toLocaleDateString()}
      &nbsp;
      <span className="notable-tooltip" data-tip={`${timeAgoInDays} days ago`}>
        ({timeAgoDate})
      </span>
    </>
  )

  if (message === 'Most cases' || message === 'Most deaths') {
    renderedDate = (
      <>
        {data.count ? data.count.toLocaleString() : 'N/A'}
        &nbsp;
        <span
          className="notable-tooltip"
          data-tip={notableDate.toLocaleDateString()}
        >
          ({timeAgoDate})
        </span>
      </>
    )
  }

  return (
    <div className="alert alert-notable" role="alert">
      <div className="notable-dates text-notable">
        <strong>{message}</strong>: {data.day ? renderedDate : 'N/A'}
      </div>
    </div>
  )
}

export default PanelNotableDate
