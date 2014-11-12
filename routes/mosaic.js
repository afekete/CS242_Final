var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/mosaic', function(req, res) {
    res.render('mosaic');
});

module.exports = router;
