const express = require('express');
const passport = require('passport');
const router = express.Router();
const cors = require('cors');
const activateAccount = require('./register');


// @desc    Auth with Google
// @route   GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }))


// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/dashboard')
})


// @ desc Register User
// @route   GET /auth/register
router.get('/register', (req, res) => {
    res.render('register')
})

// @desc    Logout User 
// @route   /auth/Logout
router.get('/logout', (req, res) => {
    req.logOut()
    res.redirect('/')
})


router.post('/email-activate', activateAccount)
module.exports = router;