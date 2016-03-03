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

api.get('/', (req, res) => res.json({ message: `! (>'')> CONNECTED to API!` }))

api.get('/users', (req, res) => {
  const User = req.app.get('User')

  User.find({}, (err, users) => res.json(users))
})

api.post('/auth', (req, res) => {
  const User = req.app.get('User')

  console.log(req.body)

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
          expiresInMinutes: 1440 // 24 hr
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

router.use('/api', api)

module.exports = router
