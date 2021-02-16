import React from 'react'

const Footer = () => {

  return (
    <>
      <footer className="footer col-md-10 float-right mt-5 py-3">
        <div className="container pull-left">
          <span className="text-muted">
            Data sources: <a target="_blank" rel="noopener noreferrer" href="https://github.com/CSSEGISandData/COVID-19">JHU CSSE</a>,&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://gisanddata.maps.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6">John Hopkins University</a>,&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://github.com/owid/covid-19-data/tree/master/public/data">OWID</a>.&nbsp;
          </span>
        </div>
        <div className="container pull-right">
          <span className="text-muted">Made by: <a target="_blank" rel="noopener noreferrer" href="https://github.com/mukundbhudia">Mukund</a>,&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://github.com/salomao-rodrigues">Salomão</a>.&nbsp;
          </span>
        </div>
      </footer>
    </>
  )
}

export default Footer
