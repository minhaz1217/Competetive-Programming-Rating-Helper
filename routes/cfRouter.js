var express = require("express");
var router = express();
var https = require("https");
var testUrl = "https://codeforces.com/api/contest.status?contestId=566&from=1&count=2";
router.route("/")
    .get(function(req, res){
        var myData = "";
        https.get(testUrl, (resp) =>{
            console.log('statusCode:', res.statusCode);
            console.log('headers:', res.headers);
            resp.on('data', (chunk) => {
                myData += chunk;
              });
            resp.on("end", () =>{
                console.log("Data send finished");
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
        var urlGetRatedContest = "https://codeforces.com/api/contest.list?gym=false";   
        var receivedData = "";
        var ratingsFor = Array();
        var test = "";
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
        
        https.get(urlGetRatedContest, (resp) =>{
            resp.on('data', (chunk) => {
                receivedData += chunk;
              });
            resp.on("end", () =>{
                console.log("Data send finished");
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
                  res.send(JSON.parse(outputData));
                }else{
                  console.log("NOPE");
                }
                
                //res.send(JSON.parse(receivedData));
            })
        });
        
    })
;
//returns a list of users recent contest activity
router.route("/userrecentcontest")
.get(function(req,res){
    res.render("userrecentcontest", {title: "CODEFORCES"});

    /*
    //return res.status(200).send(JSON.parse('{"contest": [1100,1102,1099,1096,1095,1092,1084,1088,1056,1080,1028,1027,1023,1016,1005]}'));
    var name = "minhaz1217"
    var ratingsUrl = "https://codeforces.com/api/user.rating?handle=";
    // gets users ratings changes, so as a result gets recent contest
    var neededCount = Number(10) + 5;
    var testData =JSON.parse('{"contest": [1100,1102,1099,1096,1095,1092,1084,1088,1056,1080,1028,1027,1023,1016,1005]}');
    var receivedData = "";
    var finalData = "sdf";

    console.log(ratingsUrl);
    //return res.status(200).send(JSON.parse('{"contest": [1100,1102,1099,1096,1095,1092,1084,1088,1056,1080,1028,1027,1023,1016,1005]}'));


    https.get(ratingsUrl+name, (resp) =>{
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
                var outputData = '{"name": "'+name+'","contest": [';

                for(var i=userInfo.result.length-1;i>=0;i--){
                    contestId = userInfo.result[i].contestId;
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
                return res.status(200).send(JSON.parse(outputData));
            }else{
                return res.status(404).send("User not found");
                console.log("NOPE");
            }
        })
        
    });
*/
    //return res.status(200).send(JSON.parse('{"contest": [1100,1102,1099,1096,1095,1092,1084,1088,1056,1080,1028,1027,1023,1016,1005]}'));
    
})
.post(function(req,res){
    var names = (req.body.names).split("\r");
    var msg = "";
    for(var i=0;i<names.length;i++){
        msg += names[i] + "<br>";
    }
    res.status(200).send(msg);
})
;
module.exports  = router;