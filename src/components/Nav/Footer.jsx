import React from 'react'

const Footer = () => {

  return (
    <>
      <footer className="footer col-md-10 float-right mt-auto py-3">
        <div className="container pull-left">
          <span className="text-muted">
            Data sources: <a href="https://github.com/CSSEGISandData/COVID-19">JHU CSSE</a>,&nbsp;
            <a href="https://gisanddata.maps.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6">John Hopkins University</a>&nbsp;
          </span>
        </div>
        <div className="container pull-right">
          <span className="text-muted">Made by: <a href="https://github.com/mukundbhudia">Mukund</a>,&nbsp;
            <a href="https://github.com/salomao-rodrigues">Sal</a>&nbsp;
          </span>
        </div>
      </footer>
    </>
  )
}

export default Footer
