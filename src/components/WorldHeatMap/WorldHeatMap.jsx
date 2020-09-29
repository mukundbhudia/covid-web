import React, { Component } from 'react'
import Datamap from 'datamaps/dist/datamaps.world.min.js'
import d3 from 'd3'
import './WorldHeatMap.css'

class WorldHeatMap extends Component {

  isValidCase(caseNumberToParse) {
    if (caseNumberToParse >= 0) {
      return true
    } else {
      return false
    }
  }

  processMapData(casesByLocationWithNoProvince, lightColour, darkColour, caseType, showMoreThanOneDataItem) {
    const heatMapData = []
    casesByLocationWithNoProvince.forEach((item, i) => {
      if (item.countryCode) {
        let mainCaseNumberToShow = parseInt(item[caseType])
        if (!showMoreThanOneDataItem) {
          return heatMapData.push([
            item.countryCode,
            this.isValidCase(mainCaseNumberToShow) ? mainCaseNumberToShow : 0,
            item.idKey,
          ])
        } else if (showMoreThanOneDataItem) {
          return heatMapData.push([
            item.countryCode,
            mainCaseNumberToShow,
            parseInt(item.confirmedCasesToday), 
            parseInt(item.active) || 'N/A',
            parseInt(item.recovered) || 'N/A',
            parseInt(item.deaths), 
            parseInt(item.deathsToday),
            item.idKey,
          ])
        }
      }
    })
    
    // Datamaps expect data in format:
    // { "USA": { "fillColor": "#42a844", numberOfWhatever: 75},
    //   "FRA": { "fillColor": "#8dc386", numberOfWhatever: 43 } }
    let dataset = {}

    // We need to colorize every country based on "numberOfWhatever"
    // colors should be uniq for every value.
    // For this purpose we create palette(using min/max this.props.data-value)
    let onlyValues = heatMapData.map((obj) => { return obj[1] })
    let minValue = Math.min.apply(null, onlyValues),
      maxValue = Math.max.apply(null, onlyValues)

    // create color palette function
    // color can be whatever you wish
    let paletteScale = d3.scale.linear()
      .domain([minValue, maxValue])
      .range([lightColour, darkColour])

    // fill dataset in appropriate format
    heatMapData.forEach((item) => { //
      // item example value ["USA", 70]
      let iso = item[0],
        value = item[1],
        idKey = item[2]
      if (showMoreThanOneDataItem) {
        let confirmedCasesToday = item[2]
        let active = item[3]
        let recovered = item[4]
        let deaths = item[5]
        let deathsToday = item[6]
        idKey = item[7]
        dataset[iso] = {
          caseCount: value,
          confirmedCasesToday,
          active,
          recovered,
          deaths,
          deathsToday,
          idKey,
          fillColor: paletteScale(value),
        }
      } else {
        dataset[iso] = {
          caseCount: value,
          idKey,
          fillColor: paletteScale(value),
        }
      }
    })

    return dataset
  }

  generateNewMap(dataset ,mapDataLabel, showMoreThanOneDataItem) {
    const datamap = new Datamap({
      element: document.getElementById(`choroplethMap-${mapDataLabel}`),
      projection: 'mercator', // big world map
      // countries don't listed in dataset will be painted with this color
      fills: { defaultFill: '#F5F5F5' },
      data: dataset,
      geographyConfig: {
        borderColor: '#DEDEDE',
        highlightBorderWidth: 2,
        // don't change color on mouse hover
        highlightFillColor: (geo) => {
          return geo['fillColor'] || '#F5F5F5'
        },
        // only change border
        highlightBorderColor: '#B7B7B7',
        // show desired information in tooltip
        popupTemplate: (geo, data) => {
          // don't show tooltip if country don't present in dataset
          let tooltipHtml = `
          <div class="hoverinfo">
            <strong>${geo.properties.name}</strong>
            <br>${mapDataLabel}: <span>N/A</span>
          </div>`
          if (data && !showMoreThanOneDataItem) {
            tooltipHtml = `
            <div class="hoverinfo">
              <strong>${geo.properties.name}</strong>
              <br>${mapDataLabel}: <strong>${data.caseCount.toLocaleString()}</strong>
            </div>`
          } else if (data && showMoreThanOneDataItem) {
            tooltipHtml = `
            <div class="hoverinfo">
              <strong>${geo.properties.name}</strong>
              <br>${mapDataLabel}: <strong>${data.caseCount.toLocaleString()}</strong>
              <br>Confirmed today: <span>${data.confirmedCasesToday.toLocaleString()}</span>
              <br>Active: <span>${data.active.toLocaleString()}</span>
              <br>Recovered: <span>${data.recovered.toLocaleString()}</span>
              <br>Deaths: <span>${data.deaths.toLocaleString()}</span>
              <br>Deaths today: <span>${data.deathsToday.toLocaleString()}</span>
            </div>`
          }
          return tooltipHtml
        },
      },
      done: (datamap) => {
        datamap.svg.selectAll('.datamaps-subunit').on('click', (geography) => {
          window.location.href = `${process.env.PUBLIC_URL}/${dataset[geography.id].idKey}`
        })
      }
    })
    return datamap
  }

  componentDidUpdate(prevProps) {
    if (this.props.date !== prevProps.date) {
      const casesByLocationWithNoProvince = this.props.data
      const lightColour = this.props.lightColour
      const darkColour = this.props.darkColour
      const caseType = this.props.caseType
      const showMoreThanOneDataItem = this.props.showMoreThanOneDataItem || false
      const mapData = this.processMapData(casesByLocationWithNoProvince, lightColour, darkColour, caseType, showMoreThanOneDataItem)
      this.map.updateChoropleth(mapData)
    }
  }

  componentDidMount() {
    const casesByLocationWithNoProvince = this.props.data
    const mapDataLabel = this.props.mapDataLabel
    const lightColour = this.props.lightColour
    const darkColour = this.props.darkColour
    const caseType = this.props.caseType
    const showMoreThanOneDataItem = this.props.showMoreThanOneDataItem || false
    const mapData = this.processMapData(casesByLocationWithNoProvince, lightColour, darkColour, caseType, showMoreThanOneDataItem)
    this.map = this.generateNewMap(mapData, mapDataLabel, showMoreThanOneDataItem)
  }

  render() {
    const mapDataLabel = this.props.mapDataLabel
    return (
      <>
        <div id={`choroplethMap-${mapDataLabel}`} className="choroplethMap"></div>
      </>
    )
  }
}
export default WorldHeatMap
