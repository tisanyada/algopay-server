const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const app = express()


// config
const connect = require('./config/connect')


// middlewares
var allowlist = ['https://algopay.vercel.app', 'https://focused-engelbart-f06e9e.netlify.app', 'http://localhost:3000']
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

app.use(cors(corsOptionsDelegate))
app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


// routes
app.use('/students', require('./routes/students'))
app.use('/faculty', require('./routes/faculty'))
app.use('/department', require('./routes/department'))


connect(app)