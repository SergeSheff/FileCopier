var redis = require('redis');

module.exports = function () {
    const KEY_FILES = "CopierFiles";
    const KEY_DIRECTORIES = "CopierDirectories"
    const SPLIT_CHAR = "~";
    
    var client = redis.createClient();
   
    client.on("error", function (err) {
        
        console.log("Error " + err);

    });
        
    this.Add = function _Add(Action, Object) {
        
        var data = Object;
        
        //is this folder?
        if (Action.indexOf('Dir') >= 0) {
            client.sadd(KEY_DIRECTORIES, data);
        }
        else {
            client.sadd(KEY_FILES, data);
        }
    }
    
    this.Get = function Get(IsDirectory, Next) {
        var key = (IsDirectory ? KEY_DIRECTORIES : KEY_FILES);
        
        client.smembers(key, function (err, data) {
            //console.log('Redis->Get: ' + data);
            
            if (data) {
                //cleanup cache
                client.del(KEY_FILES, function (err, data) {
                    //console.log('deleted')
                });

                Next(IsDirectory, data);
            }
            else { 
                throw err;
            }
        });
    }
    
    this.Cleanup = function _Cleanup(IsDirectory) {
        var key = (IsDirectory ? KEY_DIRECTORIES : KEY_FILES);

        client.exists(key, function (err, data) {
            
            if (data === 1) {
                //console.log('exists');
                
                client.del(KEY_FILES, function (err, data) {
                    //console.log('deleted')
                });
            }
        });
    }
 }

 