var express = require('express');
var router = express.Router();

var passport = require('passport');
var flash = require('connect-flash');
require('../passport')(passport,flash);
var nodemailer = require('nodemailer');
var async = require('async');
var crypto = require('crypto');
var testConfig = require('../testConfig');
var pipelineId="56278682a8aabf373bf11c56";
var _=require('underscore');
var smtpTransport = nodemailer.createTransport({
    service: "Gmail",  // sets automatically host, port and connection security settings
    auth: {
        /*user: "samanashraf92@gmail.com",
         pass: "zusammenensemble91992"*/

        user: "asma.sardar@platalytics.com",
        pass: "libra1729"
    }
});
var jsonFile = require("../public/API_Fetch_Data/waterlevel.json")
var tweet = require("../public/API_Fetch_Data/tweet.json")
/*router.get('/fetchData', function(req, res, next) {
 console.log("here")
 //res.send( {status:true,data:tweet} );

 console.log("Sds");
 //  console.log(params);
 console.log("sdssd");
 });*/

var fs = require('fs');

/*var multi  = require('connect-multiparty');
 var multimiddleware=new multi();*/

var Sentiment= require('../models/SentiModel');
//var Pipeline= require('../models/pipelineModel');
//var Stage= require('../models/stageModel');

//var mongoose = require('mongoose');
//var StudentModel = mongoose.model('Student');

var request = require('request');

var hashTags="";
var twitterStage={};

var mongo = require('mongodb'),
    Server = mongo.Server,
    ObjectID = require('mongodb').ObjectID,
    Db = mongo.Db;
var server = new Server(testConfig.database.ip, testConfig.database.port, {
    auto_reconnect: true
});
var db = new Db(testConfig.database.db, server);
db.open(function(err, db) {
    if(!err) {

        db.collection('pipelineversions', function(err, collection) {
            if(!err){
                if (!err) {
                    collection.findOne({_id:new ObjectID(testConfig.pipelineId)},function(err, docs) {
                        if (!err) {
                            console.log("DOC");
                            console.log(docs)
                            var stages=docs.stages;
                            getTwitterSourceId(stages,function(doc){
                                hashTags=doc.stage_attributes.hash_tags;
                                twitterStage=doc;
                            });
                        }
                    });
                }
            }
        })
        console.log("connected to db :"+testConfig.database.ip )
        router.get('/', function (req, res, next) {
            res.render('index', {title: 'Express'});
        });
        router.get('/fetchData',function(req, res,next){
//            console.log(testConfig.testUser.id);
//            console.log(req.params);
            /* var initial_params = decodeURIComponent(req.params.url);
             var params = initial_params + '&test_user=' + testConfig.testUser.id;*/
            var url=testConfig.smartSinkQueryUrl;
            console.log(url)
            //var url="http://45.55.159.119:3000/platalytics/api/version/developers_interface/process/562f2ada3a366cf9052db40f/smart_sink/563738e1e709572d6aa3fb3f/?SELECT=Predicted_Label,Tweet_Id,userName,screenName,location,dateTime,status,HashTags%20&tool=phoenix&start=0&rows=500"+ '&test_user=' + testConfig.testUser.id;;
            request(url, function (error, response, body) {
                var parsedBody = "";
                try {

                    parsedBody = JSON.parse(body);
                    console.log("=======================After Parsing================================")
                    console.log(parsedBody)
                }
                catch (ex) {

                    console.log("Exception occurred while parsing oozie response : " + ex);
                }
                finally {

                    if (parsedBody instanceof Object) {
                        getTwitterSourceHashTags(twitterStage,function(hashTags){
                        //    hashTags=doc.stage_attributes.hash_tags;
                         //   twitterStage=doc;
                            console.log("hasTags")
                            console.log(hashTags)
                            if(typeof hashTags !="null" && hashTags!="" && hashTags!=null)
                            {
                                var tmp = hashTags.split(',').join('~').toLowerCase();
                                var lcArray = tmp.split('~');
                                // console.log("local array");
                                //   console.log(lcArray);
                                //  console.log("parsedBody.data.data")
                                // console.log(parsedBody.data.data)
                                var newArray = _.filter (parsedBody.response.data, function(obj) {
                                    var index=-1;
//                            console.log(obj);
                                    //console.log(lcArray);
                                    // console.log("sds")
                                    // console.log(obj.HASHTAGS)
                                    return lcArray.indexOf(obj.HASHTAGS.toLowerCase())>-1;

                                });

                                parsedBody.response.data=newArray;
                                // console.log("newArray")
                                //  console.log(newArray)

                                res.send({status: true, msg: "response received", data: parsedBody.response,hashTags:hashTags});
                            }
                            else{
                                res.send({status: true, msg: "response received", data: parsedBody.response,hashTags:""});
                            }


                        });


                    }
                    else {
                        res.send({status: false, msg: "Non JSON response received.", data: []});
                    }
                }

            });
        });
        router.post('/upload', function (req, res) {

            console.log(req.files);

            if (req.body.length == 1) {

                var file_path = req.files.FILE.path;
                var dest_path = './public/uploads/' + req.files.FILE.originalname;

                fs.rename(file_path, dest_path, function (err) {
                    if (err) {
                        fs.unlink(file_path, function () {
                            if (err) {
                                throw err;
                            }

                        });
                    }

                    else {
                        res.send('File Uploaded Successfully');
                    }

                });
            }

            else {
                for (var i = 0; i < req.files.FILE.length; i++) {

                    var file_path = req.files.FILE[i].path;
                    var dest_path = './public/uploads/' + req.files.FILE[i].originalname;

                    if ((i + 1) == req.files.FILE.length) {
                        res.send('File/s Uploaded Successfully');
                    }

                    fs.rename(file_path, dest_path, function (err) {
                        if (err) {
                            fs.unlink(file_path, function () {
                                if (err) {
                                    throw err;
                                }

                            });
                        }
                    });
                }
            }

        });
        router.post('/saveHashTag', function (req, res) {
            twitterStage.stage_attributes.hash_tags=req.body.tags;
            db.collection('stageversions', function(err, collection) {
                console.log("testing")
                if(!err){
                    console.log("twiiter doc")
                    console.log(twitterStage)
                    collection.update({_id:new ObjectID(twitterStage._id)}, {$set: {stage_attributes:twitterStage.stage_attributes}},function(){
                        if(!err){
                            hashTags=req.body.tags;
                            res.send({status: true, msg: "Hash Tags updated"});

                        }
                    });
                }
            });
        });
        function getTwitterSourceId(stages,callback){
            console.log(stages);
            for(var i=0;i<stages.length;i++){
                db.collection('stageversions', function(err, collection) {
                    if(!err){
                        if (!err) {
                            collection.findOne({_id:new ObjectID(stages[i].version_id)},function(err, doc) {
                                if (!err) {
                                    if(doc.sub_type=='twitter'){
                                        console.log("doc ment found")
                                        console.log("doc ment found")
                                        callback(doc);
                                    }
                                }
                            });
                        }
                    }
                })
            }
        }
        function getTwitterSourceHashTags(twitterStage,callback){
            db.collection('stageversions', function(err, collection) {
                if(!err){
                    if (!err) {
                        collection.findOne({_id:new ObjectID(twitterStage._id)},function(err, doc) {
                            if (!err) {
                                    console.log("doc")
                                    console.log(doc)
                                if(doc){
                                    callback(doc.stage_attributes.hash_tags);
                                }
                                else{
                                    callback("");
                                }

                            }
                        });
                    }
                }
            })
        }
    }
    else{
        console.log("error connecting db")
    }


});
/* GET home page. */


module.exports=router;


