'use strict'

const { Router } = require('express')

const router = Router()

router.get('/', (req, res) => res.send(`! (>'')> API is at http://localhost:${req.app.get('port')}/api`))

module.exports = router
