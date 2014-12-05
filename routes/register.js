/**
 * Created by Robert on 12/4/2014.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/register', function(req, res) {
    res.render('register');
});

module.exports = router;