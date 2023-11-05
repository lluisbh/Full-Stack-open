import { useState, useEffect } from 'react'
import openweather from '../services/openweather'

const CountryWeather = ({data}) => {
    const [weatherData, setWeatherData] = useState(null)
  
    useEffect(() => {
      setWeatherData(null)
      openweather
        .getCurrentWeather(data.capitalInfo.latlng[0],data.capitalInfo.latlng[1])
        .then(response => setWeatherData(response))
    }, [data.name.common])
  
    if (!weatherData) return null
  
    return <div>
      temperature {weatherData.main.temp} Celsius <br/>
      <img
        src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} 
        alt={weatherData.weather[0].main} 
      /> <br/>
      wind {weatherData.wind.speed} m/s
    </div>
  }

export {CountryWeather}