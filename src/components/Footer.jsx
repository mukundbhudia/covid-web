import React from 'react'

const Footer = () => {

  return (
    <>
      <footer className="footer mt-auto py-3">
        <div className="container pull-left">
            <span className="text-muted">Data sources: <a href="https://www.who.int/">WHO</a>, <a href="https://gisanddata.maps.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6">John Hopkins University</a></span>
        </div>
        <div className="container pull-right">
            <span className="text-muted">Made by: <a href="https://github.com/mukundbhudia">Mukund</a>, <a href="https://github.com/salomao-rodrigues">Sal</a></span>
        </div>
      </footer>
    </>
  )
}

export default Footer
