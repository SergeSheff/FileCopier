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
    }        function Get(IsFiles) {
        var key = (IsFiles ? KEY_FILES : KEY_DIRECTORIES);
        
        client.smembers(key, function (err, data) {
            
            console.log(data);            
            if (data) {
                return data;
            }
            else { 
                throw err;
            }
        });
    }        function CleanUp() {
                client.exists(KEY_FILES, function (err, data) {
            
            if (data === 1) {
                //console.log('exists');                
                client.del(KEY_FILES, function (err, data) {
                    //console.log('deleted')                });            }        });    } }

 