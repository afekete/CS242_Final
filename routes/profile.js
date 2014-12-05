/**
 * Created by Robert on 12/5/2014.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/profile', function(req, res) {
    res.render('profile');
});

module.exports = router;