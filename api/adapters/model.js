//////////////////////////////////////////////////////////
//														//
//			Model Adapter - Framework default			//
//														//
//////////////////////////////////////////////////////////

// model dependencies
var extend = require("extend");
var crypto = require("crypto");
var mongo = require("./mongo");
var log = require("winston");

var lang = require("../../language").getDefault();

var validate = require('validator').check;
var sanitize = require('validator').sanitize

// default password encryption algorithm
var DEFAULT_ENCRYPTION = "sha256";

//////////////////////////////////////////////////////////
//														//
//		Type Casting and Validation						//
//														//
//////////////////////////////////////////////////////////

var Type = function() {

	var exports = {};
	var handlers = {};

	// integer
	function int(input) {

		validate(input, {

			notNull: lang.type.not_null || 'The input should not be null',
			isNumeric: lang.type.not_numeric || 'Input is not a number',
			isInt: lang.type.not_integer || 'The input is not an integer'

		}).notNull().isNumeric().isInt();

		return true;
	}; 

	handlers.int = {
		tags: ["int", "integer"],
		check: int
	}

	// string
	function string(input) {

		validate(input, {

			notNull: lang.type.not_null || 'The input should not be null',

		}).notNull();

		if(typeof input !== typeof "str") {
			throw new Error(lang.type.not_string || "The input should be a string");
		}

		return true;
	}

	handlers.string = {
		tags: ["str", "string"],
		check: string
	}

	// password
	function password(input) {

		try {

			if(toString.call(input) !== toString.call({}))
				throw new Error(lang.type.not_object || "Input is not an object")

			if(typeof input._encrypted === typeof "str")
				return true;

			else
				throw new Error(lang.type.not_encrypted || "Input is a not an encrypted password");
		}

		catch(e)
		{

			// validate string
			string(input);

			if(!input.length || input.length < 8) {
				throw new Error(lang.type.not_enough_length || "The input should be at least 8 characters length");
			}
			
			return true;
		}
	}

	handlers.password = {
		tags: ["pass", "password"],
		check: password
	}

	// email
	function email(input) {

		if(typeof input !== typeof "str") {
			throw new Error(lang.type.not_string || "The input should be a string");
		}

		else {

			if(input.indexOf('@') == -1 || input.indexOf('.') == -1){
				throw new Error(lang.type.not_email || "The input should be a valid email");
			}

			try {

				var domain = input.split('@')[1];

				if(domain.length < 3)
					throw new Error();
			}
			catch(e) {
				throw new Error(lang.type.not_valid_domain || "The email domain should be valid.");
			}
		}

		return true;
	};

	handlers.email = {
		tags: ["email"],
		check: email
	}

	// object {}
	function object(input) {

		if(input === null) {
			throw new Error(lang.type.not_null ||"The input should not be null.");
		}

		if(typeof input !== typeof {}) {
			throw new Error(lang.type.not_object || "The input should be an object.");
		}

		if(toString.call(input) != toString.call({})) {
			throw new Error(lang.type.not_object || "The input should be an object.");
		}

		return true;
	};

	handlers.object = {
		tags: ["object", "obj"],
		check: object
	}

	// array []
	function array(input) {

		if(input === null) {
			throw new Error(lang.type.not_null || "The input should not be null.");
		}

		if(typeof input !== typeof []) {
			throw new Error(lang.type.not_array || "The input should be an array.");
		}

		if(toString.call(input) != toString.call([])){
			throw new Error(lang.type.not_array || "The input should be an array.");
		}

		return true;
	};

	handlers.array = {
		tags: ["array", "arr"],
		check: array
	}

	// get validation by name
	function get(str) {
		for(var k in handlers)
			for(var i = 0; i < handlers[k].tags.length; i++)
				if(handlers[k].tags[i] == str)
					return handlers[k]

		return false;

	}; exports.get = get;

	function init(){
		exports.handlers = handlers;
		return exports;
	}

	return init();
}

