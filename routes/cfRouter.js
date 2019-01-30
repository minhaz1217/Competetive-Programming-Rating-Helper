var express = require("express");
var router = express();

router.route("/")
    .get(function(req, res){
        res.send("This is the cf api")
    })
    .post(function(req,res){
        res.send(req.body);
    })
    ;

module.exports  = router;