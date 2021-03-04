import React from 'react'
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

const MAX_COUNTRIES_TO_SHOW = 10
const PEOPLE_VACCINATED_COLOUR = chartColors.blue
const PEOPLE_FULLLY_VACCINATED_COLOUR = chartColors.darkPurple

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

  if (sortQueryParam && orderQueryParam) {
    tableSortParams = { sortKey: sortQueryParam, order: orderQueryParam }
  }

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
        label: 'Percent of people vaccinated',
        mainColor: PEOPLE_VACCINATED_COLOUR,
        data: Array.from(continents.values()).map(
          (item) => item.percentOfPeopleVaccinated
        ),
      },
      {
        label: 'Percent of people fully vaccinated',
        mainColor: PEOPLE_FULLLY_VACCINATED_COLOUR,
        data: Array.from(continents.values()).map(
          (item) => item.percentOfPeopleFullyVaccinated
        ),
      },
    ],
  }

  const nonNullVaccinatedCountries = data.casesByLocationWithNoProvince.filter(
    (country) => {
      return (
        country.totalVaccinations &&
        country.peopleVaccinated &&
        country.peopleFullyVaccinated
      )
    }
  )

  const sortedAndTrimmedVaccinationData = nonNullVaccinatedCountries
    .sort((a, b) => {
      return b.totalVaccinations - a.totalVaccinations
    })
    .slice(0, MAX_COUNTRIES_TO_SHOW + 1)

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
        label: 'People vaccinated',
        backgroundColor: chartColors.purple,
        borderColor: chartColors.purple,
        data: peopleVaccinatedDataArray,
        fill: false,
      },
      {
        label: 'People fully vaccinated',
        backgroundColor: chartColors.yellow,
        borderColor: chartColors.yellow,
        data: peopleFullyVaccinatedDataArray,
        fill: false,
      },
    ],
  }

  const sortedAndTrimmedVaccinationPerCentData = nonNullVaccinatedCountries
    .sort((a, b) => {
      return b.totalVaccinationsPerHundred - a.totalVaccinationsPerHundred
    })
    .slice(0, MAX_COUNTRIES_TO_SHOW + 1)

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
        label: 'Percent of people vaccinated',
        backgroundColor: PEOPLE_VACCINATED_COLOUR,
        borderColor: PEOPLE_VACCINATED_COLOUR,
        data: perCentPeopleVaccinated,
        fill: false,
      },
      {
        label: 'Percent of fully vaccinated',
        backgroundColor: PEOPLE_FULLLY_VACCINATED_COLOUR,
        borderColor: PEOPLE_FULLLY_VACCINATED_COLOUR,
        data: perCentPeopleFullyVaccinated,
        fill: false,
      },
    ],
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
      key: 'totalVaccinationsPerHundred',
      name: '% vaccinated',
      type: 'percentage',
    },
    {
      key: 'peopleVaccinated',
      name: 'Partially vaccinated',
      type: 'number',
    },
    {
      key: 'peopleVaccinatedPerHundred',
      name: '% partially vaccinated',
      type: 'percentage',
    },
    {
      key: 'peopleFullyVaccinated',
      name: 'Fully vaccinated',
      type: 'number',
    },
    {
      key: 'peopleFullyVaccinatedPerHundred',
      name: '% fully vaccinated',
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
            title="% of people vaccinated"
            total={data.totalCases.peopleVaccinated}
            percentage={data.totalCases.peopleVaccinatedPerHundred}
          />
        </div>
        <div className="col-sm">
          <PanelTotalVaccinations
            title="% of total vaccinated"
            data={data.totalCases.totalVaccinationsPerHundred}
            showsPercentage={true}
          />
          <PanelVaccinatedWithPercent
            title="% of people fully vaccinated"
            total={data.totalCases.peopleFullyVaccinated}
            percentage={data.totalCases.peopleFullyVaccinatedPerHundred}
          />
        </div>
        <div className="col-sm-7">
          <RadarChart
            id="vaccinationsContinent"
            chartTitle="Percent of vaccinations by continent"
            chartData={radarChartData}
            showsPercentage={true}
          />
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-sm">
          <StackedCountryBarGraph
            id="sortedAndTrimmedVaccinationData"
            chartTitle="Percent of people vaccinated"
            chartData={percentVaccineCountChartData}
            isStacked={true}
            showsPercentage={true}
          />
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-sm">
          <StackedCountryBarGraph
            id="sortedAndTrimmedVaccinationData"
            chartTitle="Total vaccinations"
            chartData={vaccineCountChartData}
            isStacked={true}
          />
        </div>
      </div>

      <div className="row">
        <DataTable
          sortConfig={tableSortParams}
          tableData={nonNullVaccinatedCountries}
          columnSchema={columns}
        />
      </div>
    </>
  )
}

export default VaccinationsInnerPage
