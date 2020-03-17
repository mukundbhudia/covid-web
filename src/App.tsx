import React from 'react'

import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'

type Cases = {
  confirmed: string
  country: string
  province: string
}

const COVID_TOTALS = gql`
  query {
    casesByLocation {
      confirmed
      country
      province
    }
    totalCases {
      totalConfirmed,
      totalRecovered,
      totalDeaths,
    }
  }
`;

const App: React.FC = () => {
  const { loading, error, data } = useQuery(COVID_TOTALS)
  if (loading) return <p>Loading...</p>
  if (error) return <p>{JSON.stringify(error, null, 2)}</p>

  return (
    <div>
      <h2>My first Apollo app <span role="img" aria-label="image">🚀</span></h2>
      <div className='container'>
      <ul>
        {data.casesByLocation.map(({ country, province, confirmed }: Cases, index: number) => (
          <li key={index}>{country} - {province}: {confirmed}</li>
        ))}
      </ul>
      </div>
    </div>
  )
}

export default App
