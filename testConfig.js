module.exports = {
    testUser : {
        id : '54f81d07f7da9fde14330cb9'
    },
    database:{
        ip:'mongo-db-svc.iot-platform-sku-group-0',
        //ip:'54.164.145.190',
        db:'test'
    },
    pipelineId:'5811ef825b2686b20192a382',
    //smartSinkQueryUrl:'http://52.91.170.12:5000/platalytics/api/version/developers_interface/process/5811ef825b2686b20192a382/smart_sink/5811ef820c14f6c2480e7839/?query=select%20Predicted_label_sentiment%20as%20PREDICTED_SENTIMENT,Tweet_Id,%20userName,%20screenName,location,dateTime%20,status,%20HashTags%20from%20TABLE5811EF820C14F6C2480E7839%20where%20HashTags%20is%20not%20null%20and%20HashTags%20%3C%3E%20%27null%27%20order%20by%20TWEET_ID%20desc%20limit%201000&sink_profile=5804911c87b25b0e5b29653e&cluster_profile=5804911a87b25b0e5b29653b&start=0&rows=500&api_key=35454545'
    smartSinkQueryUrl:'http://24.16.42.120:5000/platalytics/api/version/developers_interface/process/5811ef825b2686b20192a382/smart_sink/58a4650c6ad364cbcc108bd8/?query=select%20Predicted_label_sentiment%20as%20PREDICTED_SENTIMENT,Tweet_Id,%20userName,%20screenName,location,dateTime%20,status,%20HashTags%20from%20TABLE58A4650C6AD364CBCC108BD8%20where%20HashTags%20is%20not%20null%20and%20HashTags%20%3C%3E%20%27null%27%20order%20by%20TWEET_ID%20desc%20limit%201000&sink_profile=5804911c87b25b0e5b29653e&cluster_profile=5804911a87b25b0e5b29653b&start=0&rows=500&api_key=35454545'
}