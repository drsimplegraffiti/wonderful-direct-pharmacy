const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');
const { requireAuth, checkUser } = require('../middleware/authMiddleware');
const cors = require('cors');


// Drug model
const Drug = require('../models/Drug');
//cors option
var whitelist = ['http://localhost:3000/dashboard', 'http://localhost:3000/drugs']
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}


// @desc    Login/Landing Page
// @route   GET /
router.get('/', cors(corsOptions), checkUser, ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login'
    })
})


// @desc    Dashboard
// @route   GET /dashboard

router.get('/dashboard', cors(corsOptions), checkUser, ensureAuth, async(req, res) => {
    try {
        const drugs = await Drug.find({ user: req.user.id }).lean()
        res.render('dashboard', {
            name: req.user.firstName,
            drugs
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }

})



module.exports = router;