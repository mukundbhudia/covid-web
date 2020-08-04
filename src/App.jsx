import React from 'react'

import { useQuery } from '@apollo/react-hooks'

import './App.css'
import HomeInnerPage from '../src/components/InnerPages/HomeInnerPage'
import { COVID_TOTALS } from './modules/queries'

const App = () => {
  const { loading, error, data } = useQuery(COVID_TOTALS)

  let content
  if (loading) {
    content = (
      <HomeInnerPage casesByLocation={[]} lastUpdated={''}/>
    )
  } else if (error) {
    content = (<p>{JSON.stringify(error, null, 2)}</p>)
  } else {
    const lastUpdated = data.lastUpdated
    const casesByLocation = data.casesByLocation
    content = (
      <HomeInnerPage casesByLocation={casesByLocation} lastUpdated={lastUpdated}/>
    )
  }

  return content
}

export default App
