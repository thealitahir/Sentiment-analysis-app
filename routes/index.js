var express = require('express');
var router = express.Router();

var passport = require('passport');
var flash = require('connect-flash');
require('../passport')(passport,flash);
var nodemailer = require('nodemailer');
var async = require('async');
var crypto = require('crypto');
var _=require('underscore');
var tweet = require("../public/API_Fetch_Data/tweet.json")
var fs = require('fs');
var request = require('request');

var hashTags="";
var twitterStage={};

var mongo = require('mongodb'),
    Server = mongo.Server,
    ObjectID = require('mongodb').ObjectID,
    Db = mongo.Db;

var db;

router.get('/', function (req, res, next) {
    var server = new Server(getConf().database.ip, getConf().database.port, {
        auto_reconnect: true
    });
    db = new Db(getConf().database.db, server);
    db.open(function(err, db) {
        if(!err) {
            console.log("connected to db :"+getConf().database.ip )

            db.collection('pipelineversions', function(err, collection) {
                console.log('pipelineversions')
                console.log(err)
                console.log(collection)
                if (!err) {
                    console.log('fetch pipeline')
                    console.log(getConf().pipelineId)
                    collection.findOne({_id:new ObjectID(getConf().pipelineId)},function(err, docs) {
                        console.log('getting pipeline')
                        console.log(err)
                        console.log(docs)
                        if (!err) {
                            console.log("DOC");
                            console.log(docs)
                            var stages=docs.stages;
                            getTwitterSourceId(stages,function(doc){
                                hashTags=doc.stage_attributes.hash_tags;
                                twitterStage=doc;

                                res.render('index', {title: 'Express'});
                            });
                        }
                        else{
                            console.log('in error')
                            console.log(err)
                        }
                    });
                }
            })
        }
        else{
            console.log(err)
            console.log("error connecting db")
        }
    });

});
router.get('/getApiUrl', function(req, res, next) {
    var url = getConf().baseUrl + "/platalytics/api/version/developers_interface/process/"+CONFIGURATIONS.processId+"/smart_sink/"+CONFIGURATIONS.smartSinkId+"/?query=select%20Predicted_label_sentiment%20as%20PREDICTED_SENTIMENT%2CTweet_Id%2C%20userName%2C%20screenName%2Clocation%2CdateTime%20%2Cstatus%2C%20HashTags%20from%20TABLE"+CONFIGURATIONS.smartSinkId.toUpperCase()+"%20where%20HashTags%20is%20not%20null%20and%20HashTags%20%3C%3E%20%27null%27%20order%20by%20TWEET_ID%20desc%20limit%201000&sink_profile=5804911c87b25b0e5b29653e&cluster_profile=5804911a87b25b0e5b29653b&start=0&rows=500&api_key=35454545";
    res.send({status:true , data:url});
});
router.get('/fetchData',function(req, res,next){
//            console.log(getConf().testUser.id);
//            console.log(req.params);
    /* var initial_params = decodeURIComponent(req.params.url);
     var params = initial_params + '&test_user=' + getConf().testUser.id;*/
    var url=getConf().smartSinkQueryUrl;
    console.log(url)
    //var url="http://45.55.159.119:3000/platalytics/api/version/developers_interface/process/562f2ada3a366cf9052db40f/smart_sink/563738e1e709572d6aa3fb3f/?SELECT=Predicted_Label,Tweet_Id,userName,screenName,location,dateTime,status,HashTags%20&tool=phoenix&start=0&rows=500"+ '&test_user=' + getConf().testUser.id;;
    request(url, function (error, response, body) {

        console.log(body);
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
                        var newArray = _.filter (parsedBody.data, function(obj) {
                            var index=-1;
//                            console.log(obj);
                            //console.log(lcArray);
                            // console.log("sds")
                            // console.log(obj.HASHTAGS)
                            return lcArray.indexOf(obj.HASHTAGS.toLowerCase())>-1;

                        });

                        parsedBody.data=newArray;
                        // console.log("newArray")
                        //  console.log(newArray)

                        res.send({status: true, msg: "response received", data: parsedBody,hashTags:hashTags});
                    }
                    else{
                        res.send({status: true, msg: "response received", data: parsedBody,hashTags:""});
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
    console.log(req.body.tags);
    twitterStage.stage_attributes.hash_tags=req.body.tags;
    var server = new Server(getConf().database.ip, getConf().database.port, {
        auto_reconnect: true
    });
    db = new Db(getConf().database.db, server);
    db.open(function(err, db) {
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

});
function getTwitterSourceId(stages,callback){
    console.log('getTwitterSourceId');
    console.log(stages);
    for(var i=0;i<stages.length;i++){
        db.collection('stageversions', function(err, collection) {
            if(!err){
                if (!err) {
                    collection.findOne({_id:new ObjectID(stages[i].version_id)},function(err, doc) {
                        if (!err) {
                            if(doc.sub_type=='twitter'){
                                console.log("doc ment found")
                                console.log("doc m  ent found")
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
    var server = new Server(getConf().database.ip, getConf().database.port, {
        auto_reconnect: true
    });
    db = new Db(getConf().database.db, server);
    db.open(function(err, db) {
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
    });
    /*db.collection('stageversions', function(err, collection) {
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
    })*/
}

module.exports=router;

function getConf(){
    var conf = {
        testUser : {
            id : '54f81d07f7da9fde14330cb9'
        },
        database:{
            ip:CONFIGURATIONS.dbHost,
            //ip:'54.164.145.190',
            db:CONFIGURATIONS.db,
            port: CONFIGURATIONS.dbPort
        },
        baseUrl: "http://" + CONFIGURATIONS.frontEndHost + ':' + CONFIGURATIONS.frontEndPort,
        pipelineId: CONFIGURATIONS.processId,
        //smartSinkQueryUrl:'http://24.16.42.120:5000/platalytics/api/version/developers_interface/process/5811ef825b2686b20192a382/smart_sink/58a4650c6ad364cbcc108bd8/?query=select%20Predicted_label_sentiment%20as%20PREDICTED_SENTIMENT,Tweet_Id,%20userName,%20screenName,location,dateTime%20,status,%20HashTags%20from%20TABLE58A4650C6AD364CBCC108BD8%20where%20HashTags%20is%20not%20null%20and%20HashTags%20%3C%3E%20%27null%27%20order%20by%20TWEET_ID%20desc%20limit%201000&sink_profile=5804911c87b25b0e5b29653e&cluster_profile=5804911a87b25b0e5b29653b&start=0&rows=500&api_key=35454545'
        smartSinkQueryUrl:'http://'+CONFIGURATIONS.backEndHost+':'+
        CONFIGURATIONS.backEndPort+'/services/api/smartsink/'+CONFIGURATIONS.smartSinkId+
        '?rows=500&query=select%20PREDICTED_LABEL%20as%20PREDICTED_SENTIMENT%2CTweet_Id%2C%20USERNAME%2C%20screenName%2CDATETIME%20%2CSTATUS%2C%20HASHTAGS%20from%20TABLE5C2F5C5F84987A673AF6336E%20where%20HashTags%20is%20not%20null%20and%20HashTags%20%3C%3E%20%27null%27%20order%20by%20TWEET_ID%20desc%20limit%201000'

        /*baseUrl: "http://" + CONFIGURATIONS.frontEndHost + ':' + CONFIGURATIONS.frontEndPort,
        pipelineId: CONFIGURATIONS.processId,
        //smartSinkQueryUrl:'http://24.16.42.120:5000/platalytics/api/version/developers_interface/process/5811ef825b2686b20192a382/smart_sink/58a4650c6ad364cbcc108bd8/?query=select%20Predicted_label_sentiment%20as%20PREDICTED_SENTIMENT,Tweet_Id,%20userName,%20screenName,location,dateTime%20,status,%20HashTags%20from%20TABLE58A4650C6AD364CBCC108BD8%20where%20HashTags%20is%20not%20null%20and%20HashTags%20%3C%3E%20%27null%27%20order%20by%20TWEET_ID%20desc%20limit%201000&sink_profile=5804911c87b25b0e5b29653e&cluster_profile=5804911a87b25b0e5b29653b&start=0&rows=500&api_key=35454545'
        smartSinkQueryUrl:'http://'+CONFIGURATIONS.backEndHost+':'+
        CONFIGURATIONS.backEndPort+'/services/api/querysink/getData?process='+CONFIGURATIONS.processId+'%3A'+CONFIGURATIONS.smartSinkId
        +'%3B&query=select%20Predicted_label_sentiment%20as%20PREDICTED_SENTIMENT%2CTweet_Id%2C%20userName%2C%20screenName%2Clocation%2CdateTime%20%2Cstatus%2C%20HashTags%20from%20TABLE'+CONFIGURATIONS.smartSinkId.toUpperCase()+'%20where%20HashTags%20is%20not%20null%20and%20HashTags%20%3C%3E%20%27null%27%20order%20by%20TWEET_ID%20desc%20limit%201000&sink_type=smart&start=0&rows=500&sink_profile=5804911c87b25b0e5b29653e&cluster_profile=5804911a87b25b0e5b29653b'*/
    };
    //console.log(conf);
    return conf;
}
