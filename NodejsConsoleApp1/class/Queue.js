var when = require('when');
var q = require('q');
var fs = require('fs');
var path = require('path');
var fsExtra = require('fs-extra');
//var rimraf = require('rimraf');
//var mkdirp = require('mkdirp');

module.exports = function (redis, RootSourceDirectory, RootDestinationDirectory) {
    _rootSourceDirectory = RootSourceDirectory;
    _rootDestinationDirectory = RootDestinationDirectory;
    _redis = redis;
    
    function _StartProcessing() {
        when(_Process(true)).then(_Process(false));
    }

    function _Process(IsDirectory) {
        _redis.Get(IsDirectory, _ProcessQueue);
    }
    
    function _ProcessQueue(IsDirectory, data) {
        //TODO: add anti-duplicates protection
        var arrFunctions = [];
        
        if ((data) && (data.length > 0)) {
            
            data.forEach(function (el, index) {
                arrFunctions.push(q.nfcall(_ProcessPath, el, IsDirectory));
            });
            
            return q.all(arrFunctions);
        }
    }
    
    function _ProcessPath(Path, IsDirectory) {
        
        //console.log('serge1');
        
        fs.stat(Path, function (err, data) {
            var clearPath = Path.replace(this._rootSourceDirectory, '').replace(/^\//, '');
            //console.log(clearPath);
            
            var tmpDestinationPath = path.join(this._rootDestinationDirectory, clearPath);
            
            //source file/directory doesn't exists
            if (err) {
                
                fsExtra.remove(tmpDestinationPath, function (err) {
                    //rimraf(tmpDestinationPath, { disableGlob: false }, function (err) {
                    if (err) {
                        console.log("error (rmdir):" + tmpDestinationPath + "~" + err);
                    }
                });
            }
            else {
                //checking destination file/folder
                fs.stat(tmpDestinationPath, function (err, data) {
                    
                    //destination file/folder doesn't exists
                    if (err) {
                        if (IsDirectory) {
                            fsExtra.mkdirs(tmpDestinationPath, function (err) {
                                if (err) {
                                    console.log("error (mkdirp):" + tmpDestinationPath + "~" + err);
                                }
                            });
                        }
                        else {
                            fsExtra.copy(Path, tmpDestinationPath, function (err) {
                                if (err) {
                                    console.log("error (mkdirp):" + tmpDestinationPath + "~" + err);
                                }
                            });
                        }
                    }
                    else { 
                        //TODO: add option to force update folder content
                        if (!IsDirectory) {
                            fsExtra.remove(tmpDestinationPath, function (err) {
                                if (err) {
                                    console.log("error (update file#1):" + tmpDestinationPath + "~" + err);
                                }
                                else {
                                    fsExtra.copy(Path, tmpDestinationPath, function (err) {
                                        if (err) {
                                            console.log("error (update file#1):" + tmpDestinationPath + "~" + err);
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            }
        });
    }
    
    return {
        StartProcessing : _StartProcessing
    };
}