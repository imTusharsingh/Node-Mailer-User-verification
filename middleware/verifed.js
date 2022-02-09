const User = require('../models/userModels')

const verified = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (user.isVerified) {
            next()
        } else {
            console.log("please,check your account to verify email")

        }
    } catch (err) {
        console.log(err)

    }
}

module.exports = verified