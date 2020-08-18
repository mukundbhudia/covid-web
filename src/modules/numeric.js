const isNumeric = subject => typeof subject === 'number'

const getPercentageFromDataSet = (dataSet) => {
  return dataSet.map((item, i) => {
    const total = dataSet.reduce((count, dataItem) => {
      return count + dataItem.data
    }, 0)
    if (total === 0) {
      return 0
    } else {
      if (i+1 === dataSet.length) {
        item.percentage = Math.ceil((item.data/(total))*100) - 1
      } else {
        item.percentage = Math.ceil((item.data/(total))*100)
      }
      return item
    }
  })
}

/**
 * Moving average
 * --------------
 * Courtesy of `kaelzhang`_, under MIT License.
 *
 * .. _kaelzhang: https://github.com/kaelzhang/moving-averages
 *
 * With alterations and optimisation by Pouria Hadjibagheri.
 *
 * @param data { Array<number> } Array of numbers
 * @param size { number } Size of the moving window
 * @returns { Array<number> } Array of moving averages
 */
const movingAverage = ( data, size ) => {
  const
      length = data.length,
      prepare = size - 1,
      ret = Array(length).fill(NaN);

  let
      sum = 0,
      i = 0,
      counter = 0,
      datum;

  for ( ; i < length && counter < prepare; i++ ) {
      datum = data[i]

      if ( isNumeric(datum) ) {
          sum += datum;
          counter++
      }
  }

  for ( ; i < length; i++ ) {
      datum = data[i]

      if ( isNumeric(datum) )
          sum += datum;

      if ( isNumeric(data[i - size]) )
          sum -= data[i - size];

      ret[i] = sum / size
  }
  return ret.slice(size - 1)
}

// Finds out the first and highest number of confirmed cases and deaths
const calculateCaseScores = (casesArray, currentCases) => {
  const casesArrayIncludingCurrent = [...casesArray, currentCases]
  let lookForDeaths = true
  currentCases.day = new Date()

  const result = {
    firstCase: { count: null, day: null },
    firstDeath: { count: null, day: null },
    highestCases: { count: null, day: null },
    highestDeaths: { count: null, day: null },
  }

  // If a country has no reported deaths yet, there's no need to look for a maximum
  if (currentCases.deaths === 0) {
    lookForDeaths = false
  }

  let i = 1
  let topCase = 0
  let topDeath = 0

  while (i < casesArrayIncludingCurrent.length) {
    if (result.firstCase.count === null) {
      if (casesArrayIncludingCurrent[i-1].confirmedCasesToday > 0) {
        result.firstCase.day = casesArrayIncludingCurrent[i-1].day
        result.firstCase.count = casesArrayIncludingCurrent[i-1].confirmedCasesToday
      }
    }

    if (casesArrayIncludingCurrent[i].confirmedCasesToday > topCase) {
      topCase = casesArrayIncludingCurrent[i].confirmedCasesToday
      result.highestCases.day = casesArrayIncludingCurrent[i].day
      result.highestCases.count = topCase
    }

    if (lookForDeaths) {
      if (casesArrayIncludingCurrent[i-1].deathsToday > 0 && result.firstDeath.count === null) {
        result.firstDeath.day = casesArrayIncludingCurrent[i-1].day
        result.firstDeath.count = casesArrayIncludingCurrent[i-1].deathsToday
      }
      if (casesArrayIncludingCurrent[i].deathsToday > topDeath) {
        topDeath = casesArrayIncludingCurrent[i].deathsToday
        result.highestDeaths.day = casesArrayIncludingCurrent[i].day
        result.highestDeaths.count = topDeath
      }
    }

    i++
  }
  return result
}

export {
  movingAverage,
  getPercentageFromDataSet,
  calculateCaseScores,
}
