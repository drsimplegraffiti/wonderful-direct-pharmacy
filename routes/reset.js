const express = require('express');
const passport = require('passport');
const router = express.Router();
const JWT_SECRET = 'secret';



// import user model
const User = require('../models/User');


// forgot password
router.get('/forgot-password', (req, res, next) => {
    res.render('forgot-password')

})

// forgot password
router.post('/forgot-password', (req, res, next) => {
    const { email } = req.body;

    //Make sure user exist in db
    if (email !== User.email) {
        res.send('User not registered');
        return
    }

    // User exist and create one time link valid for 15 minutes
    const secret = JWT_SECRET + user.password
    const payload = {
        email: user.email,
        id: user.id
    }

    const token = jwt.sign(payload, secret, { expiresIn: '15m' })
    const link = `http://localhost:3000/reset-password/${User.id}/${token}`
    console.log(link)
    res.send('password reset link has been sent to your email...')
})

// Reset password
router.get('/reset-password/:id/:token', (req, res, next) => {
    const { id, token } = req.params;

    //check if id exist in db
    if (id !== User.id) {
        res.send('invalid id...')
        return
    }

    //we have a valid id
    const secret = JWT_SECRET + User.password
    try {
        const payload = jwt.verify(token, secret)
        res.render('reset-password', { email: User.email })
    } catch (error) {
        console.log(error.message);
        res.send(error.message);

    }

    // Reset password
})
router.post('/reset-password/:id/:token', (req, res, next) => {
    const { id, token } = req.params;
    const { password, password2 } = req.body;

    //check if id exist in db
    if (id !== User.id) {
        res.send('invalid id...')
        return
    }

    const secret = JWT_SECRET + User.password
    try {
        const payload = jwt.verify(token, secret)
            // validate password and password should match
        user.password = password
        res.send(User)

    } catch (error) {
        console.log(error.message)
        res.send(error.message)
    }
})

module.exports = router;