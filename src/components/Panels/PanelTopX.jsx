import React from 'react'
import TopXBarGraph from '../Charts/TopXBarGraph'

const isGreaterThanZero = (array, key) => {
  return array.filter((element) => { return element[key] > 0 })
}

const PanelTopX = ({ data, includeToday }) => {

  return (
    <>
      <div className="row">
        <TopXBarGraph
          data={isGreaterThanZero(data.topXconfirmedByCountry.data, 'confirmed')}
          id="top5confirmed"
          chartTitle={data.topXconfirmedByCountry.label}
          chartLabel="Confirmed"
          chartLabelKey="confirmed"
          labelColor="red"
        />
        <TopXBarGraph
          data={isGreaterThanZero(data.topXactiveByCountry.data, 'active')}
          id="top5active"
          chartTitle={data.topXactiveByCountry.label}
          chartLabel="Active"
          chartLabelKey="active"
          labelColor="blue"
        />
      </div>
      <div className="row">
        <TopXBarGraph
          data={isGreaterThanZero(data.topXrecoveredByCountry.data, 'recovered')}
          id="top5recovered"
          chartTitle={data.topXrecoveredByCountry.label}
          chartLabel="Recovered"
          chartLabelKey="recovered"
          labelColor="green"
        />
        <TopXBarGraph
          data={isGreaterThanZero(data.topXdeathsByCountry.data, 'deaths')}
          id="top5deaths"
          chartTitle={data.topXdeathsByCountry.label}
          chartLabel="Deaths"
          chartLabelKey="deaths"
          labelColor="grey"
        />
      </div>
      {includeToday &&
        <div className="row">
          <TopXBarGraph
            data={isGreaterThanZero(data.topXconfirmedTodayByCountry.data, 'confirmedCasesToday')}
            id="top5recovered"
            chartTitle={data.topXconfirmedTodayByCountry.label}
            chartLabel="Confirmed cases today"
            chartLabelKey="confirmedCasesToday"
            labelColor="purple"
          />
          <TopXBarGraph
            data={isGreaterThanZero(data.topXdeathsTodayByCountry.data, 'deathsToday')}
            id="top5deaths"
            chartTitle={data.topXdeathsTodayByCountry.label}
            chartLabel="Deaths today"
            chartLabelKey="deathsToday"
            labelColor="yellow"
          />
        </div>
      }
    </>
  )
}

export default PanelTopX
