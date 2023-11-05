import { CountryData } from './CountryData'

const Results = ({countries, setCountries}) => {
  if (!countries) {
    return null
  }
  if (countries.length > 10) {
    return <div>
      Too many matches, specify another filter
    </div>
  }
  if (countries.length === 1) {
    return <CountryData data={countries[0]} />
  }
  //Show list
  return <div>
    {countries.map(value => 
    <div key={value.cca3}> 
      {value.name.common} 
      <button onClick={() => setCountries([value])}>Show</button> 
      </div>)}
  </div>
}

export {Results}