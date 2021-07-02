const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');

// Drug model
const Drug = require('../models/Drug');


// @desc    show add page
// @route   GET /drugs/add
router.get('/add', ensureAuth, (req, res) => {
    res.render('drugs/add')
})


// @desc    process add form
// @route   POST /drugs
router.post('/', ensureAuth, async(req, res) => {
    try {
        req.body.user = req.user.id
        await Drug.create(req.body)
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})


// @desc    show all drugs
// @route   GET /drugs/add
router.get('/', ensureAuth, async(req, res) => {
    try {
        const drugs = await Drug.find({})
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean()

        res.render('drugs/index', {
            drugs,
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})


module.exports = router;