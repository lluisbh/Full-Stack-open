import { useState } from 'react'

const Filter = ({value, onChangeValue}) => 
  <div>
    filter shown with <input value={value} onChange={onChangeValue}/>
  </div>

const PersonForm = ({onSubmit, name, onNameChange, number, onNumberChange}) =>
  <form onSubmit={onSubmit}>
    <div>
      name: <input value={name} onChange={onNameChange}/>
    </div>
    <div>
      number: <input value={number} onChange={onNumberChange}/>
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>

const Person = ({name, number}) => <div>{name} {number}<br/></div>

const Persons = ({persons, filterName}) => {
  const personsToShow = persons.filter(person => 
    person.name.toLowerCase().includes(filterName.toLowerCase())
  )
  return <div>
    {personsToShow.map((person) => <Person key={person.name} name={person.name} number={person.number} />)}
  </div>
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 

  const [filter, setFilter] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  
  const handleFilterChange = event => setFilter(event.target.value)
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const addName = (event) => {
    event.preventDefault()
    //Check if it is already in the list
    if (persons.some((person) => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
    } else if (newName !== "" && newNumber !== "") {
      // Add name
      const nameObject = {
        name: newName,
        number: newNumber,
      }
      setPersons(persons.concat(nameObject))
      setNewName('')
      setNewNumber('')
    }
    
  }

  return (
    <div>
      <h2>Phonebook</h2>
        <Filter value={filter} onChangeValue={handleFilterChange} />
      <h2>add a new entry</h2>
      <PersonForm
        onSubmit={addName}
        name={newName}
        number={newNumber}
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} filterName={filter} />
    </div>
  )
}

export default App