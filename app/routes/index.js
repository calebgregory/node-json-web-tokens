'use strict'

const { Router } = require('express')

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

router.use('/api', api)

module.exports = router
