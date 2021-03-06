import React from 'react'
import {
  useParams
} from "react-router-dom";

const InnerPage = (data) => {
  let { id } = useParams()

  return (
    <>
      <div id={id} className="">
        <h3>Page cannot not found</h3>
      </div>
      <br></br>
      <div className="container-xl">
        <p>The page at "<strong>/{id}</strong>" cannot be found.</p>
      </div>
    </>
  )
}

export default InnerPage
