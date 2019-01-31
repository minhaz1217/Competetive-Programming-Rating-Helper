var express = require('express');
var router = express.Router();

/*
//GET home page. 
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
*/
router.route("/")
  .get(function(req, res){
    //res.send("HELLO WORLD");
    res.render("contestattended");
    //return res.send(200, test);
  })


module.exports = router;
