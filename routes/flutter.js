const express = require('express');
const router = express.Router();

router.get('/flutter', (req, res) => {
    res.render('flutter')
})

router.post('/flutter', (req, res) => {
    res.send('working')
})

module.exports = router;