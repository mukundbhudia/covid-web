import React from 'react'
import * as timeago from 'timeago.js'

const UpdatedTimeStamp = ({ lastUpdated }) => {
  const dataAsInt = parseInt(lastUpdated)
  let lastUpdatedDate = timeago.format(new Date(dataAsInt))
  if (lastUpdated <= 0) {
    lastUpdatedDate = "unknown"
  }
  return (
    <div className="col-sm float-right">
      <p className="lastUpdatedTimeStamp float-right">Data last updated: <span id="lastUpdated">{lastUpdatedDate}</span></p>
    </div>
  )
}

export default UpdatedTimeStamp
