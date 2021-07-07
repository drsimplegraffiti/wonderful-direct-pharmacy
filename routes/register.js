const express = require('express');
const passport = require('passport');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { requireAuth, checkUser } = require('../middleware/authMiddleware');
const localStrategy = require('passport-local').Strategy;
const SECRET = "net ninja secret";

// Load User model
const User = require('../models/User');


// handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '' };

    // incorrect email
    if (err.message === 'incorrect email') {
        errors.email = 'That email is not registered';
    }

    // incorrect password
    if (err.message === 'incorrect password') {
        errors.password = 'That password is incorrect';
    }

    // duplicate email error
    if (err.code === 11000) {
        errors.email = 'that email is already registered';
        return errors;
    }

    // validation errors
    if (err.message.includes('user validation failed')) {
        // console.log(err);
        Object.values(err.errors).forEach(({ properties }) => {
            // console.log(val);
            // console.log(properties);
            errors[properties.path] = properties.message;
        });
    }

    return errors;
}

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, 'net ninja secret', {
        expiresIn: maxAge
    });
};


// @desc    Register
// @route   GET /register
router.get('/register', (req, res) => {
    res.render('register', {
        layout: 'register'
    })
})

// Register
router.post('/register', async(req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.create({ email, password });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user._id });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }

})


// @desc Login 
router.get('/sign-in', async(req, res) => {
    res.render('sign-in')
})



//@desc sign-in post
router.post('/sign-in', async(req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }

})






//PASSWORD FORGOT AND RESET

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
router.get('/reset-password', (req, res) => {
    res.render('reset-password')
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