//////////////////////////////////////////////////////////
//														//
//			Model Class - Framework default				//
//														//
//////////////////////////////////////////////////////////

var Model = function(type) {
	
	var exports = {type: type};

	var _model = {

		_id: {
			type: "string",
			default: "hashkey",
			required: true
		},

		_timestamp: {
			type: "string",
			default: "timestamp",
			required: true
		},

		_toJSON: function(_this) {
			
			if(_this.sanitize)
				_this = _this.sanitize(_this) || _this;
			
			if(_this._sanitize)
				_this = _this._sanitize(_this) || _this;

			return JSON.stringify(_this);
		},

		toJSON: function(_this) {
			
			if(_this.sanitize)
				_this = _this.sanitize(_this) || _this;
			
			else if(_this._sanitize)
				_this = _this._sanitize(_this) || _this;


			if(_this.toJSON())			
				return _this.toJSON(_this);
			
			else if(_this._toJSON())	
				return _this._toJSON(_this);
			
			else 
				return JSON.stringify(_this);
		}
	};

	function _sanitize(_this) {

		for(var k in _this) {
			if(toString.call(_this[k]) == toString.call(function(){}))
				delete _this[k];
		}

		if(_this && _this._timestamp)
			delete _this.timestamp

		if(_this && _this._model)
			delete _this._model

		return _this;
	}

	function encrypt(value, method){

		method = method || DEFAULT_ENCRYPTION || "sha256";

		if(toString.call(value) == toString.call({})
			&& value._encrypted)
			return value;

		try {
			return {
				_encrypted: crypto.createHash(method).update(value).digest("hex"),
				_method: method
			};

		} catch(e) {
			log.error(e)
			throw new Error((lang.model.encryption_error + "." || "Problem encrypting string." ) + 
				" Method: " + (method || "sha256") + " algorithm.");
		}
	}

	function generate_default(d) {

		if(d == "hashkey") {

			try {

				var buf = crypto.randomBytes(16);
				return buf.toString('base64').replace(/\W/g, '');

			} catch (e) {
				throw new Error(lang.model.hash_error || "Problem generating random hash.");
			}
		}

		else if(d == "timestamp")
			return (new Date()).toISOString()

		else if(d == "null" || d == null)
			return null

		else
			return d;
	} 

	function initialize(obj, model) {

		// validate
		for(var k in model) {

			if(toString.call(model[k]) == toString.call(function(){})) {
				obj[k] = model[k]
			}

			else if(model[k].required || model[k].type == "password") {

				try {

					if(!type.get(model[k].type))
						throw new Error((lang.type.unknown || "Specified type is not recognized") +  "("+model[k].type+")")

					type.get(model[k].type).check(obj[k]);
				}

				catch(e) {

					if(model[k].defaultTo || model[k].defaults || model[k].default)
						obj[k] = generate_default(model[k].defaultTo || model[k].defaults || model[k].default)
						
					else
						throw new Error((lang.model.validation_error || "Could not parse required field") + " '" + k + "'. " + e.message.toString());
				}
			}

			else {

				try {
					type.get(model[k].type).check(obj[k]);
				}

				catch(e) {
					obj[k] = null
				}
			}

			if(model[k].type == "password") {

				if(model[k] !== false && (!model[k].encryption || model[k].encryption == true))
					model[k].encryption = DEFAULT_ENCRYPTION || "sha256";

				obj[k] = encrypt(obj[k], model[k].encryption)
			}

			if(model[k].validate && obj[k]
				&& typeof model[k].validate === typeof function(){}) {

				try {

					var res = model[k].validate(obj[k]);

					if(!res)
						throw new Error("Validation error");
				}

				catch(e) {
					throw new Error((lang.model.validation_error || "Could not parse required field") + " '" + k + "'. " + e.message.toString());
				}
			}
		}

		return obj;
	};

	function create(name, input) {

		var m = require("../models/" + name + "_model");

		// check sanitizer
		if(m.sanitize)
			m.sanitize = m.sanitize;
		else
			m.sanitize = _sanitize;
		
		m._sanitize = _sanitize;

		var created = {}

		extend(created, _model);
		extend(created, m);

		created = initialize(input, created);
		extend(created, {_model: name});

		return created;

	}; exports.create = create;

	function save(obj, cb) {

		cb = cb || function(){};
		
		if(!obj._model || obj._model == null || obj._model == "") {
			throw new Error(lang.model.not_from_framework || "Object provided is not from any framework model, we can't persist it");
		}

		if(!obj._id) {
			throw new Error(lang.model.not_primary_key || "Object provided has none primary key, the default '_id' was removed");
		}

		// ensure encryption
		var db = mongo.connect(obj._model);
		obj = create(obj._model, obj);

		// place timestamp by default
		obj.timestamp = obj.timestamp || (new Date()).toISOString();

		return db.find({

			_id: obj._id

		}, function(err, docs) {

			if(err)
				throw new Error((lang.database.query_error || "Problem querying database") +". "+ err.message.toString());

			if(!docs || docs.length == 0) {
				
				if(obj.sanitize)
					obj = obj.sanitize(obj) || obj;
				
				if(obj._sanitize)
					obj = obj._sanitize(obj) || obj;

				db.save(obj, function(err, obj){

					if(err)
						throw new Error((lang.database.query_error || "Problem querying database") +". "+ err.message.toString());

					cb(true);
				});
			}

			else {

				db.update({
					_id: obj._id
				}, obj, {multi:false}, function(err) {

					if(err)
						throw new Error((lang.database.query_error || "Problem querying database") +". "+ err.message.toString());

					cb(true);
				});

			}
		})

		return true;

	}; exports.save = save;

	var find = function(name, rest, cb) {

		rest = rest || {};

		var m = require("../models/" + name + "_model");

		for(var k in rest) {
			if(m[k] && m[k].type == "password" && m[k].encryption !== false)
				rest[k] = encrypt(rest[k], m[k].encryption)
		}
		
		var findCallback = function(err, docs, cb) {
			
			if(err) {
				throw new Error((lang.database.query_error || "Problem querying database") +". "+ err.toString());
			}
	
			for(var i = 0; i < docs.length; i++) {
	
				docs[i] = create(name, docs[i]);
			}
	
			cb(docs || []);
		};

		var db = mongo.connect(name);
		
		var l = rest.limit || 0;
		if(rest.limit) delete rest.limit
		
		if(rest.sort) {
			var s = rest.sort;
			delete rest.sort;
			
			return db.find(rest).limit(l).sort(s, function(err, docs){
				
				findCallback(err, docs, cb);
				
			});
		}
		else
			return db.find(rest, function(err, docs){
				
				findCallback(err, docs, cb);
				
			});

	}; exports.find = find;
	
	function findAndModify(name, rest, set, cb) {

		name = name;
		cb = cb || function(){};
		rest = rest || {};

		var m = require("../models/" + name + "_model");

		for(var k in rest) {
			if(m[k] && m[k].type == "password" && m[k].encryption !== false)
				rest[k] = encrypt(rest[k], m[k].encryption)
		}

		var db = mongo.connect(name);

		db.findAndModify({
			query: rest,
			update: set,
			new: false
		}, function(err, docs) {

			if(err) {
				throw new Error((lang.database.query_error || "Problem querying database") +". "+ err.toString());
			}

			for(var i = 0; i < docs.length; i++) {

				docs[i] = create(name, docs[i]);
			}

			cb(docs || []);

		});

	}; exports.findAndModify = findAndModify;
	
	function remove(name, rest, cb) {

		name = name;
		cb = cb || function(){};
		rest = rest || {};

		var db = mongo.connect(name);

		db.remove(rest);
		cb(true);

	}; exports.remove = remove;

	function clear(name, cb) {

		name = name;
		cb = cb || function(){};

		var db = mongo.connect(name);

		db.remove();
		cb(true);

	}; exports.clear = clear;

	function init() {
		return exports;
	};

	return init();
}

module.exports = new Model(new Type());