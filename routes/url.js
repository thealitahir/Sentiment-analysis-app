/**
 * Created by saman on 3/26/2015.
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    console.log("here")
    res.send('respond with a resource');
});

module.exports = router;
