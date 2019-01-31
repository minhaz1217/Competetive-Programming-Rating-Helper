var express = require("express");
var router = express();
var https = require("https");
var testUrl = "https://codeforces.com/api/contest.status?contestId=566&from=1&count=2";

function getRatedContest(ratingsFor, contestCount, callback){

    var receivedData = "";
    var urlGetRatedContest = "https://codeforces.com/api/contest.list?gym=false";  
    https.get(urlGetRatedContest, (resp) =>{
        resp.on('data', (chunk) => {
            receivedData += chunk;
          });
        resp.on("end", () =>{
            //console.log("Data send finished");
            var contestInfo = JSON.parse(receivedData);
            var myContestCount = 0;

            function setCharAt(str,index,chr) {
                if(index > str.length-1) return str;
                return str.substr(0,index) + chr + str.substr(index+1);
            }
            if(contestInfo.status == "OK"){
                var outputData = '{"result": [';
                contestInfo.result.forEach(function(contest){
                    if(contestCount > myContestCount){
                        if(contest.phase == "FINISHED"){
                            var name = contest.name;
                            var id = contest.id;
                            for(var rtname =0; rtname< ratingsFor.length;rtname++){
                                if(name.indexOf(ratingsFor[rtname])>=0){
                                    outputData += '{"id" : '+id + ', "name" : "' + name + '"},';
                                    myContestCount++;
                                    break;
                                }
                            }
                        }
                    }
                });
              if(outputData[outputData.length-1] == ','){
                outputData = setCharAt(outputData, outputData.length-1, "");
              }
              outputData += ']}';
              callback(outputData);
              //res.send(JSON.parse(outputData));
            }else{
                callback("ERROR");
                //TODO : Fix this
                //res.status(404).send("ERROR");
            }
            
            //res.send(JSON.parse(receivedData));
        })
    }); 
}


router.route("/")
    .get(function(req, res){
        var myData = "";
        https.get(testUrl, (resp) =>{
            //console.log('statusCode:', res.statusCode);
            //console.log('headers:', res.headers);
            resp.on('data', (chunk) => {
                myData += chunk;
              });
            resp.on("end", () =>{
                //console.log("Data send finished");
                //console.log(JSON.parse(myData).explanation);
                res.send(JSON.parse(myData));
            })
        });
    })
    .post(function(req,res){
        res.send(req.body);
    })
    ;
// returns a list of rated contest,depending on count and selected divisions
router.route("/ratedcontest")
    .get(function(req,res){
        
        res.render("ratedcontest", {title: "CODEFORCES"});

    })
    .post(function(req,res){
        var ratingsFor = Array();
        var contestCount = Number(req.body.count);
        if(req.body.div1){
            ratingsFor.push("Div. 1");
        }
        
        if(req.body.div2){
            ratingsFor.push("Div. 2");
        }
        if(req.body.div3){
            ratingsFor.push("Div. 3");
        }
        getRatedContest(ratingsFor, contestCount, function(ratedContests){
            if(ratedContests == "ERROR"){
                res.status(404).send("ERROR");
            }else{
                res.status(200).send(JSON.parse(ratedContests));

            }
        })

        
    })
;
//returns a list of users recent contest activity
router.route("/userrecentcontest")
.get(function(req,res){
    res.render("userrecentcontest", {title: "CODEFORCES"});

    //return res.status(200).send(JSON.parse('{"contest": [1100,1102,1099,1096,1095,1092,1084,1088,1056,1080,1028,1027,1023,1016,1005]}'));
    
})
//post method of : http://localhost:3000/api/cf/userrecentcontest
.post(function(req,res){
    function getRecentRatings(name, neededCount, callback){
        var ratingsUrl = "https://codeforces.com/api/user.rating?handle=";
        var receivedData = "";
        var outputData = "";
        https.get(ratingsUrl+ name, (resp) =>{
            resp.on('data', (chunk) => {
                receivedData += chunk;
              });
            resp.on("end", () =>{
                function setCharAt(str,index,chr) {
                    if(index > str.length-1) return str;
                    return str.substr(0,index) + chr + str.substr(index+1);
                }
                var userInfo = JSON.parse(receivedData);
                var myRatingsCount = 0;
    
                if(userInfo.status == "OK"){
                    outputData += '{"name": "' +name+ '","contest": [';    
                    for(var i=userInfo.result.length-1;i>=0;i--){
                        var contestId = userInfo.result[i].contestId;
                        outputData = outputData + contestId +",";
                        myRatingsCount++;
                        if(myRatingsCount >= neededCount){
                            break;
                        }
                    }
                    if(outputData[outputData.length-1] == ','){
                        outputData = setCharAt(outputData, outputData.length-1, "");
                    }
                    outputData += ']}';
                    callback(outputData);
                }else{
                    callback("ERROR");
                }
    
            })
            
        });
        
    }
    function getFullList(names, needCount, callback){
        var count = 0;
        var i =0;
        var outputData = "";
        names.forEach( function(name){
            getRecentRatings(name.trim(), needCount, function(contestList){
                if(contestList != "ERROR"){
                    if(i>0){
                        outputData += ',' + contestList + '';
                    }else{
                        outputData += '' + contestList + '';
                    }
                }
                i++;
                if(i == names.length){
                    callback(outputData);
                }
            });
        } );
    }




    var names = (req.body.names).split("\r");
    //return res.status(200).send(JSON.parse('{"contest": [1100,1102,1099,1096,1095,1092,1084,1088,1056,1080,1028,1027,1023,1016,1005]}'));
    // gets users ratings changes, so as a result gets recent contest
    var neededCount = Number(10) + 5;
    var receivedData = "";
    var outputData = '{"result" : [';
    getFullList(names, neededCount, function(msg){
        outputData += msg +']}';
        res.send(JSON.parse(outputData));
    });
})
;
module.exports  = router;