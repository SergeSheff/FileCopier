var Config = require('config');
var Walk = require('walk');
var mkdirp = require('mkdirp');

const UBUNTU_PATH = "UbuntuPath";
const WINDOWS_PATH = "WindowsPath";
const LIST_OF_EXCLUDED_FOLDERS = ['node_modules'];

var Copier = function (isCopyFromWindows) {
		
	function _GetConfig(ConfigName) {
		if (Config.has(ConfigName)) {
			var _tmpConfig = Config.get(ConfigName).toString();
			if (_tmpConfig.trim().length > 0) {
				return _tmpConfig;
			}
		}
		
		throw new Error("Incorrect path: " + ConfigName);
	}
	
	var _isCopyFromWindows = isCopyFromWindows;
	var _ubuntuPath = _GetConfig(UBUNTU_PATH);
	var _windowsPath = _GetConfig(WINDOWS_PATH);
	
	this.Copy = function () {
		
		var _fromPath = ( _isCopyFromWindows? WINDOWS_PATH : UBUNTU_PATH);
		var _toPath = (_isCopyFromWindows ? UBUNTU_PATH : WINDOWS_PATH);
		
		_fromPath = _GetConfig(_fromPath);
		_toPath = _GetConfig(_toPath);
				
		var _walkerOptions = {
			followLinks: true
			, filters: LIST_OF_EXCLUDED_FOLDERS
		}

		var _walker = Walk.walk(_fromPath, _walkerOptions);
		
		_walker.on("file", function (root, fileStats, next) { 

			next();

		});
		
		_walker.on("end", function () {
			console.log("End");
			process.exit();
		});
	
		console.log('test');
	}

}


var _Add = function (Path, IsFile) { 

    if (IsFile) {
        var directory = Path.replace(/\/[^\/] + $/, '');
        //create directory
        _Add(directory, false);

        //copy file


    }
    else {
        mkdirp(Path, function (err) {
            if (err) {
                console.log(err);
            }
            else {
                return true;
            }
        });
    }
}

var _Delete = function (Path, IsFile){

}

var _Rename = function (Path, IsFile){

}




Copier.Copy = function(command) {
    const REGEX_ADD = /^add/;
    const REGEX_DELETE = /^unlink/;
    const REGEX_CHANGE = /^change$/;
    const REGEX_IS_DIRECTORY = /Dir\s~/;
    const REGEX_CLEANUP = /^[^~]*~\s?/;
     
    
    var IsFile = (command.match(REGEX_IS_DIRECTORY) ? false : true);
    var path = command.replace(REGEX_CLEANUP, '');
    
    if (command.match(REGEX_ADD)) { 
        _Add(path, IsFile);
    }

    else if (command.match(REGEX_DELETE)) {
        //_dele(path, IsFile);
    }
    else if (command.match(REGEX_CHANGE)) { 
    }



}


module.exports = Copier();
