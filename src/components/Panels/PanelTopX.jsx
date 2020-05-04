import React from 'react'
import TopXBarGraph from '../Charts/TopXBarGraph'

const PanelTopX = ({ data }) => {

  return (
    <>
      <div className="row">
        <TopXBarGraph
          data={data.topXconfirmedByCountry.data}
          id="top5confirmed"
          chartTitle={data.topXconfirmedByCountry.label}
          chartLabel="Confirmed"
          chartLabelKey="confirmed"
          labelColor="red"
        />
        <TopXBarGraph
          data={data.topXactiveByCountry.data}
          id="top5active"
          chartTitle={data.topXactiveByCountry.label}
          chartLabel="Active"
          chartLabelKey="active"
          labelColor="blue"
        />
      </div>
      <div className="row">
        <TopXBarGraph
          data={data.topXrecoveredByCountry.data}
          id="top5recovered"
          chartTitle={data.topXrecoveredByCountry.label}
          chartLabel="Recovered"
          chartLabelKey="recovered"
          labelColor="green"
        />
        <TopXBarGraph
          data={data.topXdeathsByCountry.data}
          id="top5deaths"
          chartTitle={data.topXdeathsByCountry.label}
          chartLabel="Deaths"
          chartLabelKey="deaths"
          labelColor="grey"
        />
      </div>
    </>
  )
}

export default PanelTopX
