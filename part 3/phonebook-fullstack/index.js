require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(express.static('dist'))
app.use(morgan('tiny'))
app.use(cors())

const Person = require("./models/person") // const Person = mongoose.model('Person', personSchema)

const unknownEndpoint = (request, response) => {
  console.log(request)
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if(error.name === 'CastError') {
    return res.status(400).send({ error: 'Malformatted ID' })
  } else if(error.name === 'ValidationError') {
    return res.status(400).send({ error: error.message })
  }
  next(error)
}

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(result => {
    res.json(result)
  })
})

app.get('/api/info', (req, res) => {
  const phonebookLength = Person.find({}).then(result => {
    res.json(`Phonebook currently has ${result.length} people at ${new Date()}`)
  }).then(documentLength => {
    res.send(phonebookLength)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findById(id).then(person => {
    if(person) {
      res.json(person)
    } else {
      return res.status(404).end() // handle if person doesn't exist routing (invalid ID)
    }
  })
    .catch(error =>  next(error)) // if the above promise returned by findById() get's rejected, do this.
})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findByIdAndRemove(id).then(result => {
    res.status(204).end()
  })
    .catch(error => next(error))  // next(error) forwards any errors logged to be handled by our error middleware below.
})

// Validation is off by default in mongoose for 'updater' methods like PUT. In order to turn them on we have to add the parameter to the findByIdAndUpdate function: { new: true, runValidators: true, context: 'query' }
app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(req.params.id, person,  { new: true, runValidators: true, context: 'query' }).then(updatedPerson => {
    console.log(updatedPerson)

    res.json(updatedPerson)

  }).catch(error => {
    console.log(error)
    next(error)
  })
})

app.post('/api/persons', (req, res, next) => {
  const newEntry = req.body

  if (newEntry.name === undefined || newEntry.number === undefined) {
    return res.status(400).json({ error: 'content missing' })
  }

  const person = new Person({
    name: newEntry.name,
    number: newEntry.number,
  })

  person.save().then(newPerson => {
    res.json(newPerson)
  })
    .catch(error => {
      next(error)
    })
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`)
})
