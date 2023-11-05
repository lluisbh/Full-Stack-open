import axios from 'axios'
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather'
const apiKey = import.meta.env.VITE_SOME_KEY

const getCurrentWeather = (lat, lon) => {
  return axios.get(baseUrl, {
    params : {
        lat: lat,
        lon: lon,
        units: "metric",
        lang: "en",
        appid: apiKey
    }
  }).then(response => response.data)
}

export default { getCurrentWeather }