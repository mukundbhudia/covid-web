import { gql } from 'apollo-boost'

export const COVID_TOTALS = gql`
  query {
    lastUpdated
    casesByLocation {
      idKey
      country
      province
      confirmed
      active
      recovered
      deaths
    }
  }
`
export const COVID_GLOBAL_PAGE = gql`
  query {
    totalCases {
      confirmed
      active
      recovered
      deaths
      confirmedCasesToday
      deathsToday
      dateOfFirstCase
      dateOfFirstDeath
      peopleFullyVaccinated
      totalVaccinations
      totalVaccinationsPerHundred
      peopleFullyVaccinatedPerHundred
      totalTests
      totalTestsPerThousand
      highestDailyConfirmed {
        count
        date
      }
      highestDailyDeaths {
        count
        date
      }
    }
    globalTimeSeries {
      confirmed
      deaths
      confirmedCasesToday
      deathsToday
      day
    }
    getAllDaysWithCases
  }
`

export const getCasesByIdKey = gql`
  query GetCases($idKeys: [String]!) {
    getManyCasesByIdKey(idKeys: $idKeys) {
      idKey
      country
      province
      confirmed
      active
      recovered
      deaths
      confirmedCasesToday
      deathsToday
      lastUpdate
      casesByDate {
        confirmed
        deaths
        confirmedCasesToday
        deathsToday
        day
      }
    }
  }
`
export const getCountryWithNoProvince = gql`
  query {
    casesByLocationWithNoProvince {
      idKey
      country
    }
  }
`

export const getDataTableCases = gql`
  query {
    casesByLocationWithNoProvince {
      idKey
      country
      confirmed
      confirmedCasesToday
      recovered
      deaths
      deathsToday
      totalTests
      peopleFullyVaccinated
      peopleFullyVaccinatedPerHundred
      lastUpdate
    }
  }
`

export const getTopCasesByLimit = gql`
  query TopCases($limit: Int!) {
    topXconfirmedByCountry(limit: $limit) {
      country
      confirmed
    }
    topXactiveByCountry(limit: $limit) {
      country
      active
    }
    topXrecoveredByCountry(limit: $limit) {
      country
      recovered
    }
    topXdeathsByCountry(limit: $limit) {
      country
      deaths
    }
    topXconfirmedTodayByCountry(limit: $limit) {
      country
      confirmedCasesToday
    }
    topXdeathsTodayByCountry(limit: $limit) {
      country
      deathsToday
    }
  }
`

export const getTodayTopCases = gql`
  query {
    totalCases {
      confirmedCasesToday
      deathsToday
    }
    topXconfirmedTodayByCountry(limit: 10) {
      country
      confirmedCasesToday
    }
    topXdeathsTodayByCountry(limit: 10) {
      country
      deathsToday
    }
    casesByLocationWithNoProvince {
      countryCode
      idKey
      confirmedCasesToday
      deathsToday
    }
  }
`

export const getHeatMapCases = gql`
  query {
    casesByLocationWithNoProvince {
      countryCode
      idKey
      confirmed
      active
      recovered
      deaths
      confirmedCasesToday
      deathsToday
    }
  }
`

export const getVaccinationData = gql`
  query {
    totalCases {
      population
      totalVaccinations
      peopleVaccinated
      peopleFullyVaccinated
      totalVaccinationsPerHundred
      peopleVaccinatedPerHundred
      peopleFullyVaccinatedPerHundred
    }
    casesByLocationWithNoProvince {
      idKey
      countryCode
      country
      continent
      population
      totalVaccinations
      peopleVaccinated
      peopleFullyVaccinated
      totalVaccinationsPerHundred
      peopleVaccinatedPerHundred
      peopleFullyVaccinatedPerHundred
    }
  }
`

export const getCountryCasesByIdKey = gql`
  query GetCases($idKey: String!) {
    getCasesByIdKey(idKey: $idKey) {
      country
      province
      confirmed
      active
      recovered
      deaths
      confirmedCasesToday
      deathsToday
      latitude
      longitude
      lastUpdate
      dateOfFirstCase
      dateOfFirstDeath
      peopleFullyVaccinated
      totalVaccinations
      totalVaccinationsPerHundred
      peopleFullyVaccinatedPerHundred
      totalTests
      totalTestsPerThousand
      highestDailyConfirmed {
        count
        date
      }
      highestDailyDeaths {
        count
        date
      }
      casesByDate {
        confirmed
        deaths
        confirmedCasesToday
        deathsToday
        day
      }
      provincesList {
        idKey
        province
      }
      hasProvince
    }
  }
`
export const getProvincesGivenCountryName = gql`
  query ProvincesGivenCountry($countryName: String!) {
    getProvincesGivenCountryName(country: $countryName) {
      province
      idKey
      active
      confirmed
      deaths
      confirmedCasesToday
      deathsToday
      recovered
    }
  }
`

export const getGlobalCasesGivenDate = gql`
  query GlobalCases($day: String!) {
    getGlobalCasesByDate(day: $day) {
      countryCode
      idKey
      confirmed
      active
      recovered
      deaths
      confirmedCasesToday
      deathsToday
    }
  }
`
