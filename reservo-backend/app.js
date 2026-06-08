const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const errorHandler = require('./middlewares/errorHandler')
const routes = require('./routes/index')

const app = express()

// Seguridad
app.use(helmet())
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}))

// Parseo
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Logs
app.use(morgan('dev'))

// Rutas
app.use('/api/v1', routes)

// Manejo de errores
app.use(errorHandler)

module.exports = app