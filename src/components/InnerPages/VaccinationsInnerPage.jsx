import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { useLocation } from 'react-router-dom'

import ErrorInnerPage from './ErrorInnerPage'
import LoadingInnerPage from './LoadingInnerPage'
import DataUpdatedTimeStamp from '../Nav/DataUpdatedTimeStamp'
import { getVaccinationData } from '../../modules/queries'
import { calculatePercentageWithDp } from '../../modules/numeric'
import RadarChart from '../Charts/RadarChart'
import StackedCountryBarGraph from '../Charts/StackedCountryBarGraph'
import PanelVaccinatedWithPercent from '../Panels/PanelVaccinatedWithPercent'
import PanelTotalVaccinations from '../Panels/PanelTotalVaccinations'
import { chartColors } from '../Charts/chartSettings'
import DataTable from './DataTableInnerPage/DataTable'

const MAX_COUNTRIES_TO_SHOW_IN_BAR_CHARTS = 10
const PEOPLE_VACCINATED_COLOUR = chartColors.lightIndigo
const PEOPLE_FULLY_VACCINATED_COLOUR = chartColors.darkIndigo

let tableSortParams = { sortKey: 'totalVaccinationsPerHundred', order: 'desc' }

const useUrlQuery = (loc) => {
  let urlParams = new URLSearchParams(loc.search)
  return urlParams
}

