module.exports = {
    testUser : {
        id : '54f81d07f7da9fde14330cb9'
    },
    database:{
        ip:'54.210.111.41',
        db:'test'
    },
    pipelineId:'5808c8da6f369aeb02a680a3',//http://104.236.95.15:7777
    //smartSinkQueryUrl:'http://45.55.159.119:3000/sinkHelpers/executeQuery?pipeline=56278682a8aabf373bf11c56:562e4c48fd65829b3ba4c025;&query=select%20*%20from%20table562e4c48fd65829b3ba4c025%20where%20HASHTAGS%20is%20not%20null%20order%20by%20TWEET_ID%20DESC&tool=phoenix&sink_type=smart'+'&test_user=54f81d07f7da9fde14330cb9'
    smartSinkQueryUrl:'http://52.91.170.51:7777/services/api/querysink/getData?process=5808c8da6f369aeb02a680a3%3A5808cc6487b25b0e5b29656f%3B&query=select%20*%20from%20TABLE5808CC6487B25B0E5B29656F&sink_type=smart&start=0&rows=500&sink_profile=5804911c87b25b0e5b29653e&cluster_profile=5804911a87b25b0e5b29653b'

};

