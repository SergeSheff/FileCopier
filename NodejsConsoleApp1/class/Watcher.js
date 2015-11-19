var fs = require('fs');
var chokidar = require('chokidar');

module.exports = function (DirectoryToWatch) {
    
    fs.stat(DirectoryToWatch, function (err, data) {
        if (!err) {
            //directory exists
            StartWatching();
        }
        else {
            throw err;
        }
    });
       
        
    function StartWatching() {
        
        var _redis = require('./Redis.js');
        
        var tmp = new _redis();

        _redis.Add('test');

        // Initialize watcher. 
        var watcher = chokidar.watch(DirectoryToWatch,{
            ignored: /[\/\\]\./,
            persistent: true,
            ignoreInitial  : true
        });


        watcher.on('all', function (path, stats) { 
            _redis.Add(path);
        });
        
    }




}