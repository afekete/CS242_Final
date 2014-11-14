/**
 * Created by Robert on 11/13/2014.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/user', function(req, res) {
    res.render('user');
});

module.exports = router;