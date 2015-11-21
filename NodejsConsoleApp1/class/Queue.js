//var when = require('when');
var q = require('q');

module.exports = function (redis) {
    
    _redis = redis;

    function _StartProcessing() {
        _ProcessDirectories().then(_ProcessFiles());
    }

    function _ProcessDirectories() {
        var data = _redis.Get(false);
        
        var arrFunctions = [];
        if (data) {
            data.forEach(function (el, index) { 
                arrFunctions.push(q.nfcall(fn, el));
            });
        }

        return q.all(arrFunctions);
    }
    
    
    function _ProcessFiles(){}


    return {
        StartProcessing : _StartProcessing
    };



}