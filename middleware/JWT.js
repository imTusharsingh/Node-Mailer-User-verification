const jwt = require('jsonwebtoken')

const cookie = require('cookie-parser')

const loginRequired = async (req, res, next) => {
    const token = req.cookies['acces-token']
    // console.log(token)

    if (token) {
        const validtoken = await jwt.verify(token, process.env.JWT_KEY)
        if (validtoken) {
            res.user = validtoken.id
            next()
        } else {
            console.log("token expires")
            res.redirect('/user/login')
        }

    }
    else {
        console.log('token not found')
        res.redirect('/user/login')
    }
}

module.exports = loginRequired