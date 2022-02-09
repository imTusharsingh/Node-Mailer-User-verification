const express = require('express')
const loginRequired = require('../middleware/JWT')
const router = express.Router()


router.get('/', (req, res) => {
    res.render('index')
})

router.get('/dashboard', loginRequired, (req, res) => {
    res.render('dashboard')
})

router.get('/logout', (req, res) => {
    res.cookie('acces-token', "", { maxAge: 1 })
    res.redirect('/user/login')
})

module.exports = router