'use strict'
'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')

const config = require('../config')
const User = require('./models/user')

const app = express()

app.set('port', config.PORT)
app.set('User', User)
app.set('superSecret', config.secret)

mongoose.connect(config.database)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(morgan('dev'))

app.use(require('./routes'))

const server = app.listen(app.get('port'),
  (err) => err ?
    console.error(`FAILURE TO LISTEN: ${err}`) :
    console.log(`! (>'')> LISTENING on http://localhost:${server.address().port}`)
)
