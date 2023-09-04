import './style.css'

function Header({ course }) {
  return <h1>{course}</h1>
}

function Part({ part }) {
  return(
    part.map((item, index) =>
      <p key={index}>{item.name} {item.exercises}</p>
      )
  )
}

function Content({ part }) {
  return (
    <div>
      <Part part={part}/>
    </div>
  )
}

function Total({ part }) {
  let sum = 0;
  
  part.map(item => {
    sum += item.exercises
    return null
  })

  return <p>Total: {sum}</p>
}

const App = () => {

  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course.name} />
      <Content part={course.parts} />
      <Total part={course.parts} />
    </div>
  )
}

export default App
