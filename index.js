const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000
const dotenv = require('dotenv').config()
const hbs = require('hbs')
const { urlencoded } = require('express')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')

const userRoute = require('./Routes/user')
const homeRoute = require('./Routes/home')

app.use(urlencoded({ extended: false }))
app.set('view engine', 'hbs')
require('./db/connect')




app.use(cookieParser())
app.use(express.json())
app.use(morgan('dev'))



app.use('/', homeRoute)
app.use('/user', userRoute);








app.listen(PORT, () => {
    console.log(`server running at ${PORT}`)
});