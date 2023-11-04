import { useState, useEffect } from 'react'
import personsService from './services/persons.js'

const Notification = ({message, type}) => {
  if (message === null) {
    return null
  }

  return <div className={type}>
    {message}
  </div>
}

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

const Person = ({name, number, id, onDelete}) => 
  <div>
    {name} {number} 
    <button onClick={() => onDelete(id)}>delete</button> 
    <br/>
  </div>

const Persons = ({persons, filterName, onDelete}) => {
  const personsToShow = persons.filter(person => 
    person.name.toLowerCase().includes(filterName.toLowerCase())
  )
  return <div>
    {personsToShow.map((person) => 
      <Person key={person.id} name={person.name} number={person.number} id={person.id} onDelete={onDelete}/>
    )}
  </div>
}

const App = () => {
  const [message, setMessage] = useState({text: null, type: null})

  const resetMessage = () => setMessage({text: null, type: null});
  const setMessageError = (messageText) => {
    setMessage({
      text: messageText,
      type: 'error'
    })
    setTimeout(resetMessage, 5000)
  }
  const setMessageConfirm = (messageText) => {
    setMessage({
      text: messageText,
      type: 'confirm'
    })
    setTimeout(resetMessage, 2000)
  }

  const [persons, setPersons] = useState([]) 
  const [filter, setFilter] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  useEffect(() => {
    personsService
      .getAll()
      .then(personsData => setPersons(personsData))
  }, [])
  
  const handleFilterChange = event => setFilter(event.target.value)
  const handleNameChange = event => setNewName(event.target.value)
  const handleNumberChange = event => setNewNumber(event.target.value)

  const addName = (event) => {
    event.preventDefault()
    if (newName !== "" && newNumber !== "") {
      //Check if it is already in the list
      const existingPerson = persons.find((person) => person.name === newName)
      if (existingPerson) {
        //Confirm replacement
        if (window.confirm(`${existingPerson.name} is already added to phonebook, replace the old number with a new one?`)) {
          personsService
            .update(existingPerson.id, {... existingPerson, number: newNumber})
            .then(personData => {
                setPersons(persons.map(person => person.id === existingPerson.id ? personData : person))
                setNewName('')
                setNewNumber('')
                setMessageConfirm(`${existingPerson.name}'s number was changed`)
            })
        }
      } else {
        // Add name
        const nameObject = {
          name: newName,
          number: newNumber,
        }
        personsService
          .create(nameObject)
          .then(personsData => {
            setPersons(persons.concat(personsData))
            setNewName('')
            setNewNumber('')
            setMessageConfirm(`Added ${newName}`)
          })
      }
    }
  }

  const deletePerson = id => {
    const personName = persons.find(person => person.id === id).name
    if (window.confirm(`Delete ${personName}?`)) {
      personsService.deleteId(id)
      .then(response => {
        setPersons(persons.filter(person => person.id !== id))
        setMessageConfirm(`Removed ${personName}`)
      })
      .catch(error => {
        setPersons(persons.filter(person => person.id !== id))
        setMessageError(`Information of ${personName} has already been removed from server`)
      })
    }
  }

  return (
    <div>
      <Notification message={message.text} type={message.type}/>
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
        <Persons persons={persons} filterName={filter} onDelete={deletePerson} />
    </div>
  )
}

export default App