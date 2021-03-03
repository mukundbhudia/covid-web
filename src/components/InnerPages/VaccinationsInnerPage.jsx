import React from 'react'
import { useQuery } from '@apollo/react-hooks'

import ErrorInnerPage from './ErrorInnerPage'
import LoadingInnerPage from './LoadingInnerPage'
import DataUpdatedTimeStamp from '../Nav/DataUpdatedTimeStamp'
import { getVaccinationData } from '../../modules/queries'
import { calculatePercentageWithDp } from '../../modules/numeric'
import RadarChart from '../Charts/RadarChart'
import TopXBarGraph from '../Charts/TopXBarGraph'
import PanelPeopleFullyVaccinated from '../Panels/PanelPeopleFullyVaccinated'
import PanelTotalVaccinations from '../Panels/PanelTotalVaccinations'

const MAX_COUNTRIES_TO_SHOW = 19

const VaccinationsInnerPage = ({ lastUpdated }) => {
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

  const nonNullVaccinatedCountries = data.casesByLocationWithNoProvince.filter(
    (country) => {
      return (
        country.totalVaccinations &&
        country.peopleVaccinated &&
        country.peopleFullyVaccinated
      )
    }
  )

  const percentOfPeopleFullyVaccinated = nonNullVaccinatedCountries
    .map((country) => {
      return {
        country: country.country,
        percentOfPeopleFullyVaccinated: calculatePercentageWithDp(
          country.peopleFullyVaccinated,
          country.population,
          2
        ),
      }
    })
    .sort((a, b) => {
      return b.percentOfPeopleFullyVaccinated - a.percentOfPeopleFullyVaccinated
    })
    .slice(0, MAX_COUNTRIES_TO_SHOW)

  const totalVaccinations = nonNullVaccinatedCountries
    .map((country) => {
      return {
        country: country.country,
        totalVaccinations: country.totalVaccinations,
      }
    })
    .sort((a, b) => {
      return b.totalVaccinations - a.totalVaccinations
    })
    .slice(0, MAX_COUNTRIES_TO_SHOW)

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
          <PanelPeopleFullyVaccinated
            title="% of people vaccinated"
            data={data.totalCases.peopleVaccinated}
            population={data.totalCases.population}
          />
        </div>
        <div className="col-sm">
          <PanelTotalVaccinations
            title="Total vaccinations per hundred"
            data={data.totalCases.totalVaccinationsPerHundred}
          />
          <PanelPeopleFullyVaccinated
            title="% of people fully vaccinated"
            data={data.totalCases.peopleFullyVaccinated}
            population={data.totalCases.population}
          />
        </div>
        <div className="col-sm-7">
          <RadarChart
            data={continents}
            id="vaccinationsContinent"
            chartTitle="Vaccinations by Continent"
            chartLabel="Vaccinations"
            chartLabelKey="confirmed"
            labelColor="red"
          />
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-sm">
          <TopXBarGraph
            data={totalVaccinations}
            id="totalVaccinations"
            chartTitle="Total vaccinations"
            chartLabel="Total vaccinations"
            chartLabelKey="totalVaccinations"
            labelColor="purple"
          />
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-sm">
          <TopXBarGraph
            data={percentOfPeopleFullyVaccinated}
            id="percentOfPeopleFullyVaccinated"
            chartTitle="Percentage of people fully vaccinated"
            chartLabel="Percentage of people fully vaccinated"
            chartLabelKey="percentOfPeopleFullyVaccinated"
            labelColor="green"
          />
        </div>
      </div>

      <div className="top-tab-container"></div>
    </>
  )
}

export default VaccinationsInnerPage
