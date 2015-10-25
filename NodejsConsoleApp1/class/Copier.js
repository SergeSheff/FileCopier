var Config = require('config');
var Walk = require('walk');

const UBUNTU_PATH = "UbuntuPath";
const WINDOWS_PATH = "WindowsPath";
const LIST_OF_EXCLUDED_FOLDERS = ['node_modules'];

module.exports = function Copier(isCopyFromWindows) {
		
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

