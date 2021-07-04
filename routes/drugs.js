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


// @desc    show single drug
// @route   GET /drugs/:id
router.get('/:id', ensureAuth, async(req, res) => {
    try {
        let drug = await Drug.findById(req.params.id)
            .populate('user')
            .lean()
        if (!drug) {
            return res.render('error/404')
        }

        res.render('drugs/show', {
            drug
        })
    } catch (err) {
        console.error(err)
        res.render('error/404')
    }
})



// @desc    show edit page
// @route   GET /drugs/edit/:id
router.get('/edit/:id', ensureAuth, async(req, res) => {
    try {
        const drug = await Drug.findOne({
            _id: req.params.id
        }).lean()

        if (!drug) {
            return res.render('error/404')
        }

        if (drug.user != req.user.id) {
            res.redirect('/drugs')
        } else {
            res.render('drugs/edit', {
                drug,
            })
        }
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }




})

// @desc    Update drug
// @route   PUT /drugs/:id
router.put('/:id', ensureAuth, async(req, res) => {
    try {
        let drug = await Drug.findById(req.params.id).lean()
        if (!drug) {
            return res.render('error/404')
        }

        if (drug.user != req.user.id) {
            res.redirect('/drugs')
        } else {
            drug = await Drug.findOneAndUpdate({ _id: req.params.id }, req.body, {
                new: true,
                runValidators: true
            })
            res.redirect('/dashboard')
        }
    } catch (err) {
        {
            console.error(err)
            return res.render('error/500')
        }
    }
})

// @desc    Delete Drug
// @route   DELETE drugs/:id
router.delete('/:id', ensureAuth, async(req, res) => {
    try {
        await Drug.remove({ _id: req.params.id })
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})

// @desc    User drugs
// @route   GET /drugs/user/:userId
router.get('/user/:userId', ensureAuth, async(req, res) => {
    try {
        const drugs = await Drug.find({
                user: req.params.userId,
                jobRole: 'agent'
            })
            .populate('user')
            .lean()
        res.render('drugs/index', {
            drugs
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

module.exports = router;