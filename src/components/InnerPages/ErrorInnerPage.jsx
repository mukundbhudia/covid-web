import React from 'react'

const ErrorInnerPage = ({ errorData }) => {
  return (
    <>
      <div className="container-fluid">
        <h3>Error</h3>
        <p>There's been an error with COVID-19 Dashboard :(. <br/> Below are the details:</p>
        <div className="row">
          <div className="col-sm">
            <div className="card bg-light error-border border-danger mb-3">
              <div className="card-body">
                <pre className="error">{JSON.stringify(errorData, null, 2)}</pre>
              </div>
            </div>
          </div>
        </div>
        <p>Click <span className="btn btn-link span-link" onClick={() => window.location.reload()}>here</span> to re-load the page and try again.</p>
      </div>
    </>
  )
}

export default ErrorInnerPage
