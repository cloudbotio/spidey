var mongojs = require('mongojs');
var config = require("../../config/general");
config = config[config.state].db;

var log = require("winston");

var DEFAULT_PORT = 27017;

var Mongo = function(config) {
	
	if(arguments.callee._singletonInstance)
		return arguments.callee._singletonInstance;
	
	arguments.callee._singletonInstance = this;
	
	var db = mongojs(connection_string());
	
	var exports = {};
	var collections = {};

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

	function connect(col, cb) {

		cb = cb || function(){};
		
		if(!collections[col]) {
			
			collections[col] = db.collection(col);
			log.info("new collection connected: " + col.toString());
		}
		
		if(!collections[col])
			throw new Error("Could not connect to collection '"+col+"'");
		
		return collections[col]

	}; exports.connect = connect;
	
	function close() {
		
		return null;
		this = null;
		
	}; exports.close = close;

	function init() {
		
		log.info("initializing mongo...");
		return exports;
	}
	
	return init();
}

module.exports = new Mongo(config);