var express = require("express");
var router = express();
var https = require("https");

router.route("/")
    .get(function(req, res){
        res.send("This is the cf api")
        var myData = "";
        https.get("https://www.google.com", (resp) =>{
            console.log('statusCode:', res.statusCode);
            console.log('headers:', res.headers);
                myData += chunk;
              });
            resp.on("end", () =>{
                console.log("Data send finished");
                //console.log(JSON.parse(myData).explanation);
                res.send(myData);
            })
        });
    })


    .post(function(req,res){
        res.send(req.body);
    })
    ;

module.exports  = router;