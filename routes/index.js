var express = require('express');
var router = express.Router();

var passport = require('passport');
var flash = require('connect-flash');
require('../passport')(passport,flash);
var nodemailer = require('nodemailer');
var async = require('async');
var crypto = require('crypto');
var testConfig = require('../testConfig');

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
router.get('/fetchData',function(req, res,next){
    console.log(testConfig.testUser.id);
    console.log(req.params);
   /* var initial_params = decodeURIComponent(req.params.url);
    var params = initial_params + '&test_user=' + testConfig.testUser.id;*/
 //   var url="http://45.55.159.119:3000/platalytics/api/version/developers_interface/process/560f9af6dc30bd913c2e6117/smart_sink/560fcf6ed3831ce4552b6861/?SELECT=Predicted_Label,Tweet_Id,userName,screenName,location,dateTime,status%20&ORDER%20BY=dateTime%20DESC%20&tool=phoenix&start=0&rows=500"+ '&test_user=' + testConfig.testUser.id;;
 //   var url="http://45.55.159.119:3000/sinkHelpers/executeQuery?pipeline=56278682a8aabf373bf11c56:56278737a8aabf373bf11c93;&query=select%20*%20from%20table56278737a8aabf373bf11c93%20where%20HASHTAGS%20is%20not%20null%20order%20by%20DATETIME%20desc%20limit%20500%20&tool=phoenix&sink_type=smart"+ '&test_user=' + testConfig.testUser.id;;
    var url="http://45.55.159.119:3000/sinkHelpers/executeQuery?pipeline=56278682a8aabf373bf11c56:56278737a8aabf373bf11c93;&query=select%20*%20from%20table56278737a8aabf373bf11c93%20where%20HASHTAGS%20is%20not%20null%20order%20by%20DATETIME%20asc%20%20limit%20500%20&tool=phoenix&sink_type=smart"+ '&test_user=' + testConfig.testUser.id;;
    request(url, function (error, response, body) {
        var parsedBody = "";
        try {

            parsedBody = JSON.parse(body);
        }
        catch (ex) {

            console.log("Exception occurred while parsing oozie response : " + ex);
        }
        finally {

            if (parsedBody instanceof Object) {
                res.send({status: true, msg: "response received", data: parsedBody});

            }
            else {
                res.send({status: false, msg: "Non JSON response received.", data: []});
            }
        }

    });


    /*
     request(params, function (error, response, body) {
     */
    /* if (!error && response.statusCode == 200) {
     var data=JSON.parse(body);
     res.send({msg:"",data:JSON.parse(data)});

     }*//*


     var parsedBody = "";
     try {
     parsedBody = JSON.parse( JSON.parse(body) );
     }
     catch (ex) {

     console.log(" Exception occurred while parsing response ");
     }
     finally {

     if (parsedBody instanceof Object) {
     res.send({status: true, msg: 'Data available.', data: parsedBody});

     }
     else {

     res.send({status: false, msg: "Non JSON or invalid JSON response received.", data: []});
     }
     }

     });
     */
});
var fs = require('fs');

/*var multi  = require('connect-multiparty');
 var multimiddleware=new multi();*/

var Student = require('../models/StudentModel');

var mongoose = require('mongoose');
var StudentModel = mongoose.model('Student');

var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/',function(req, res){

    var Student = new StudentModel();
    Student.firstname = req.body.firstname;
    Student.lastname = req.body.lastname;
    Student.email = req.body.email;
    Student.age = req.body.age;
    Student.phoneno = req.body.phoneno;
    Student.save(function(err){
        if(err){
            res.send({error:err});
        }

        else{

            res.send('Student Added Successfully!');
        }
    });
});

router.get('/getAllStudents',function(req, res){
    StudentModel.find(function(err, students){
        if(err){
            res.send({error:err});
        }

        else{
            res.send(students);
        }
    })
});

router.delete('/delete/:id',function(req, res){

    StudentModel.remove({_id: req.params.id}, function(err){
        if(err){
            res.send({error:err});
        }

        else{
            res.send("Deleted Successfully");
        }
    })

});

router.get('/update/:id',function(req, res){
    var params = req.params.id;
    StudentModel.find({_id : params}, function(err, student){
        if(err){
            res.send({error:err});
        }

        else{
            res.send(student);
        }

    });
});

router.put('/update/save/:id',function(req, res){

    StudentModel.update({_id: req.params.id}, {$set: {firstname:req.body.firstname, lastname: req.body.lastname,
            email: req.body.email, age: req.body.age, phoneno: req.body.phoneno}},
        function(err, affected){
            if(err){
                res.send({error:err});
            }

            else{
                res.send('Updated Successfully');
            }
        })

});

router.post('/upload' , function(req, res) {

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

router.post('/send',function(req, res,next){

/*    console.log(req.body);
    var user=req.body;
    console.log(user.email)*/
    /*smtpTransport.sendMail(
        {
            //email options
            from: "Admin <samanashraf92@gmail.com>", // sender address.
            to:    user.email, // receiver
            subject: "Test Email", // subject
            text: "Please Click on the link to verify your registeration:<br>"
        },
        function(error, response){  //callback
            if(error){

                res.send('Error');
            }else{
                res.send("Email sent")
            }
            smtpTransport.close(); // shut down the connection pool, no more messages.
        });*/

  /*  var token = Math.floor((Math.random() * 100) + 54);

    var link = 'http://'+ req.headers.host +'/verify?token=' + token;
    var mailOptions = {
        from: "Fred Foo ✔ <foo@blurdybloop.com>", // sender address
        to: user.email, // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world ✔", // plaintext body
        html: "<b>Hello world ✔</b>"+link // html body
    }

// send mail with defined transport object
    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent: ");
        }

        // if you don't want to use this transport object anymore, uncomment following line
        //smtpTransport.close(); // shut down the connection pool, no more messages
    });*/

    passport.authenticate('local-register', function(err, info) {


       /* if (err) {

            req.flash('message','Missing credentials');
            return res.redirect('/register');
        }


        if (!user) {

            req.flash('message','Missing credentials');
            return res.redirect('/register');
        }

        var link = 'http://'+ req.headers.host +'/verify?token=' + user.token;

        //sending mail
        smtpTransport.sendMail(
            {
                //email options
                from: "Admin <asma.sardar@platalytics.com>", // sender address.
                to:    user.name+"<"+user.username+">", // receiver
                subject: "Registration Confirmation", // subject
                html: "Please Click on the link to verify your registeration:<br>"+link
            },
            function(error, response){  //callback
                if(error){

                    res.send('Error');
                }else{

                }
                smtpTransport.close(); // shut down the connection pool, no more messages.
            });

        req.flash('message','Please verify the link sent to your email');
        return res.redirect('/login');*/

    })(req, res, next);
});

router.get('/verify', function(req,res){

   console.log("account activated")
});




module.exports=router;


