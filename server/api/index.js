const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(logger('combined'))

// Api routes
const upload = require('./routes/upload.js')

// Use routes routes
app.use(upload)

module.exports = {
  path: '/api',
  handler: app
}
