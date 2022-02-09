const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('../models/userModels')

const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const cookie = require('cookie-parser')
const verified = require('../middleware/verifed')


router.get('/register', (req, res) => {
    res.render('register')
})


//nodemailer
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }

})

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body
        const hashPassword = await bcrypt.hash(password, 10)
        const user = new User({
            name,
            email,
            password: hashPassword,
            emailToken: crypto.randomBytes(64).toString('hex'),
            isVerified: false
        })


        const newUser = await user.save()

        //send mail
        transporter.sendMail({
            from: '"verify your email"<rajputtushar308@gmail.com>',
            to: user.email,
            subject: 'verify your email',
            html: `<h2>${user.name}! Thanks for registering on our site</h2>
           <h4>Please verify your mail to continue...</h4>
           <a href="http://${req.headers.host}/user/verify-email?token=${user.emailToken}">Verify your Email</a>`
        }, (err, detail) => {
            if (err) {
                console.log(err)
            } else {
                console.log("verification email is sent to your gmail account")
            }

        });
        res.redirect('/user/login')

    } catch (error) {
        console.log(error)
    }
})


router.get('/verify-email', async (req, res) => {
    try {
        const token = req.query.token
        const user = await User.findOne({ emailToken: token })
        if (user) {
            user.emailToken = null;
            user.isVerified = true;
            await user.save()
            res.redirect('/user/login')
        }
        else {
            res.redirect('/user/register')
            console.log("email is not verified")
        }
    } catch (err) {
        console.log(err)
    }
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', verified, async (req, res) => {
    try {
        const { email, password } = req.body
        const findUser = await User.findOne({ email: email })
        if (findUser) {
            const match = bcrypt.compare(password, findUser.password)
            if (match) {
                const token = jwt.sign({
                    id: findUser._id
                },
                    process.env.JWT_KEY,
                    {
                        expiresIn: '1h'
                    }
                )
                res.cookie('acces-token', token)

                res.redirect('/dashboard')
            }
            else {
                console.log('Invalid Password')
            }
        } else {
            console.log("User not registered")
        }
    } catch (err) {
        console.log(err)
    }
})

module.exports = router