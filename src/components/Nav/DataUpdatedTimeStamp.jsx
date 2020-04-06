import React from 'react'
import * as timeago from 'timeago.js'

const UpdatedTimeStamp = ({ lastUpdated }) => {
  const lastUpdatedDate = timeago.format(new Date(parseInt(lastUpdated)))
  return (
    <div className="col-sm float-right">
      <p className="lastUpdatedTimeStamp float-right">Data last updated: <span id="lastUpdated">{lastUpdatedDate}</span></p>
    </div>
  )
}

export default UpdatedTimeStamp
