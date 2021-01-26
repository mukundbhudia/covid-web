const isNumeric = (subject) => typeof subject === 'number'

const getPercentageFromDataSet = (dataSet) => {
  return dataSet.map((item, i) => {
    const total = dataSet.reduce((count, dataItem) => {
      return count + dataItem.data
    }, 0)
    if (total === 0) {
      return 0
    } else {
      if (i + 1 === dataSet.length) {
        item.percentage = Math.ceil((item.data / total) * 100) - 1
      } else {
        item.percentage = Math.ceil((item.data / total) * 100)
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
const movingAverage = (data, size) => {
  const length = data.length,
    prepare = size - 1,
    ret = Array(length).fill(NaN)

  let sum = 0,
    i = 0,
    counter = 0,
    datum

  for (; i < length && counter < prepare; i++) {
    datum = data[i]

    if (isNumeric(datum)) {
      sum += datum
      counter++
    }
  }

  for (; i < length; i++) {
    datum = data[i]

    if (isNumeric(datum)) sum += datum

    if (isNumeric(data[i - size])) sum -= data[i - size]

    ret[i] = sum / size
  }
  return ret.slice(size - 1)
}

export { movingAverage, getPercentageFromDataSet }
