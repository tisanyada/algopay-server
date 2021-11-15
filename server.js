const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const app = express()


// config
const connect = require('./config/connect')


// middlewares
app.use(cors())
app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


// routes
app.use('/students', require('./routes/students'))
app.use('/faculty', require('./routes/faculty'))
app.use('/department', require('./routes/department'))


connect(app)