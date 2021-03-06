import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'

import ErrorInnerPage from './ErrorInnerPage'
import LoadingInnerPage from './LoadingInnerPage'
import { getCountryCasesByIdKey } from '../../modules/queries'
import CountryNotFound from './CountryNotFound'
import PanelTimeSeries from '../Panels/MultiPanels/PanelTimeSeries'
import DataUpdatedTimeStamp from '../Nav/DataUpdatedTimeStamp'
import ProvincesMenu from '../Nav/ProvincesMenu'
import PanelCurrentCases from '../Panels/MultiPanels/PanelCurrentCases'

const InnerPage = () => {
  let { id } = useParams()
  const { loading, error, data } = useQuery(getCountryCasesByIdKey, {
    variables: { idKey: id },
  })
  if (loading) return <LoadingInnerPage />
  if (error) return <ErrorInnerPage errorData={error} />

  let getCasesByIdKey = data && data.getCasesByIdKey[0]

  if (!getCasesByIdKey) {
    return <CountryNotFound />
  }
  let lastUpdated = getCasesByIdKey.lastUpdate
  let idKey = id

  const genPageTitle = (country, province) => {
    if (province) {
      return `${country} - ${province}`
    } else {
      return `${country}`
    }
  }

  const confirmedVsActiveProgressBar = [
    {
      data: getCasesByIdKey.confirmed,
      label: 'confirmed',
      color: 'red',
    },
    {
      data: getCasesByIdKey.confirmed - getCasesByIdKey.active,
      label: 'active',
      color: 'blue',
    },
  ]

  const recoveredVsDeathsProgressBar = [
    {
      data: getCasesByIdKey.recovered,
      label: 'recovered',
      color: 'green',
    },
    {
      data: getCasesByIdKey.deaths,
      label: 'deaths',
      color: 'progressBadGrey',
    },
  ]

  const currentCases = {
    confirmed: getCasesByIdKey.confirmed,
    active: getCasesByIdKey.active,
    recovered: getCasesByIdKey.recovered,
    deaths: getCasesByIdKey.deaths,
    confirmedCasesToday: getCasesByIdKey.confirmedCasesToday,
    deathsToday: getCasesByIdKey.deathsToday,
    dateOfFirstCase: getCasesByIdKey.dateOfFirstCase,
    dateOfFirstDeath: getCasesByIdKey.dateOfFirstDeath,
    highestDailyConfirmed: getCasesByIdKey.highestDailyConfirmed,
    highestDailyDeaths: getCasesByIdKey.highestDailyDeaths,
    peopleFullyVaccinated: getCasesByIdKey.peopleFullyVaccinated,
    totalVaccinations: getCasesByIdKey.totalVaccinations,
    totalVaccinationsPerHundred: getCasesByIdKey.totalVaccinationsPerHundred,
    peopleFullyVaccinatedPerHundred:
      getCasesByIdKey.peopleFullyVaccinatedPerHundred,
    totalTests: getCasesByIdKey.totalTests,
    totalTestsPerThousand: getCasesByIdKey.totalTestsPerThousand,
  }

  const pageTitle = genPageTitle(
    getCasesByIdKey.country,
    getCasesByIdKey.province
  )

  return (
    <>
      <div id={idKey} className="">
        <h3>{pageTitle}</h3>
      </div>
      <div className="row">
        <DataUpdatedTimeStamp lastUpdated={lastUpdated} />
      </div>

      <PanelCurrentCases
        cases={getCasesByIdKey.casesByDate}
        currentCases={currentCases}
        confirmedVsActiveProgressBar={confirmedVsActiveProgressBar}
        recoveredVsDeathsProgressBar={recoveredVsDeathsProgressBar}
      />

      {(getCasesByIdKey.province || getCasesByIdKey.hasProvince) && (
        <ProvincesMenu countryName={getCasesByIdKey.country} idKey={idKey} />
      )}

      <PanelTimeSeries
        cases={getCasesByIdKey.casesByDate}
        currentCases={currentCases}
        title={pageTitle}
      />
    </>
  )
}

export default InnerPage
