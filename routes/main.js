var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/main', function(req, res) {
    res.render('main');
});

router.post('/main', function(req, res) {
    res.send(req.data);
    res.render('main');
});

module.exports = router;
