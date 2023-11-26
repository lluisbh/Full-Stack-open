const Person = ({name, number, id, onDelete}) => 
  <div>
    {name} {number} 
    <button onClick={() => onDelete(id)}>delete</button> 
    <br/>
  </div>

export { Person }