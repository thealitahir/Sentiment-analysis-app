/**
 * Created by saman on 3/14/2015.
 */

var LocalStrategy = require('passport-local').Strategy;
var nodemailer = require('nodemailer');

var smtpTransport = nodemailer.createTransport({
    service: "Gmail",  // sets automatically host, port and connection security settings
    auth: {
        user: "samanashraf92@gmail.com",
        pass: "zusammenensemble91992"
    }
});


module.exports = function(passport,flash){
    passport.use(new LocalStrategy({
            passReqToCallback : true
        },

        function(req,username, password, done) {
            UserModel.findOne({ username: username}, function (err, user) {

                if (err) { return done(err); }

                if (!user) {

                    return done(null, false, req.flash('message','User not found.'));
                }

                if(user.active == true){
                    user.comparePassword(password, function (err, isMatch) {
                        if (err) throw err;
                        if(isMatch){
                            var user_id = new MyObjectId(user._id);
                            Deployments.findOne({user_id:user_id}, function (err, deployments_object) {

                                if(!err  && deployments_object!=null){
                                    console.log(deployments_object.name)

                                    deployments_object.deployment_result.instances.forEach(function(object){
                                        if(object.droplet.name==deployments_object.name+'-minion1'){
                                            object.droplet.networks.v4.forEach(function(configurations_object){
                                                if(configurations_object.type=='public'){
                                                    console.log("giving public IP from users cluster")

                                                    user.ip_address=configurations_object.ip_address;
                                                    user.save()
                                                    //we are returning user after adding ip_address of its cluster
                                                    return done(null, user);
                                                }

                                            })
                                        }
                                    })
                                }

                                else{
                                    console.log("Error in finding deployments object fot this user")
                                    console.log(err)
                                    //we are returning IP from configurations file because there is no user cluster IP in database
                                    user.ip_address=configurations.cloud_services.host;
                                    user.save();
                                    return done(null, user);
                                }
                            });


                        }else{
                            return done(null, false, req.flash('message','Incorrect password.'));
                        }
                    });
                }
                else
                {
                    return done(null, false, req.flash('message', 'Sorry! You are not an active user'));
                }
            });
        }
    ));

    passport.use('local-register', new LocalStrategy({
            passReqToCallback : true
        },
        function(req,username,password,done) {

            console.log('hello')
        }
    ));

    passport.serializeUser(function(user, done) {

        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {

        UserModel.findById(id, function(err, user) {
            done(err, user);
        });
    });
};
