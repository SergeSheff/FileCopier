var fs = require('fs');
var chokidar = require('chokidar');

module.exports = function (DirectoryToWatch, redis) {

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
        // Initialize watcher. 
        var watcher = chokidar.watch(DirectoryToWatch,{
            ignored: /[\/\\]\./,
            persistent: true,
            ignoreInitial  : true
        });

        watcher.on('all', function (path, stats) {
            redis.Add(path, data);
        });
    }
}