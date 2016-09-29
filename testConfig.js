module.exports = {
    testUser : {
        id : '54f81d07f7da9fde14330cb9'
    },
    database:{
        ip:'54.164.145.190',
        db:'test'
    },
    pipelineId:'57ecf5d44b33900c39053ad3',//http://104.236.95.15:7777
    //smartSinkQueryUrl:'http://45.55.159.119:3000/sinkHelpers/executeQuery?pipeline=56278682a8aabf373bf11c56:562e4c48fd65829b3ba4c025;&query=select%20*%20from%20table562e4c48fd65829b3ba4c025%20where%20HASHTAGS%20is%20not%20null%20order%20by%20TWEET_ID%20DESC&tool=phoenix&sink_type=smart'+'&test_user=54f81d07f7da9fde14330cb9'
    //smartSinkQueryUrl:'http://104.236.95.15:5000/platalytics/api/version/developers_interface/process/573c825e020b1bf60b734bcc/smart_sink/573d695be8375c6be403a5ed/?query=select%20Predicted_label_sentimentTag%20as%20PREDICTED_SENTIMENT,Tweet_Id,%20userName,%20screenName,location,dateTime%20,status,%20HashTags%20from%20TABLE573D695BE8375C6BE403A5ED%20where%20HashTags%20is%20not%20null%20order%20by%20dateTime%20desc%20limit%201000&start=0&rows=500&api_key=35454545'
    smartSinkQueryUrl:'http://54.164.145.190:5000/platalytics/api/version/developers_interface/process/57ecf5d44b33900c39053ad3/smart_sink/57ecfc1efa0b6ea90a07e5d7/?query=select%20Predicted_label_sentiment%20as%20PREDICTED_SENTIMENT,Tweet_Id,%20userName,%20screenName,location,dateTime%20,status,%20HashTags%20from%20TABLE57ECFC1EFA0B6EA90A07E5D7%20where%20HashTags%20is%20not%20null%20and%20HashTags%20<>%20%27null%27%20order%20by%20TWEET_ID%20desc%20limit%201000&sink_profile=576d51cf5b556b1ff1e8a880&cluster_profile=576d51c75b556b1ff1e8a87e&start=0&rows=500&api_key=35454545'

};

