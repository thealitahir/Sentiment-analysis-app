module.exports = {
    testUser : {
        id : '54f81d07f7da9fde14330cb9'
    },
    database:{
        ip:'107.20.85.225',
        db:'test'
    },
    pipelineId:'5811ef825b2686b20192a382',//http://104.236.95.15:7777
    //smartSinkQueryUrl:'http://45.55.159.119:3000/sinkHelpers/executeQuery?pipeline=56278682a8aabf373bf11c56:562e4c48fd65829b3ba4c025;&query=select%20*%20from%20table562e4c48fd65829b3ba4c025%20where%20HASHTAGS%20is%20not%20null%20order%20by%20TWEET_ID%20DESC&tool=phoenix&sink_type=smart'+'&test_user=54f81d07f7da9fde14330cb9'
    smartSinkQueryUrl:'http://107.20.85.225:5000/platalytics/api/version/developers_interface/process/5811ef825b2686b20192a382/smart_sink/5811ef820c14f6c2480e7839/?query=select%20Predicted_label_sentiment%20as%20PREDICTED_SENTIMENT,Tweet_Id,%20userName,%20screenName,location,dateTime%20,status,%20HashTags%20from%20TABLE5811EF820C14F6C2480E7839%20where%20HashTags%20is%20not%20null%20and%20HashTags%20%3C%3E%20%27null%27%20order%20by%20TWEET_ID%20desc%20limit%201000&sink_profile=5804911c87b25b0e5b29653e&cluster_profile=5804911a87b25b0e5b29653b&start=0&rows=500&api_key=35454545'
};

