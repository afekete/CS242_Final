/**
 * Created by Robert on 11/13/2014.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/location', function(req, res) {
    res.render('location');
});

module.exports = router;