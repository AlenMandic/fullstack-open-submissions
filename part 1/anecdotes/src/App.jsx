import { useState } from 'react'

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
  
  const numberOfAnecdotes = anecdotes.length // this time: 8
  const starterArray = [];

  for(let i = 0; i < numberOfAnecdotes; i++) {
    starterArray.push(0)
  }

   const [selected, setSelected] = useState(0)
   const [points, setPoints] = useState(starterArray)
   const [popular, setPopular] = useState(0)
   

   function handleClick() {
    const randomNumber = Math.floor(Math.random() * 8);
    setSelected(randomNumber)
   }

   function handleVote() {

    setPoints(() => {
     const updatedPoints = [...points];
     
     updatedPoints[selected] += 1;
     setPopular(points.indexOf(Math.max(...points)))
     return updatedPoints
    })
    
   }

  return (
    <div>
      <h2>Anecdote of the day</h2>
      <h3>{anecdotes[selected]}</h3>
      <br />
      Has {points[selected]} points
      <br />
      <button onClick={handleVote}>Vote for anecdote</button>
      <button onClick={handleClick}>Next anecdote</button>
      <br />
      <h2 style={{marginTop: '40px'}}>Anecdote with most votes</h2>
      <h3>{anecdotes[popular]}</h3>
      Has {points[popular]} points
    </div>
  )
}

export default App
