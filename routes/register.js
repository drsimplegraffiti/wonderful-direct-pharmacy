const express = require('express');
const passport = require('passport');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { requireAuth, checkUser } = require('../middleware/authMiddleware');
const localStrategy = require('passport-local').Strategy;
const SECRET = "boy";

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
        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({
                message: "User already exist, please signIn.",
            });
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const user = new User({
            email,
            password: hashPassword
        });

        const createdUser = await user.save();
        const token = await jwt.sign({
            id: createdUser._id
        }, SECRET, {
            expiresIn: "2h",
        });
        // return res.status(201).json({
        //     status: "success",
        //     data: {
        //         message: "User successfully created",
        //         token,
        //         userId: createdUser._id,
        //         role: createdUser.role
        //     },
        // });
        return res.redirect('/sign-in');
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: error,
            data: {
                message: "Server Error",
            },
        });
    }
})



// @desc Login 
router.get('/sign-in', async(req, res) => {
    res.render('sign-in')
})



//@desc sign-in post
router.post('/sign-in', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/sign-in?error=true'
}), async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                // status: error,
                error: "This email does not exist",
            });
        } else {
            const confirmPassword = await bcrypt.compare(password, user.password);
            if (!confirmPassword) {
                return res.status(400).json({
                    status: "error",
                    data: {
                        message: "User password is incorrect",
                    },
                });
            } else {
                const token = await jwt.sign({
                    id: user._id
                }, SECRET, {
                    expiresIn: "2h",
                });
                // return res.status(200).json({
                //     status: "success",
                //     data: {
                //         token,
                //         userId: user._id,
                //         role: user.role
                //     },
                // });

                return res.redirect('localhost:3000/dashboard');
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: error,
            error: new Error("Server Error"),
        });
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