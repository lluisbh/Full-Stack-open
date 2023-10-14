import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
  
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(Array(anecdotes.length).fill(0))

  const select_random = () => {
    const quote = Math.floor(Math.random() * anecdotes.length)
    setSelected(quote)
  }
  const vote_anecdote = () => {
    const copy = [...points]
    copy[selected] += 1
    setPoints(copy)
  }

  const find_most_voted = () => {
    let current_index = 0
    let current_score = 0
    for (let i=0; i<points.length; i++) {
      if (points[i] > current_score) {
        current_score = points[i]
        current_index = i
      }
    }
    return current_index
  }

  const most_votes = find_most_voted()

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <div>
        {anecdotes[selected]} <br/>
        has {points[selected]} votes<br/>
        <Button text="vote" handleClick={vote_anecdote} />
        <Button text="next anecdote" handleClick={select_random} />
      </div>
      <h1>Anecdote with most votes</h1>
      <div>
        {anecdotes[most_votes]} <br/>
        has {points[most_votes]} votes<br/>
      </div>
    </div>
  )
}

export default App