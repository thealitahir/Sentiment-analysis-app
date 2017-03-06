module.exports = {
    testUser : {
        id : '54f81d07f7da9fde14330cb9'
    },
    database:{
        ip:CONFIGURATIONS.dbHost,
        //ip:'54.164.145.190',
        db:CONFIGURATIONS.db,
        port: CONFIGURATIONS.dbPort
    },
    pipelineId:CONFIGURATIONS.processId,
    smartSinkQueryUrl:'http://'+CONFIGURATIONS.backEndHost+':'+CONFIGURATIONS.backEndPort+'/services/api/querysink/getData?process='+CONFIGURATIONS.processId+'%3A'+CONFIGURATIONS.smartSinkId+'%3B&query=select%20Predicted_label_sentiment%20as%20PREDICTED_SENTIMENT%2CTweet_Id%2C%20userName%2C%20screenName%2Clocation%2CdateTime%20%2Cstatus%2C%20HashTags%20from%20TABLE'+CONFIGURATIONS.smartSinkId.toUpperCase()+'%20where%20HashTags%20is%20not%20null%20and%20HashTags%20%3C%3E%20%27null%27%20order%20by%20TWEET_ID%20desc%20limit%201000&tool=undefined&sink_type=smart&sink_profile=5804911c87b25b0e5b29653e&cluster_profile=5804911a87b25b0e5b29653b&start=0&rows=500'
};