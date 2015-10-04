/**
 * Created by saman on 1/28/2015.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Student = new Schema(
    {   firstname: {type: String, require: true},
        lastname: {type: String, require: true},
        email: {type: String, require: true},
        age: {type: Number },
        phoneno: {type: Number}

    });

module.exports = mongoose.model('Student', Student);