const chartColors = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  darkPurple: 'rgb(102, 68, 170)',
  grey: 'rgb(201, 203, 207)',
  darkGrey: 'rgb(160, 161, 164)',
  progressBadGrey: '#b0b0b0',
}

const multiChartColours = {
  purple: '#4527a0',
  red: '#d32f2f',
  green: '#00c853',
  blue: '#0277bd',
  yellow: '#fbc02d',
  orange: '#ff7043',
}

const generateRandomColour = (max) => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

const chooseRandomColours = (listOfColours) => {
  const randomNumberFromList = Math.floor(
    Math.random() * Math.floor(listOfColours.length)
  )
  return Object.keys(listOfColours)[randomNumberFromList]
}

export {
  chartColors,
  multiChartColours,
  generateRandomColour,
  chooseRandomColours,
}
