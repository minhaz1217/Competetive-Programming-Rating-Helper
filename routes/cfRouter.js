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
// returns a list of rated contest
router.route("/ratedcontest")
    .get(function(req,res){
        
        var urlGetRatedContest = "https://codeforces.com/api/contest.list?gym=false";   
        var receivedData = "";
        https.get(urlGetRatedContest, (resp) =>{
            resp.on('data', (chunk) => {
                receivedData += chunk;
              });
            resp.on("end", () =>{
                console.log("Data send finished");
                var contestInfo = JSON.parse(receivedData);
                function setCharAt(str,index,chr) {
                    if(index > str.length-1) return str;
                    return str.substr(0,index) + chr + str.substr(index+1);
                }
                
                if(contestInfo.status == "OK"){
                      var outputData = '{"result": [';
                    contestInfo.result.forEach(function(contest){
                      if(contest.phase == "FINISHED"){
                        var name = contest.name;
                        var id = contest.id;
                        if(name.indexOf("Div. 3")>=0 || name.indexOf("Div. 2")>=0  || name.indexOf("Div. 1")>=0 ){
                          outputData += '{"id" : '+id + ', "name" : "' + name + '"},';
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
module.exports  = router;