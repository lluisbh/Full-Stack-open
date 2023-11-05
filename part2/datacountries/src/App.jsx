import { useState, useEffect } from 'react'

import restcountries from './services/restcountries'

import { Filter } from './components/Filter'
import { Results } from './components/Results'

const App = () => {
  const [filter, setFilter] = useState("")
  const [countriesAll, setCountriesAll] = useState(null)
  const [countriesFiltered, setCountriesFiltered] = useState(null)

  useEffect(()=> {
    restcountries
    .getAll()
    .then(data => {
      setCountriesAll(data)
      setCountriesFiltered(
        data.filter(
          value => value.name.common.toLowerCase().includes(filter.toLowerCase())
        )
      )
    })
  }, [])

  const handleFilterChange = event => {
    setFilter(event.target.value)
    if (countriesAll) {
      setCountriesFiltered(
        countriesAll.filter(
          value => value.name.common.toLowerCase().includes(event.target.value.toLowerCase())
        )
      )
    }
  }

  return <div>
    <Filter value={filter} onChange={handleFilterChange} />
    <Results countries={countriesFiltered} setCountries={setCountriesFiltered} />
  </div>
}

export default App
