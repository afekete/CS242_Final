/**
 * Created by Alec on 11/5/2014.
 */
var express = require('express');
var router = express.Router();
var mongoskin = require('mongoskin'); //Used to interface with a mongodb database

var db = mongoskin.db('mongodb://admin:password@ds051630.mongolab.com:51630/instagram_mosaic', {safe:true, native_parser:true});

// whenever parameter collectionName in url, sets req.collection to the right collection in the database
router.param('collectionName', function(req, res, next, collectionName) {
    req.collection = db.collection(collectionName);
    return next();
});

/*** RESTful interface setup ***/
router.get('/db/:collectionName', function(req, res, next) {
    req.collection.find({}, {sort:[['_id', 1]]}).toArray(function(e, results) {
        if (e) return next(e);
        res.send(results)
    })
});
router.post('/db/:collectionName', function(req, res, next) {
    req.collection.insert(req.body, {}, function(e, results) {
        if (e) return next(e);
        res.send(results)
    })
});
router.get('/db/:collectionName/:id', function(req, res, next) {
    req.collection.findById(req.params.id, function(e, result) {
        if (e) return next(e);
        res.send(result)
    })
});
router.put('/db/:collectionName/:id', function(req, res, next) {
    // put requests add to the database rather than replace current data
    req.collection.updateById(req.params.id, {$set:req.body}, {safe:true, multi:false},
        function(e, result) {
            if (e) return next(e);
            res.send((result===1)?{msg:'success'}:{msg:'error'})
        })
});
router.delete('/db/:collectionName/:id', function(req, res, next) {
    req.collection.removeById(req.params.id, function(e, result) {
        if (e) return next(e);
        res.send((result===1)?{msg:'success'}:{msg:'error'})
    })
});

module.exports = router;
