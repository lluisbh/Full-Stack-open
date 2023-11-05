import { CountryWeather } from './CountryWeather'

const CountryData = ({data}) => <div>
    <h2>{data.name.common}</h2>
    <div>
      capital {data.capital[0]}<br/>
      area {data.area}
    </div>
    <h3>languages</h3>
    <ul>
    {Object.entries(data.languages).map(([key, language]) => <li key={key}>{language}</li>)}
    </ul>
    <img src={data.flags.png} alt={`${data.name.common} flag`} />
    <h3>Weather in {data.capital[0]}</h3>
    <CountryWeather data={data} />
</div>

export { CountryData }