const VaccinationsInnerPage = ({ lastUpdated }) => {
  let location = useLocation()
  let query = useUrlQuery(location)

  const sortQueryParam = query.get('sort')
  const orderQueryParam = query.get('order')
  const rowsQueryParam = query.get('rows')

  if (sortQueryParam && orderQueryParam && rowsQueryParam) {
    tableSortParams = {
      sortKey: sortQueryParam,
      order: orderQueryParam,
      rows: parseInt(rowsQueryParam),
    }
  }

  const [
    numberOfBarChartCountriesToShow,
    setNumberOfBarChartCountriesToShow,
  ] = useState(MAX_COUNTRIES_TO_SHOW_IN_BAR_CHARTS)

  const { loading, error, data } = useQuery(getVaccinationData)

  if (loading) return <LoadingInnerPage />
  if (error) return <ErrorInnerPage errorData={error} />

  const continents = new Map()

  data.casesByLocationWithNoProvince.forEach((country) => {
    let continent = country.continent
    let foundContinent = continents.get(continent)
    if (continent) {
      if (foundContinent) {
        foundContinent.totalVaccinations += country.totalVaccinations
        foundContinent.peopleFullyVaccinated += country.peopleFullyVaccinated
        foundContinent.peopleVaccinated += country.peopleVaccinated
        foundContinent.population += country.population
        foundContinent.percentOfPeopleVaccinated = calculatePercentageWithDp(
          foundContinent.peopleVaccinated,
          foundContinent.population,
          2
        )
        foundContinent.percentOfPeopleFullyVaccinated = calculatePercentageWithDp(
          foundContinent.peopleFullyVaccinated,
          foundContinent.population,
          2
        )
        continents.set(continent, foundContinent)
      } else {
        continents.set(continent, {
          totalVaccinations: 0,
          peopleFullyVaccinated: 0,
          peopleVaccinated: 0,
          population: 0,
          percentOfPeopleVaccinated: 0,
          percentOfPeopleFullyVaccinated: 0,
        })
      }
    }
  })

  const radarChartData = {
    labels: Array.from(continents.keys()),
    datasets: [
      {
        label: 'Percent of people partially vaccinated',
        mainColor: PEOPLE_VACCINATED_COLOUR,
        data: Array.from(continents.values()).map(
          (item) => item.percentOfPeopleVaccinated
        ),
      },
      {
        label: 'Percent of people fully vaccinated',
        mainColor: PEOPLE_FULLY_VACCINATED_COLOUR,
        data: Array.from(continents.values()).map(
          (item) => item.percentOfPeopleFullyVaccinated
        ),
      },
    ],
  }

  const nonNullVaccinatedCountries = data.casesByLocationWithNoProvince.filter(
    (country) => {
      return country.totalVaccinations && country.peopleVaccinated
    }
  )

  const nonNullVaccinatedCountriesLength = nonNullVaccinatedCountries.length

  const sortedAndTrimmedVaccinationData = nonNullVaccinatedCountries
    .sort((a, b) => {
      return b.totalVaccinations - a.totalVaccinations
    })
    .slice(0, numberOfBarChartCountriesToShow)

  const xAxesLabel = sortedAndTrimmedVaccinationData.map(
    (element) => element.country
  )

  const peopleVaccinatedDataArray = sortedAndTrimmedVaccinationData.map(
    (element) => ({
      x: element.country,
      y: element['peopleVaccinated'],
    })
  )

  const peopleFullyVaccinatedDataArray = sortedAndTrimmedVaccinationData.map(
    (element) => ({
      x: element.country,
      y: element['peopleFullyVaccinated'],
    })
  )

  const vaccineCountChartData = {
    labels: xAxesLabel,
    datasets: [
      {
        label: 'People partially vaccinated',
        backgroundColor: chartColors.lightGreen,
        borderColor: chartColors.lightGreen,
        data: peopleVaccinatedDataArray,
        fill: false,
      },
      {
        label: 'People fully vaccinated',
        backgroundColor: chartColors.darkGreen,
        borderColor: chartColors.darkGreen,
        data: peopleFullyVaccinatedDataArray,
        fill: false,
      },
    ],
  }

  const sortedAndTrimmedVaccinationPerCentData = nonNullVaccinatedCountries
    .sort((a, b) => {
      return b.totalVaccinationsPerHundred - a.totalVaccinationsPerHundred
    })
    .slice(0, numberOfBarChartCountriesToShow)

  const perCentxAxesLabel = sortedAndTrimmedVaccinationPerCentData.map(
    (element) => element.country
  )

  const perCentPeopleVaccinated = sortedAndTrimmedVaccinationPerCentData.map(
    (element) => ({
      x: element.country,
      y: element['peopleVaccinatedPerHundred'],
    })
  )

  const perCentPeopleFullyVaccinated = sortedAndTrimmedVaccinationPerCentData.map(
    (element) => ({
      x: element.country,
      y: element['peopleFullyVaccinatedPerHundred'],
    })
  )

  const percentVaccineCountChartData = {
    labels: perCentxAxesLabel,
    datasets: [
      {
        label: 'Percent of people partially vaccinated',
        backgroundColor: PEOPLE_VACCINATED_COLOUR,
        borderColor: PEOPLE_VACCINATED_COLOUR,
        data: perCentPeopleVaccinated,
        fill: false,
      },
      {
        label: 'Percent of fully vaccinated',
        backgroundColor: PEOPLE_FULLY_VACCINATED_COLOUR,
        borderColor: PEOPLE_FULLY_VACCINATED_COLOUR,
        data: perCentPeopleFullyVaccinated,
        fill: false,
      },
    ],
  }

  const percentVaccineCountChartAxesLabels = {
    x: 'Country',
    y: 'Percentage of population',
  }

  const vaccineCountChartAxesLabels = {
    x: 'Country',
    y: 'Number of vaccinations',
  }

  const columns = [
    {
      key: 'country',
      name: 'Country',
      type: 'link',
    },
    {
      key: 'totalVaccinations',
      name: 'Total vaccinated',
      type: 'number',
    },
    {
      key: 'peopleVaccinated',
      name: 'Partially vaccinated',
      type: 'number',
    },
    {
      key: 'peopleFullyVaccinated',
      name: 'Fully vaccinated',
      type: 'number',
    },
    {
      key: 'totalVaccinationsPerHundred',
      name: '% population vaccinated',
      type: 'percentage',
    },
    {
      key: 'peopleVaccinatedPerHundred',
      name: '% population partially vaccinated',
      type: 'percentage',
    },
    {
      key: 'peopleFullyVaccinatedPerHundred',
      name: '% population fully vaccinated',
      type: 'percentage',
    },
  ]

  return (
    <>
      <div id="global-page" className="">
        <h3>Vaccinations</h3>
      </div>

      <div className="row">
        <DataUpdatedTimeStamp lastUpdated={lastUpdated} />
      </div>

      <div className="row mb-4">
        <div className="col-sm">
          <PanelTotalVaccinations
            title="Total global vaccinations"
            data={data.totalCases.totalVaccinations}
          />
          <PanelVaccinatedWithPercent
            title="Global partial vaccinations"
            total={data.totalCases.peopleVaccinated}
            percentage={data.totalCases.peopleVaccinatedPerHundred}
          />
        </div>
        <div className="col-sm">
          <PanelTotalVaccinations
            title="Global population vaccinated"
            data={data.totalCases.totalVaccinationsPerHundred}
            showsPercentage={true}
          />
          <PanelVaccinatedWithPercent
            title="Global fully vaccinated"
            total={data.totalCases.peopleFullyVaccinated}
            percentage={data.totalCases.peopleFullyVaccinatedPerHundred}
          />
        </div>
        <div className="col-sm-7">
          <RadarChart
            id="vaccinationsContinent"
            chartTitle="Percent of population partially and fully vaccinated by continent"
            chartData={radarChartData}
            showsPercentage={true}
          />
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-sm">
          <StackedCountryBarGraph
            id="sortedAndTrimmedVaccinationData"
            chartTitle={`Top ${numberOfBarChartCountriesToShow} countries showing percent of population partially and fully vaccinated`}
            axesLabels={percentVaccineCountChartAxesLabels}
            chartData={percentVaccineCountChartData}
            isStacked={true}
            showsPercentage={true}
            animation={false}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-sm">
          <StackedCountryBarGraph
            id="sortedAndTrimmedVaccinationData"
            axesLabels={vaccineCountChartAxesLabels}
            chartTitle={`Top ${numberOfBarChartCountriesToShow} countries showing number of partial and full vaccinations by country`}
            chartData={vaccineCountChartData}
            isStacked={true}
            animation={false}
          />
        </div>
      </div>

      <div className="row mb-4">
        <p className="pr-2">Number of countries to show in bar charts:</p>
        <div
          className="vaccinationChartSliderControls btn-group btn-group-toggle mr-1"
          data-tip={`Showing ${numberOfBarChartCountriesToShow} countries in bar charts`}
        >
          <input
            type="range"
            className="custom-range"
            min="5"
            max={nonNullVaccinatedCountriesLength}
            id="vaccinationCountryChartSlider"
            value={numberOfBarChartCountriesToShow}
            onChange={(changeEvent) => {
              let numSelected = parseInt(changeEvent.target.value)
              setNumberOfBarChartCountriesToShow(numSelected)
            }}
          ></input>
        </div>
      </div>

      <div className="row">
        <DataTable
          sortConfig={tableSortParams}
          tableData={nonNullVaccinatedCountries}
          columnSchema={columns}
          initialRowsLimit={10}
        />
      </div>
    </>
  )
}

export default VaccinationsInnerPage
