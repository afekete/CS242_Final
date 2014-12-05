/**
 * Created by Robert on 12/4/2014.
 */
/**
 * Created by Robert on 11/13/2014.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/signin', function(req, res) {
    res.render('signin');
});

module.exports = router;