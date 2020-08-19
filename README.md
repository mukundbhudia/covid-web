# Covid-19 Web Dashboard

COVID-19 Coronavirus dashboard. A dashboard to show global data gathered on the COVID-19 virus pandemic.
The SARS‑CoV‑2 virus is part of a class of viruses called Coronaviruses. It is SARS‑CoV‑2 that causes the COVID-19 disease.
Data sources: Johns Hopkins University Center for Systems Science and Engineering (JHU CSSE).

Production build at: https://covid19.mukund.uk/.
<br />
Additional URLs: https://mukundbhudia.gitlab.io/covid-web/ and https://mukundbhudia.github.io/covid-web/.

![Global page on the Covid-19 dashboard](https://github.com/mukundbhudia/covid-web/raw/master/screenshots/global-dashboard.png)

Related projects: https://github.com/mukundbhudia/covid-api and https://github.com/mukundbhudia/covid-service

## Prerequisites
* Node v14.x.x
* NPM v6.x.x
* covid-web needs [covid-api](https://github.com/mukundbhudia/covid-api) to be running (which in turn also needs [covid-service](https://github.com/mukundbhudia/covid-service) to have run at least once).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Thanks

* To [Johns Hopkins CSSE](https://github.com/CSSEGISandData/COVID-19) for the hard work providing and collating the data.
* To [Salomão Rodrigues](https://github.com/salomao-rodrigues) for teaching me React and helping me get started.
