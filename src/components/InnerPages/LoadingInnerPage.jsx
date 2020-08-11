import React from 'react'

const LoadingInnerPage = () => {
  const loadingMessage = 'Loading data for dashboard ...'
  const spinnerDimensions = '40px'
  const spinnerStyle = {
    width: spinnerDimensions,
    height: spinnerDimensions,
  }

  return (
    <>
      <div className="container-fluid">
        <div className="text-center">
          <p>{ loadingMessage }</p>
          <div className="spinner-grow" style={ spinnerStyle } role="status">
            <span className="sr-only">{ loadingMessage }</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default LoadingInnerPage
