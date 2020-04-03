import React, { Component } from 'react'
import Datamap from 'datamaps/dist/datamaps.world.min.js'
import d3 from 'd3'
import './WorldHeatMap.css'

class WorldHeatMap extends Component {
  componentDidMount() {
    const casesByLocationWithNoProvince = this.props.data
    const mapType = this.props.mapType

    const heatMapData = []
    casesByLocationWithNoProvince.forEach((item, i) => {
      if (item.countryCode) {
        return heatMapData.push([item.countryCode, item.confirmed])
      }
    })
    
    // Datamaps expect data in format:
    // { "USA": { "fillColor": "#42a844", numberOfWhatever: 75},
    //   "FRA": { "fillColor": "#8dc386", numberOfWhatever: 43 } }
    let dataset = {}

    // We need to colorize every country based on "numberOfWhatever"
    // colors should be uniq for every value.
    // For this purpose we create palette(using min/max this.props.data-value)
    let onlyValues = heatMapData.map(function (obj) { return obj[1] })
    let minValue = Math.min.apply(null, onlyValues),
      maxValue = Math.max.apply(null, onlyValues)

    // create color palette function
    // color can be whatever you wish
    let paletteScale = d3.scale.linear()
      .domain([minValue, maxValue])
      .range(["#fee0d2", "#de2d26"]) // [lighter, darker]

    // fill dataset in appropriate format
    heatMapData.forEach(function (item) { //
        // item example value ["USA", 70]
        let iso = item[0],
        value = item[1]
      dataset[iso] = { numberOfThings: value, fillColor: paletteScale(value) }
    })

    new Datamap({
      element: document.getElementById(`choroplethMap-${mapType}`),
      projection: 'mercator', // big world map
      // countries don't listed in dataset will be painted with this color
      fills: { defaultFill: '#F5F5F5' },
      data: dataset,
      geographyConfig: {
        borderColor: '#DEDEDE',
        highlightBorderWidth: 2,
        // don't change color on mouse hover
        highlightFillColor: function(geo) {
          return geo['fillColor'] || '#F5F5F5'
        },
        // only change border
        highlightBorderColor: '#B7B7B7',
        // show desired information in tooltip
        popupTemplate: function(geo, data) {
          // don't show tooltip if country don't present in dataset
          if (!data) { return }
          // tooltip content
          return `<div class="hoverinfo">
            <strong>${geo.properties.name}</strong>
            <br>${mapType}: <strong>${data.numberOfThings}</strong>
            </div>`
        }
      }
    })
  }
  render() {
    const mapType = this.props.mapType
    return (
      <>
        <div id={`choroplethMap-${mapType}`} className="choroplethMap"></div>
      </>
    )
  }
}
export default WorldHeatMap
