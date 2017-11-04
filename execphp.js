/**
*
*/

var path = require('path');
var url = require('url');


class ExecPHP {
	/**
	*
	*/
	constructor() {
		this.phpPath = 'php';
		this.phpFolder = '';
	}	
	/**
	*
	*/
	parseFile(fileName, callback) {


		var urlPath = url.parse(fileName).pathname;
		var realFileName = this.phpFolder + urlPath;
		var param = url.parse(fileName).query;

		console.log('parsing file: ' + realFileName + ' ' + param);
		
		var exec = require('child_process').exec;
		var cmd = this.phpPath + ' ' + realFileName + ' ' + param;
		
		exec(cmd, function(error, stdout, stderr) {
			callback(stdout);
		});
	}
}
module.exports = function() {
	return new ExecPHP();
};
