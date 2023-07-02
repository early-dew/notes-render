// require('dotenv').config()
const express = require('express')
const app = express()
const Note = require('./models/note')
const config = require('./utils/config')
const logger = require('./utils/logger')

// const baseUrl = 'https://notes-backend-4yg3.onrender.com'
// const baseUrl = 'http://localhost:3001/'

const cors = require('cors')



app.use(cors())

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(express.json())
app.use(requestLogger)


// const getAll = () => {
//   const request = axios.get(baseUrl)
//   return request.then(response => response.data)
// }



// let notes = [
//   {
//     id: 1,
//     content: "HTML is easy",
//     important: true
//   },
//   {
//     id: 2,
//     content: "Browser can execute only JavaScript",
//     important: false
//   },
//   {
//     id: 3,
//     content: "GET and POST are the most important methods of HTTP protocol",
//     important: true
//   }
// ]
app.get('/', (request, response) => {
  response.send('<h1>Notes App</h1>')
})

// app.get('/api/notes', (request, response) => {
//   response.json(notes)
// })
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })

})

app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) { response.json(note) }
      else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// app.get('/api/notes/:id', (request, response) => {
//   const id = Number(request.params.id)
//   const note = notes.find(note => note.id === id)

//   if (note) {
//     response.json(note)
//   } else {
//     response.status(404).end()
//   }

// })


app.delete('/api/notes/:id', (request, response) => {
  Note.findByIdAndRemove(request.params.id)
    // eslint-disable-next-line no-unused-vars
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// app.delete('/api/notes/:id', (request, response) => {
//   const id = Number(request.params.id)
//   notes = notes.filter(note => note.id !== id)
//   response.status(204).end()
// })

app.put('/api/notes/:id', (request, response, next) => {
  // const body = request.body
  const { content, important } = request.body

  // const note = {
  //   content: body.content,
  //   important: body.important,
  // }

  Note.findByIdAndUpdate(request.params.id, { content, important }, { new: true, runValidators: true, context: 'query' })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

app.post('/api/notes', (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(error => next(error))
})


// app.post('/api/notes', (request, response) => {
//   const body = request.body

//   if (body.content === undefined) {
//     return response.status(400).json({ error: 'content missing' })
//   }

//   const note = new Note({
//     content: body.content,
//     important: body.important || false,
//   })

//   note.save().then(savedNote => {
//     response.json(savedNote)
//   })
// })

// app.post('/api/notes', (request, response) => {

//   const note = request.body
//   console.log(note)
//   response.json(note)
// })



const unknownEndpoint = (request, response) => {
  console.log('Unknown endpoint:', request.method, request.path)
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
  console.log('errorHNADLER')
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

// const PORT = process.env.PORT
app.listen(config.PORT, () => {
  logger.info(`Server is running on port ${config.PORT}`)
})