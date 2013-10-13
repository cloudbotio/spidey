var mongojs = require('mongojs');
var config = require("../../config/general");
config = config[config.state].db;

var DEFAULT_PORT = 27017;

var Mongo = function(config) {
	
	if(arguments.callee._singletonInstance)
		return arguments.callee._singletonInstance;
	
	arguments.callee._singletonInstance = this;

	var exports = {};

	function connection_string() {

		var str = config.protocol;
		str = str + config.user

		if(config.password && config.password.length > 0) {
			str = str + ":" + config.password;
		}

		str = str + "@" + config.host + ":" + (config.port || DEFAULT_PORT);
		str = str + "/" + (config.db || "");
		return str;
	}

	function connect(collection, cb) {

		cb = cb || function(){};

		var db = mongojs(connection_string(), [collection]);

		if(!db[collection])
			throw new Error("Could not connect to collection '"+collection+"'");

		return db[collection];

	}; exports.connect = connect;
	
	function close() {
		
		return null;
		this = null;
		
	}; exports.close = close;

	function init() {
		
		console.log("mongo");
		return exports;
	}

	return init();
}

module.exports = new Mongo(config);