import React from 'react'
import { useQuery } from '@apollo/react-hooks'

import ErrorInnerPage from './ErrorInnerPage'
import LoadingInnerPage from './LoadingInnerPage'
import DataUpdatedTimeStamp from '../Nav/DataUpdatedTimeStamp'
import { getVaccinationData } from '../../modules/queries'
import RadarChart from '../Charts/RadarChart'
import TopXBarGraph from '../Charts/TopXBarGraph'

const VaccinationsInnerPage = ({ lastUpdated }) => {
  const { loading, error, data } = useQuery(getVaccinationData)

  if (loading) return <LoadingInnerPage />
  if (error) return <ErrorInnerPage errorData={error} />

  const continents = new Map()

  console.log(data)

  data.casesByLocationWithNoProvince.forEach((country) => {
    let continent = country.continent
    let foundContinent = continents.get(continent)
    if (continent) {
      if (foundContinent) {
        foundContinent.totalVaccinations += country.totalVaccinations
        foundContinent.peopleFullyVaccinated += country.peopleFullyVaccinated
        continents.set(continent, foundContinent)
      } else {
        continents.set(continent, {
          totalVaccinations: 0,
          peopleFullyVaccinated: 0,
        })
      }
    }
  })

  let percentBar = data.casesByLocationWithNoProvince
    .filter((country) => {
      return (
        country.totalVaccinations &&
        country.peopleVaccinated &&
        country.peopleFullyVaccinated
      )
    })
    .map((country) => {
      return {
        country: country.country,
        percentOfPeopleFullyVaccinated: (
          (country.peopleFullyVaccinated / country.population) *
          100
        ).toFixed(2),
      }
    })
    .sort((a, b) => {
      return b.percentOfPeopleFullyVaccinated - a.percentOfPeopleFullyVaccinated
    })
    .slice(0, 19)

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
            data={percentBar}
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
