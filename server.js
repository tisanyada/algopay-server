const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const app = express()


// config
const connect = require('./config/connect')


// middlewares
app.options("*", cors({
    origin: ['*', 'https://algopay.vercel.app', 'https://focused-engelbart-f06e9e.netlify.app', 'http://localhost:3000'],
    credentials: true,
    preflightContinue: true,
    optionsSuccessStatus: 200
}));
app.use(cors({
    origin: ['*', 'https://algopay.vercel.app', 'https://focused-engelbart-f06e9e.netlify.app', 'http://localhost:3000'],
    credentials: true,
    preflightContinue: true,
    optionsSuccessStatus: 200
}))
app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


// routes
app.use('/students', require('./routes/students'))
app.use('/faculty', require('./routes/faculty'))
app.use('/department', require('./routes/department'))


connect(app)
