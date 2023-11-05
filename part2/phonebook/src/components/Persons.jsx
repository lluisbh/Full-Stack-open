import { Person } from './Person'

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

export { Persons }