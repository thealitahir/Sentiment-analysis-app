module.exports = {
    testUser : {
        id : '54f81d07f7da9fde14330cb9'
    },
    database:{
        ip:'104.131.121.156',
        db:'test'
    },
    pipelineId:'5762642339c694851c8d6d4d',
    //smartSinkQueryUrl:'http://45.55.159.119:3000/sinkHelpers/executeQuery?pipeline=56278682a8aabf373bf11c56:562e4c48fd65829b3ba4c025;&query=select%20*%20from%20table562e4c48fd65829b3ba4c025%20where%20HASHTAGS%20is%20not%20null%20order%20by%20TWEET_ID%20DESC&tool=phoenix&sink_type=smart'+'&test_user=54f81d07f7da9fde14330cb9'
    smartSinkQueryUrl:'http://104.236.89.36:5000/platalytics/api/version/developers_interface/process/5762642339c694851c8d6d4d/smart_sink/57626423a4337cef85bc7eb3/?query=select%20*%20from%20TABLE57626423A4337CEF85BC7EB3&start=0&rows=500&api_key=35454545'+'&test_user=54f81d07f7da9fde14330cb9'

};

