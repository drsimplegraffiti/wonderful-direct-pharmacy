const express = require('express');
const passport = require('passport');
const router = express.Router();

// @desc    Register
// @route   GET /register
router.get('/register', (req, res) => {
    res.render('register', {
        layout: 'register'
    })
})




module.exports = router;