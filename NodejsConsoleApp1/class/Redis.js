var redis = require('redis');

module.exports = function () {
    const KEY_NAME = "CopierKey";
    
    var client = redis.createClient();    
    
    client.on("error", function (err) {
        
        console.log("Error " + err);
    });            
    
    this.Add = function _Add(DirectoryName) {
        client.sadd(KEY_NAME, DirectoryName);    }        function Get() {
        client.smembers(KEY_NAME, function (err, data) {
            
            console.log(data);
        });
    }        function CleanUp() {
                client.exists(KEY_NAME, function (err, data) {
            
            if (data === 1) {
                //console.log('exists');                
                client.del(KEY_NAME, function (err, data) {
                    //console.log('deleted')                });            }        });    }
    //return {
    //    Add : _Add,
    //    Get : Get,
    //    CleanUp : CleanUp
    //};
 }

 