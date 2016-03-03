'use strict'

const { Router } = require('express')
const jwt = require('jsonwebtoken')

const router = Router()

router.get('/', (req, res) => res.send(`! (>'')> API is at http://localhost:${req.app.get('port')}/api`))

router.get('/setup', (req, res) => {
  const User = req.app.get('User')

  const trav = new User({
    name: 'TRAVIS TESTUSER',
    password: 'password', // **never** save passwords as plain text; **always** protect passwords by hashing them
    admin: true
  })

  trav.save((err) => {
    if (err) throw err
    console.log('User saved successfully')
    return res.json({ success: true })
  })
})

const api = Router()

api.post('/auth', (req, res) => {
  const User = req.app.get('User')

  User.findOne({
    name: req.body.name
  }, (err, user) => {
    if (err) throw err
    if (!user) {
      return res.json({ success: false, message: 'Authentication failed. User not found.' })
    } else if (user) {
      if (user['password'] !== req.body['password']) {
        return res.json({ success: false, message: 'Authentication failed. Wrong password.' })
      } else {
        const token = jwt.sign(user, req.app.get('superSecret'), {
          expiresIn: 1440 // 24 hr
        })

        return res.json({
          success: true,
          message: 'Enjoy le token~!',
          token
        })
      }
    }
  })
})

api.use((req, res, next) => { // middleware for verifying token
  const token = req.body['token'] || req.query['token'] || req.headers['x-access-token']

  if (token) {
    jwt.verify(token, req.app.get('superSecret'), (err, decoded) => {
      if (err) return res.json({ success: false, message: 'Failed to authenticate token.' })
      req.decoded = decoded
      next()
    })
  } else {
    return res.status(403).send({ success: false, message: 'No token provided.' })
  }
})

api.get('/', (req, res) => res.json({ message: `! (>'')> CONNECTED to API!` }))

api.get('/users', (req, res) => {
  const User = req.app.get('User')

  User.find({}, (err, users) => res.json(users))
})

router.use('/api', api)

module.exports = router
