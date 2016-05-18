module.exports = {
    testUser : {
        id : '54f81d07f7da9fde14330cb9'
    },
    database:{
        ip:'122.129.79.68',
        db:'test'
    },
    pipelineId:'573c55141734e3d473b8093b',
    //smartSinkQueryUrl:'http://45.55.159.119:3000/sinkHelpers/executeQuery?pipeline=56278682a8aabf373bf11c56:562e4c48fd65829b3ba4c025;&query=select%20*%20from%20table562e4c48fd65829b3ba4c025%20where%20HASHTAGS%20is%20not%20null%20order%20by%20TWEET_ID%20DESC&tool=phoenix&sink_type=smart'+'&test_user=54f81d07f7da9fde14330cb9'
    smartSinkQueryUrl:'http://122.129.79.68:1235/platalytics/api/version/developers_interface/process/573c55141734e3d473b8093b/smart_sink/573c5515220c73cec685bb91/?query=select%20%20Predicted_label_sentimentTag%20as%20predicted_sentiment,%20Tweet_Id,%20userName,%20screenName,location,%20dateTime,status,HashTags%20from%20TABLE573C5515220C73CEC685BB91%20order%20by%20dateTime%20desc%20limit%201000&start=0&rows=500&api_key=35454545'+'&test_user=54f81d07f7da9fde14330cb9'


};

