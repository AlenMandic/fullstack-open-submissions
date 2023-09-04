import './style.css'

import { useState } from 'react'

function ButtonType({ type, value }) {

  return <button onClick={value}>{type}</button>

}

function Statistics({ good, neutral, bad }) {

  const total = good + neutral + bad
  const average = (good + neutral + bad) / 3
  const positive = (good / (good + neutral + bad)) * 100
  let positivePercent;

  if (isNaN(positive)) {
    positivePercent = '0%'
  } else {
    positivePercent = `${positive}%`
  }

  if (good === 0 && neutral === 0 && bad === 0) {

    return (
      <>
        <h2>Statistics</h2>
        <p>No feedback given</p>
      </>
    )

  } else {

    return (
      <table>
        <tbody>
          <tr><td><h2>Statistics: </h2></td></tr>
          <tr><td>Good: {good}</td></tr>
          <tr><td>Neutral: {neutral}</td></tr>
          <tr><td>Bad: {bad}</td></tr>
          <tr><td>Total: {total}</td></tr>
          <tr><td>Average: {average}</td></tr>
          <tr><td>Positive: {positivePercent}</td></tr>
        </tbody>
      </table>
    )
  }

}

const App = () => {
  
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <>
      <ButtonType type={'Good'} value={() => setGood(good + 1)} />
      <ButtonType type={'Neutral'} value={() => setNeutral(neutral + 1)} />
      <ButtonType type={'Bad'} value={() => setBad(bad + 1)} />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </>
  )
}

export default App