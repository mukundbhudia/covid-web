import React from 'react'

import { useQuery } from '@apollo/react-hooks'

import './App.css'
import ErrorInnerPage from './components/InnerPages/ErrorInnerPage'
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
    content = (<ErrorInnerPage errorData={error}/>)
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
