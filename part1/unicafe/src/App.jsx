import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const StatisticLine = ({text, value}) => (
  <tr>
    <td>{text}</td> 
    <td>{value}</td>
  </tr>
)

const Statistics = ({good, neutral, bad}) => {
  const all_votes = good + neutral + bad
  
  if (all_votes == 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }

  const score_good = 1
  const score_average = 0
  const score_bad = -1
  const score_votes = good * score_good + neutral * score_average + bad * score_bad

  const average = score_votes/all_votes
  const positive = good/all_votes

  return(
    <table>
      <tbody>
      <StatisticLine text = "good" value = {good} />
      <StatisticLine text = "neutral" value = {neutral} />
      <StatisticLine text = "bad" value = {bad} />
      <StatisticLine text = "all" value = {all_votes} />
      <StatisticLine text = "average" value = {average} />
      <StatisticLine text = "positive" value = {positive*100 + "%"} /> 
      </tbody>
    </table>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button text="good" handleClick={() => setGood(good+1)}/>
      <Button text="neutral" handleClick={() => setNeutral(neutral+1)}/>
      <Button text="bad" handleClick={() => setBad(bad+1)}/>
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App