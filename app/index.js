'use strict'
'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const config = require('../config')
const User = require('./models/user')

const app = express()

app.set('port', config.PORT)
mongoose.connect(config.database)
app.set('superSecret', config.secret)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(morgan('dev'))

app.get('/', (req, res) => res.send(`! (>'')> API is at http://localhost:${app.get('port')}/api`))

app.listen(app.get('port'))
