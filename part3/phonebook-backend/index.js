require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

const app = express()
morgan.token('body', (request) => {
    if (request.method !== 'POST') return ''
    return JSON.stringify(request.body)
})

app.use(express.json())
app.use(express.static('static_dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())

app.get('/api/persons', (request, response) => {
    Person.find({}).then(result => {
        response.json(result)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(result => {
        if (result) {
            response.json(result)
        } else {
            response.status(404).end()
        }
    }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id).then(result => {
        response.status(204).end()
        return result
    }).catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    const person = new Person({
        name: body.name,
        number: body.number,
    })
    person.save()
        .then(result => {
            response.json(result)
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const person = {
        name: request.body.name,
        number: request.body.number
    }
    Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true })
        .then(result => {
            response.json(result)
        })
        .catch(error => next(error))
})

app.get('/info', (request, response) => {
    const datetime = new Date()
    Person.countDocuments().then(count => {
        response.send(`
        <p>
            Phonebook has info for ${count} people
        </p>
        <p>
            ${datetime.toString()}
        </p>
        `)
    })
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
