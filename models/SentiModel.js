/**
 * Created by Tahir on 11/3/2015.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Sentiment = new Schema(
    {
        tags:Schema.Types.Mixed,
        sinkId:String

    });

module.exports = mongoose.model('Sentiment', Sentiment);