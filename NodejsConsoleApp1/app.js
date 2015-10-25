var isSyncWithWindows = false;
const TO_WINDOWS = 'ToWindows';


var arrArguments = process.argv;
if ((typeof arrArguments == 'object') && (arrArguments.length > 0)) {
	if (TO_WINDOWS.trim().toLowerCase() == arrArguments[0].trim().toLowerCase()) { 
		isSyncWithWindows = true;
	}
}


var Copier = require('./class/Copier.js');//.constructor(isSyncWithWindows);
var _copier = new Copier(isSyncWithWindows);
_copier.Copy();


console.log('Hello world');